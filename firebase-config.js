const admin = require('firebase-admin');

// PLACEHOLDER: Replace with your actual service account key
// Download from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key

/*
To enable Firebase:
1. Download serviceAccountKey.json from Firebase Console
2. Place it in the project root
3. Uncomment the code below
*/


const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Firebase Admin initialization failed:", error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth, isConfigured: true };
