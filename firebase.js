const admin = require("firebase-admin");
const serviceAccount = require("./real-time-chat-383408-b7ee3f34ffaa.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = firestore;
