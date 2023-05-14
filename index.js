const express = require("express");
const app = express();
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

const db = require("./firebase");

/** middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

/** Routes */
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


/** Swagger Setup */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat application microservice',
            version: '1.0.0',
            description: 'this is real time chat ',
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

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// This middleware function should be added after all other middleware functions
// and route handlers.
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware function.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(3000, () => {
    console.log("server running on port 3000");
});

module.exports = { app, firestore: db };