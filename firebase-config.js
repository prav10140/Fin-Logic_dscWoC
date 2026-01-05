const admin = require('firebase-admin');

// PLACEHOLDER: Replace with your actual service account key
// Download from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key

/*
To enable Firebase:
1. Download serviceAccountKey.json from Firebase Console
2. Place it in the project root
3. Uncomment the code below
*/


const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };


// PLACEHOLDER MODE - Firebase not active
console.log("⚠️  Firebase Admin is in PLACEHOLDER mode");
console.log("📝 To enable:");
console.log("   1. Create Firebase project at https://console.firebase.google.com");
console.log("   2. Download serviceAccountKey.json");
console.log("   3. Uncomment code in firebase-config.js");

module.exports = { 
  admin: null, 
  db: null, 
  auth: null,
  isConfigured: false 
};
