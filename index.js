const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./firebase");
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const server_url = process.env.SERVER_URL;

/** Swagger */
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

/** middleware */
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", server_url],
            },
        },
    })
);

app.use(morgan("common"));

const allowedOrigins = [process.env.FRONT_URL];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
    })
);

/** Routes */
app.use("/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

/** Swagger Setup */
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Chat application microservice",
            version: "1.0.0",
            description: "this is real-time chat",
        },
        servers: [
            {
                url: `${server_url}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const requestDurationMetric = new client.Histogram({
    name: "api_request_duration_seconds",
    help: "Duration of API requests in seconds",
    labelNames: ["route", "method"],
    buckets: [0.1, 0.5, 1, 2, 5], // Define the buckets for the histogram
});

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const end = Date.now();
        const durationInSeconds = (end - start) / 1000;

        requestDurationMetric.labels(req.path, req.method).observe(durationInSeconds);
    });

    next();
});

app.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", client.register.contentType);
        const metrics = await client.register.metrics();
        res.send(metrics);
    } catch (error) {
        res.status(500).json({
            error: {
                message: error.message,
            },
        });
    }
});

// Custom route handler for calculating the average duration of /api/users/all GET requests
app.get("/api/users/all/duration", async (req, res) => {
    try {
        const avgDuration = await client.register.getSingleMetricAsString(
            `sum(rate(api_request_duration_seconds_sum{route="/api/users/all", method="GET"}[1m])) / sum(rate(api_request_duration_seconds_count{route="/api/users/all", method="GET"}[1m]))`
        );
        res.json({ avgDuration });
    } catch (error) {
        res.status(500).json({
            error: {
                message: error.message,
            },
        });
    }
});

// 404 route handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Error handling middleware function.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// 'dev', 'staging', 'prod'
const env = process.env.NODE_ENV;

// Load .env file if it exists and we are in a 'development' environment
if (env !== "prod") {
    const envPath = `.env.${env}`;
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
}

app.listen(process.env.SERVER_PORT, "0.0.0.0", () => {
    console.log(process.env.SERVER_PORT);
    console.log(`server running on port ${server_url}`);
});

module.exports = { app, firestore: db };