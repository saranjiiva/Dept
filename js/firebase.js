// ============================================
// 🔥 Firebase v12 Modular SDK
// ============================================

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// ============================================
// 🔐 Your Firebase Configuration
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBJOFL_iqY3I4Otu7bxR0l3zFpCC-Z091I",
  authDomain: "college-attendance-syste-c9ffd.firebaseapp.com",
  projectId: "college-attendance-syste-c9ffd",
  storageBucket: "college-attendance-syste-c9ffd.firebasestorage.app",
  messagingSenderId: "471403216848",
  appId: "1:471403216848:web:d79f65dc12f9e439b0c3d5"
};

// ============================================
// 🚀 Initialize Firebase
// ============================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ============================================
// 🔑 AUTH FUNCTIONS
// ============================================

// Login
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Logout
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

// Auth State Listener
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      window.location.href = "index.html";
    }
  });
}


// ============================================
// 👤 STUDENT DATA FUNCTIONS
// ============================================

// Get Logged-in Student Data
export async function getStudentData(uid) {
  const docRef = doc(db, "students", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    alert("Student record not found!");
    return null;
  }
}

// Create Student (Admin Use)
export async function createStudent(uid, data) {
  await setDoc(doc(db, "students", uid), data);
}


// ============================================
// 📝 ATTENDANCE FUNCTIONS
// ============================================

// Mark Attendance
export async function markAttendance(uid, method) {
  try {
    await addDoc(collection(db, "attendance"), {
      studentId: uid,
      method: method, // "qr" or "passkey"
      timestamp: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Get Student Attendance History
export async function getAttendanceHistory(uid) {
  const q = query(
    collection(db, "attendance"),
    where("studentId", "==", uid)
  );

  const querySnapshot = await getDocs(q);

  let records = [];
  querySnapshot.forEach((doc) => {
    records.push(doc.data());
  });

  return records;
}


// ============================================
// 📊 MARKS FUNCTIONS (Admin)
// ============================================

// Update Marks
export async function updateMarks(uid, marksData) {
  const studentRef = doc(db, "students", uid);
  await updateDoc(studentRef, marksData);
}


// ============================================
// EXPORT SERVICES
// ============================================
export { auth, db };
