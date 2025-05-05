// firebase.js
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('./clave-firebase.json', 'utf8') // Descargala desde la consola
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'smartneckless-1.firebasestorage.app',
});

const bucket = admin.storage().bucket();

module.exports = { bucket };  