const router = require("express").Router();
const Conversation = require("../models/Conversation");

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - members
 *       properties:
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs participating in the conversation
 *       example:
 *         members: {senderId:'6076f7047e8466001570e7d9', receiverId:'6076f7047e8466001570e7da'}
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
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
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
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
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
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;