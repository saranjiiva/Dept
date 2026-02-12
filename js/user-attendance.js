import { auth, db } from "./firebase.js";

import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

document.getElementById("scanBtn").addEventListener("click", () => {

  const html5QrCode = new Html5Qrcode("preview");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {

      const data = JSON.parse(decodedText);

      navigator.geolocation.getCurrentPosition(async (pos) => {

        const distance = calculateDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          data.latitude,
          data.longitude
        );

        if (distance > data.radius) {
          alert("You are outside allowed range");
          return;
        }

        await addDoc(collection(db, "attendanceRecords"), {
          sessionId: data.sessionId,
          studentId: auth.currentUser.uid,
          studentEmail: auth.currentUser.email,
          timestamp: serverTimestamp()
        });

        document.getElementById("result").innerText =
          "Attendance marked successfully";

        html5QrCode.stop();

      });

    }
  );

});
