const router = require("express").Router();
const firestore = require("../firebase");
const admin = require("firebase-admin");

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - conversationId
 *         - sender
 *         - text
 *       properties:
 *         conversationId:
 *           type: string
 *           description: The conversation ID
 *         sender:
 *           type: string
 *           description: The sender's user ID
 *         text:
 *           type: string
 *           description: The message text
 *       example:
 *         conversationId: 6076f7047e8466001570e7d8
 *         sender: 6076f7047e8466001570e7d9
 *         text: Hello, how are you?
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Add a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: A message object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
    const newMessage = {
        conversationId: req.body.conversationId,
        sender: req.body.sender,
        text: req.body.text,
        createdAt: admin.firestore.Timestamp.now(),
    };

    try {
        const savedMessage = await firestore.collection("messages").add(newMessage);
        res.status(200).json({ id: savedMessage.id, ...newMessage });
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Retrieve messages from a specific conversation
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: An array of message objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.get("/:conversationId", async (req, res) => {
    try {
        const messagesRef = firestore.collection("messages");
        const snapshot = await messagesRef
            .where("conversationId", "==", req.params.conversationId)
            .get();

        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;