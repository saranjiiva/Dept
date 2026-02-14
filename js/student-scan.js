import { db, auth } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
  currentUser = user;
});

function onScanSuccess(decodedText) {

  addDoc(collection(db, "attendanceRecords"), {
    studentEmail: currentUser.email,
    studentUid: currentUser.uid,
    sessionId: decodedText,
    timestamp: serverTimestamp()
  });

  alert("Attendance Marked");
}

new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: 250 }
).render(onScanSuccess);
