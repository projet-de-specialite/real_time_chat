const admin = require('firebase-admin');

let serviceAccount;

try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
    console.error('Unable to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.error('Failed to initialize Firebase admin SDK');
}

const firestore = admin.firestore();

module.exports = firestore;
