// Firebase core
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// Auth
import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firestore
import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
