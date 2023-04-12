const router = require("express").Router();
const firestore = require("../firebase");
const admin = require("firebase-admin");
/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - users
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs participating in the conversation
 *       example:
 *         users: {senderId:'6076f7047e8466001570e7d9', receiverId:'6076f7047e8466001570e7da'}
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     tags:
 *       - Conversations
 *     summary: Create a new conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversation'
 *     responses:
 *       200:
 *         description: A conversation object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
    if (!req.body.senderId || !req.body.receiverId) {
        return res
            .status(400)
            .json({ message: "senderId and receiverId are required" });
    }

    const newConversation = {
        users: [req.body.senderId, req.body.receiverId],
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
    };

    try {
        const savedConversation = await firestore
            .collection("conversations")
            .add(newConversation);
        res.status(201).json({ id: savedConversation.id, ...newConversation });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
});

/**
 * @swagger
 * /api/conversations/{userId}:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Retrieve conversations of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: An array of conversation objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error
 */

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversationsRef = firestore.collection("conversations");
        const snapshot = await conversationsRef.get();

        const conversations = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.users.includes(userId)) {
                conversations.push({ id: doc.id, ...data });
            }
        });

        res.status(200).json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});




/**
 * @swagger
 * /api/conversations/find/{firstUserId}/{secondUserId}:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Retrieve a conversation between two users
 *     parameters:
 *       - in: path
 *         name: firstUserId
 *         schema:
 *           type: string
 *         required: true
 *         description: First user ID
 *       - in: path
 *         name: secondUserId
 *         schema:
 *           type: string
 *         required: true
 *         description: Second user ID
 *     responses:
 *       200:
 *         description: A conversation object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       500:
 *         description: Internal server error
 */
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversationsRef = firestore.collection("conversations");
        const snapshot = await conversationsRef
            .where("users", "array-contains", req.params.firstUserId)
            .get();

        let conversation = null;
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.users.includes(req.params.secondUserId)) {
                conversation = { id: doc.id, ...data };
            }
        });

        if (conversation) {
            res.status(200).json(conversation);
        } else {
            res.status(404).json({ message: "Conversation not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
