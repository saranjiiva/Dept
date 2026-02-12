import { auth, db } from "./firebase.js";

import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js";

// Start Attendance
document.getElementById("startAttendance").addEventListener("click", async () => {

  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const sessionRef = await addDoc(collection(db, "attendanceSessions"), {
      createdBy: auth.currentUser.uid,
      role: "admin",
      subject: "Biochemistry",
      latitude,
      longitude,
      radius: 50,
      active: true,
      timestamp: serverTimestamp()
    });

    const sessionId = sessionRef.id;

    const qrData = JSON.stringify({
      sessionId,
      latitude,
      longitude,
      radius: 50
    });

    QRCode.toCanvas(document.getElementById("qrContainer"), qrData);

    document.getElementById("status").innerText =
      "Attendance started. Students scan now.";

  }, () => {
    alert("Enable GPS");
  });

});
