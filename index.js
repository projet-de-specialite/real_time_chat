const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')();

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const userRoute = require("./routes/users")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")

/** Swagger */
const swaggerUi = require('swagger-ui-express');

dotenv.config();

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
const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/users.js', './routes/conversation.js', './routes/message.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    const swaggerDocument = require('./swagger_output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});

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

// Load  .env file
const result = dotenv.config({ path: `.env.${env}` });

if (result.error) {
    throw result.error;
}

app.listen(6000, () => {
    console.log("server running on port 3000");
});

module.exports = { app, firestore: db };
