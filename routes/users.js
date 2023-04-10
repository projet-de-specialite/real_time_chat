const router = require('express').Router();
const axios = require('axios');

router.get("/", (req, res) => {
    res.send("Hello User!")
});

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