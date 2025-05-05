// firebase.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./clave-firebase.json', 'utf8') // Descargala desde la consola
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'smartneckless-1.firebasestorage.app',
});

const bucket = admin.storage().bucket();

export default bucket;