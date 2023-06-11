const router = require("express").Router();
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");

const firestore = admin.firestore();
const usersCollection = firestore.collection('users');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: test
 *         email: test@test.com
 *         password: test1234
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post("/signup", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        };

        // save user and respond
        const userDoc = await usersCollection.add(newUser);
        const userId = userDoc.id;

        // update user document with the auto-generated ID as userId
        await usersCollection.doc(userId).update({ id: userId });

        // add userId and other user data to the response
        const user = { id: userId, ...newUser };
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});




/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: test@test.com
 *               password: test1234
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Wrong password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
//LOGIN
router.post("/signin", async (req, res) => {
    try {
        const userSnapshot = await usersCollection.where('username', '==', req.body.username).limit(1).get();
        if (userSnapshot.empty) {
            res.status(404).json("user not found");
            return;
        }

        const user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;
