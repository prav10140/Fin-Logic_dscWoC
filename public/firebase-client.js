// Firebase Client Configuration
// Updated with actual credentials

const firebaseConfig = {
  apiKey: "AIzaSyDuNxn6deSyUagKyH3cASMkPYf4_6HqKFc",
  authDomain: "fin-logic.firebaseapp.com",
  projectId: "fin-logic",
  storageBucket: "fin-logic.firebasestorage.app",
  messagingSenderId: "373355368486",
  appId: "1:373355368486:web:17199fd2bc1a0d12dc16e7",
  measurementId: "G-QWSS0HF926"
};

// Check if Firebase is configured
const isFirebaseConfigured = true;

let auth = null;
let db = null;
let currentUser = null;

if (isFirebaseConfigured && typeof firebase !== 'undefined') {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  // Auth state observer
  auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI(user);
  });
} else {
  console.warn("⚠️  Firebase is not configured. Using placeholder mode.");
}

// Google Sign In
async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    alert("Firebase is not configured yet. Please add your Firebase credentials.");
    return null;
  }
  
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    return result.user;
  } catch (error) {
    console.error("Sign in error:", error);
    alert("Sign in failed: " + error.message);
    return null;
  }
}

// Sign Out
async function signOut() {
  if (!isFirebaseConfigured) return;
  
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

// Update UI based on auth state
function updateAuthUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.querySelector('.user-profile');
  const historyBtn = document.querySelector('.btn-history');
  
  if (user) {
    // User is signed in
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) {
      userProfile.style.display = 'flex';
      userProfile.textContent = user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'U';
      userProfile.title = user.email;
      userProfile.style.cursor = 'pointer';
      userProfile.onclick = signOut;
    }
    if (historyBtn) historyBtn.disabled = false;
  } else {
    // User is signed out
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    if (historyBtn) historyBtn.disabled = true;
  }
}

// Save report to Firestore
async function saveReport(reportData) {
  if (!isFirebaseConfigured || !currentUser) {
    console.log("Cannot save: Firebase not configured or user not signed in");
    return null;
  }
  
  try {
    const docRef = await db.collection('users').doc(currentUser.uid)
      .collection('reports').add({
        ...reportData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email
      });
    
    console.log("Report saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving report:", error);
    return null;
  }
}

// Fetch user's report history
async function fetchHistory() {
  if (!isFirebaseConfigured || !currentUser) {
    return [];
  }
  
  try {
    const snapshot = await db.collection('users').doc(currentUser.uid)
      .collection('reports')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    const reports = [];
    snapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reports;
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

// Get specific report by ID
async function getReport(reportId) {
  if (!isFirebaseConfigured || !currentUser) {
    return null;
  }
  
  try {
    const doc = await db.collection('users').doc(currentUser.uid)
      .collection('reports').doc(reportId).get();
    
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}
