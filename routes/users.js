const router = require('express').Router();
const axios = require('axios');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The User managing api
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns a greeting message
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A greeting message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/", (req, res) => {
    res.send("Hello User!")
});
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

module.exports = router;