import { auth, db } from "..js/firebase.js";
import { onAuthStateChanged, signOut } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ===============================
   AUTH CHECK
================================= */
let student = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "students", user.uid));

  if (!snap.exists()) {
    alert("Student record not found");
    location.href = "index.html";
    return;
  }

  student = { uid: user.uid, ...snap.data() };
  loadProfile();
});

/* ===============================
   PROFILE
================================= */
function loadProfile() {
  document.getElementById("profileCard").innerHTML = `
    <h3>Welcome</h3>
    <p><strong>Roll No:</strong> ${student.rollNo}</p>
  `;
}

/* ===============================
   PASSKEY ATTENDANCE
================================= */
async function submitPasskey() {

  const passkey = document.getElementById("passkeyInput").value.trim();
  const status = document.getElementById("attendanceStatus");

  if (!passkey) {
    status.innerText = "Enter passkey";
    status.style.color = "red";
    return;
  }

  const sessionRef = doc(db, "attendanceSessions", passkey);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    status.innerText = "Invalid / expired session";
    status.style.color = "red";
    return;
  }

  const session = sessionSnap.data();

  if (session.expiresAt.toMillis() < Date.now()) {
    status.innerText = "Session expired";
    status.style.color = "red";
    return;
  }

  const recordRef = doc(
    db,
    "attendanceRecords",
    passkey,
    "students",
    student.uid
  );

  const recordSnap = await getDoc(recordRef);

  if (recordSnap.exists()) {
    status.innerText = "Attendance already marked";
    status.style.color = "orange";
    return;
  }

  await setDoc(recordRef, {
    rollNo: student.rollNo,
    method: "Passkey",
    time: serverTimestamp()
  });

  status.innerText = "Attendance marked successfully ✅";
  status.style.color = "green";
}

/* ===============================
   QR ATTENDANCE
================================= */
let html5QrCode;

function startQR() {

  const status = document.getElementById("attendanceStatus");
  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {

    html5QrCode.start(
      devices[0].id,
      { fps: 10, qrbox: 250 },

      async (qrMessage) => {

        document.getElementById("passkeyInput").value = qrMessage;
        await submitPasskey();
        html5QrCode.stop();
      }
    );

  }).catch(() => {
    status.innerText = "Camera permission denied";
    status.style.color = "red";
  });
}

/* ===============================
   LOGOUT
================================= */
function logout() {
  signOut(auth);
  location.href = "index.html";
}

/* ===============================
   SECTION SWITCH
================================= */
window.showSection = function(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

window.submitPasskey = submitPasskey;
window.startQR = startQR;
window.logout = logout;
