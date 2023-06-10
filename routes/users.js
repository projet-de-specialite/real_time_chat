const axios = require('axios');
const router = require("express").Router();
const admin = require("firebase-admin");
const firestore = admin.firestore();
const usersCollection = firestore.collection('users');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The User managing api
 */
/**

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID from JSONPlaceholder API
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id);
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        console.log(response.data);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json(err);
    }
});


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by userId or username
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: The user id
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        let user;
        if (userId) {
            const userDoc = await usersCollection.doc(userId).get();
            user = userDoc.data();
        } else if (username) {
            const userSnapshot = await usersCollection.where('username', '==', username).get();
            userSnapshot.forEach(doc => {
                user = doc.data();
            });
        }
        if (user) {
            const { password, updatedAt, ...other } = user;
            res.status(200).json(other);
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


/**
 * @swagger
 * /api/users/friends/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve the friends of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's id
 *     responses:
 *       200:
 *         description: An array of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const userDoc = await usersCollection.doc(req.params.userId).get();
        const user = userDoc.data();
        const friends = await Promise.all(
            user.followings.map(async (friendId) => {
                const friendDoc = await usersCollection.doc(friendId).get();
                return friendDoc.data();
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;