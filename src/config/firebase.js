const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-service-accout.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skipli-8c211.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
