const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const fs = require('fs');

const userRoute = require("./routes/users");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

/** Swagger */
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const db = require("./firebase");

/** middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

var allowedOrigins = [process.env.FRONT_URL, process.env.FRONT_URL];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ['*']
}));

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
                url: `http://localhost:${process.env.SERVER_PORT}`,
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

// 'dev', 'staging', 'prod'
const env = process.env.NODE_ENV;

// Load .env file if it exists and we are in a 'development' environment
if (env === 'dev') {
    const envPath = `.env.${env}`;
    if (fs.existsSync(envPath)) {
        const result = dotenv.config({ path: envPath });
        if (result.error) {
            throw result.error;
        }
    }
}

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server running on port ${process.env.SERVER_PORT}`);
});

module.exports = { app, firestore: db };
