/* ===============================
   AUTH CHECK
================================= */
if (localStorage.getItem("role") !== "student") {
  location.href = "index.html";
}

const studentId = localStorage.getItem("studentId");
const student = database.find(s => s.id === studentId);

if (!student) {
  alert("Student record not found!");
  location.href = "index.html";
}

/* ===============================
   PROFILE CARD
================================= */
const profileCard = document.getElementById("profileCard");

if (profileCard) {
  profileCard.innerHTML = `
    <h3>${student.name}</h3>
    <p><strong>Roll No:</strong> ${student.id}</p>
    <p><strong>Course:</strong> ${student.course || "MBBS"}</p>
    <p><strong>Semester:</strong> ${student.semester || "I"}</p>
  `;
}

/* ===============================
   TABLE GENERATOR FUNCTION
================================= */
function generateTable(tableId, dataObj) {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.innerHTML = `<tr><th>Field</th><th>Value</th></tr>`;

  Object.keys(dataObj).forEach(key => {
    table.innerHTML += `
      <tr>
        <td>${key}</td>
        <td>${dataObj[key]}</td>
      </tr>
    `;
  });
}

/* ===============================
   LOAD ATTENDANCE
================================= */
generateTable("monthlyAttendanceTable", {
  "Theory %": student.theoryAttendance,
  "Practical %": student.practicalAttendance
});

generateTable("overallAttendanceTable", {
  "Overall Theory %": student.theoryAttendance,
  "Overall Practical %": student.practicalAttendance
});

/* ===============================
   LOAD MARKS
================================= */
generateTable("theoryMarksTable", {
  "Internal Theory": student.theoryMarks
});

generateTable("practicalMarksTable", {
  "Internal Practical": student.practicalMarks
});

generateTable("cat1MarksTable", {
  "CAT 1": student.cat1 || "Not Available"
});

generateTable("cat2MarksTable", {
  "CAT 2": student.cat2 || "Not Available"
});

generateTable("cat3MarksTable", {
  "CAT 3": student.cat3 || "Not Available"
});

/* ===============================
   SECTION SWITCHING
================================= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  const title = document.querySelector(`#${id} h3`);
  document.getElementById("pageTitle").innerText =
    title ? title.innerText : "Dashboard";
}

/* ===============================
   FIREBASE IMPORTS
================================= */
import { db } from "./firebase.js";
import { collection, doc, getDocs, getDoc, setDoc, query, where } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ===============================
   PASSKEY ATTENDANCE (LIVE)
================================= */
async function submitPasskey() {

  const input = document.getElementById("passkeyInput").value.trim();
  const status = document.getElementById("attendanceStatus");

  if (!input) {
    status.innerText = "Please enter passkey.";
    status.style.color = "red";
    return;
  }

  try {

    // 🔍 Check if session exists
    const sessionRef = doc(db, "attendanceSessions", input);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      status.innerText = "Invalid or expired session ❌";
      status.style.color = "red";
      return;
    }

    const sessionData = sessionSnap.data();

    // ⏳ Check expiry
    if (sessionData.expiresAt.toMillis() < Date.now()) {
      status.innerText = "Session expired ❌";
      status.style.color = "red";
      return;
    }

    // 🔒 Prevent duplicate attendance
    const attendanceRef = doc(
      db,
      "attendanceRecords",
      input,
      "students",
      student.id
    );

    const attendanceSnap = await getDoc(attendanceRef);

    if (attendanceSnap.exists()) {
      status.innerText = "Attendance already marked ⚠";
      status.style.color = "orange";
      return;
    }

    // ✅ Mark Attendance
    await setDoc(attendanceRef, {
      name: student.name,
      studentId: student.id,
      method: "Passkey",
      time: new Date()
    });

    status.innerText = "Attendance Marked Successfully ✅";
    status.style.color = "green";

  } catch (error) {
    console.error(error);
    status.innerText = "Error marking attendance.";
    status.style.color = "red";
  }
}

/* ===============================
   QR ATTENDANCE (LIVE)
================================= */
let html5QrCode;

function startQR() {

  const status = document.getElementById("attendanceStatus");

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {

    if (!devices.length) {
      status.innerText = "No camera found.";
      status.style.color = "red";
      return;
    }

    html5QrCode.start(
      devices[0].id,
      { fps: 10, qrbox: 250 },

      async (qrCodeMessage) => {

        try {

          const sessionRef = doc(db, "attendanceSessions", qrCodeMessage);
          const sessionSnap = await getDoc(sessionRef);

          if (!sessionSnap.exists()) {
            status.innerText = "Invalid QR ❌";
            status.style.color = "red";
            html5QrCode.stop();
            return;
          }

          const sessionData = sessionSnap.data();

          // Expiry check
          if (sessionData.expiresAt.toMillis() < Date.now()) {
            status.innerText = "Session expired ❌";
            status.style.color = "red";
            html5QrCode.stop();
            return;
          }

          const attendanceRef = doc(
            db,
            "attendanceRecords",
            qrCodeMessage,
            "students",
            student.id
          );

          const attendanceSnap = await getDoc(attendanceRef);

          if (attendanceSnap.exists()) {
            status.innerText = "Already Marked ⚠";
            status.style.color = "orange";
            html5QrCode.stop();
            return;
          }

          await setDoc(attendanceRef, {
            name: student.name,
            studentId: student.id,
            method: "QR",
            time: new Date()
          });

          status.innerText = "QR Attendance Marked ✅";
          status.style.color = "green";

          html5QrCode.stop();

        } catch (error) {
          console.error(error);
          status.innerText = "QR Error ❌";
          status.style.color = "red";
          html5QrCode.stop();
        }
      },

      errorMessage => {
        console.log("Scan error:", errorMessage);
      }
    );

  }).catch(err => {
    console.error("Camera error:", err);
    status.innerText = "Camera access denied.";
    status.style.color = "red";
  });
}
/* ===============================
   LOGOUT
================================= */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}
