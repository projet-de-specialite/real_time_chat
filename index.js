const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to database!');
})
    .catch((error) => {
        console.error('Failed to connect to database:', error);
    });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.get("/", (req, res) => {
    res.send("Hello World !")
});

app.use("/api/users", userRoute);
app.listen(3000, () => {
    console.log("server running on port 3000");
})