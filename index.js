const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const db = require("./firebase");
const fs = require('fs');

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

/** Swagger */
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



//const { auth } = require("firebase-admin");

/** middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

var allowedOrigins = [process.env.FRONT_URL, process.env.FRONT_URL, 'http://localhost:3000'];

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
app.use("/auth", authRoute);
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
                url: 'localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
});

// 'dev', 'staging', 'prod'
const env = process.env.NODE_ENV;

// Load .env file if it exists and we are in a 'development' environment

const envPath = `.env.${env}`;

const result = dotenv.config({ path: envPath });
if (result.error) {
    throw result.error;
}


app.listen(process.env.SERVER_PORT, () => {
    console.log(process.env.SERVER_PORT);
    console.log(`server running on port ${process.env.SERVER_URL}`);
});

module.exports = { app, firestore: db };
