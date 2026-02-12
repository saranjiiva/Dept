// Firebase v12 (latest consistent version)

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 🔥 Your real Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJOFL_iqY3I4Otu7bxR0l3zFpCC-Z091I",
  authDomain: "college-attendance-syste-c9ffd.firebaseapp.com",
  projectId: "college-attendance-syste-c9ffd",
  storageBucket: "college-attendance-syste-c9ffd.firebasestorage.app",
  messagingSenderId: "471403216848",
  appId: "1:471403216848:web:d79f65dc12f9e439b0c3d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
