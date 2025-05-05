// firebase.js
const admin = require('firebase-admin');

const credentialsBase64 = process.env.FIREBASE_CREDENTIALS_BASE64;
if (!credentialsBase64) {
  throw new Error('Falta la variable FIREBASE_CREDENTIALS_BASE64');
}
const serviceAccount = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'tu-bucket.appspot.com', // cambiá esto por tu bucket real
});

const bucket = admin.storage().bucket();

module.exports = { bucket };