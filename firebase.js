console.log("Loading firebase.js");

const admin = require("firebase-admin");
const serviceAccount = require("./credentials");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = firestore;
