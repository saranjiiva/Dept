// js/admin-attendance.js

import { db, auth } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentSessionId = null;

const startBtn = document.getElementById("startAttendance");
const qrContainer = document.getElementById("qrContainer");
const liveTable = document.getElementById("liveTable");
const status = document.getElementById("status");

startBtn.addEventListener("click", async () => {

  currentSessionId = Date.now().toString();

  await addDoc(collection(db, "attendanceSessions"), {
    sessionId: currentSessionId,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid,
    active: true
  });

  qrContainer.innerHTML =
    `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${currentSessionId}" />`;

  status.innerText = "Attendance Session Started";

  listenLiveAttendance();
});

function listenLiveAttendance() {

  const q = query(
    collection(db, "attendanceRecords"),
    where("sessionId", "==", currentSessionId)
  );

  onSnapshot(q, (snapshot) => {

    liveTable.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      liveTable.innerHTML += `
        <tr>
          <td>${data.studentEmail}</td>
          <td>${data.timestamp?.toDate()}</td>
        </tr>
      `;
    });
  });
}
