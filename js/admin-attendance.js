// js/admin-attendance.js

import { db, auth } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentSessionId = null;
let unsubscribeListener = null;

const startBtn = document.getElementById("startAttendance");
const qrContainer = document.getElementById("qrContainer");
const liveTable = document.getElementById("liveTable");
const status = document.getElementById("status");
const passKeyDisplay = document.getElementById("passKeyDisplay");
const subjectInput = document.getElementById("subjectInput");
const radiusInput = document.getElementById("radiusInput");

startBtn.addEventListener("click", async () => {

  if (!auth.currentUser) {
    status.innerText = "Not authenticated!";
    return;
  }

  const subject = subjectInput.value.trim();
  const radius = parseInt(radiusInput.value) || 50;

  if (!subject) {
    status.innerText = "Enter subject name";
    return;
  }

  status.innerText = "Starting session...";

  // 🔒 Close previous active sessions
  const activeQuery = query(
    collection(db, "attendanceSessions"),
    where("active", "==", true)
  );

  const activeSnap = await getDocs(activeQuery);

  activeSnap.forEach(async (docSnap) => {
    await updateDoc(docSnap.ref, { active: false });
  });

  // 📍 Get GPS location
  navigator.geolocation.getCurrentPosition(async (position) => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    currentSessionId = Date.now().toString();

    // 🔐 Generate 4-digit passkey
    const passKey = Math.floor(1000 + Math.random() * 9000);
    passKeyDisplay.innerText = passKey;

    await addDoc(collection(db, "attendanceSessions"), {
      sessionId: currentSessionId,
      subject: subject,
      latitude: latitude,
      longitude: longitude,
      radius: radius,
      passKey: passKey,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser.uid,
      active: true
    });

    // 🧹 Clear previous QR
    qrContainer.innerHTML = "";

    // 📱 QR contains session + passkey
    const qrData = JSON.stringify({
      sessionId: currentSessionId,
      passKey: passKey
    });

    qrContainer.innerHTML =
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}" />`;

    status.innerText = "Attendance Session Started";

    listenLiveAttendance();

  }, () => {
    status.innerText = "Location permission required!";
  });

});

function listenLiveAttendance() {

  if (unsubscribeListener) unsubscribeListener();

  const q = query(
    collection(db, "attendanceRecords"),
    where("sessionId", "==", currentSessionId)
  );

  unsubscribeListener = onSnapshot(q, (snapshot) => {

    liveTable.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      liveTable.innerHTML += `
        <tr>
          <td>${data.studentEmail}</td>
          <td>${data.timestamp?.toDate()?.toLocaleString()}</td>
        </tr>
      `;
    });

  });
}
