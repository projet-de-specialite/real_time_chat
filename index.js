const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");


const userRoute = require("./routes/users")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")
/** Swagger */
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

/**Mongo Db connexion */
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to database!');
})
    .catch((error) => {
        console.error('Error Failed to connect to database:', error);
    });

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple User API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/** middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

/** Routes */
app.use("/api/users", userRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/messages", messageRoute);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log("server running on port 3000");
})