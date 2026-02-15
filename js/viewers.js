import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// ======================================================
// 🔐 ROLE PROTECTION (VIEWER ONLY)
// ======================================================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists() || snap.data().role !== "viewers") {
      alert("Access Denied");
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }

    loadStudents(); // Load data after validation

  } catch (error) {
    console.error("Role verification failed:", error);
    window.location.href = "index.html";
  }

});


// ======================================================
// 📚 LOAD ALL STUDENTS (250)
// ======================================================

let studentsData = [];

async function loadStudents() {

  const snapshot = await getDocs(collection(db, "students"));

  studentsData = [];

  snapshot.forEach(docSnap => {
    studentsData.push({
      rollNo: docSnap.id,
      ...docSnap.data()
    });
  });

  console.log("Students Loaded:", studentsData.length);
}


// ======================================================
// 📊 RENDER ATTENDANCE (READ ONLY)
// ======================================================

const attendanceTable = document.getElementById("attendanceTable");
const loadAttendanceBtn = document.getElementById("loadAttendanceBtn");

if (loadAttendanceBtn) {

  loadAttendanceBtn.addEventListener("click", () => {

    const type = document.getElementById("attendanceType").value;
    const month = document.getElementById("attendanceMonth").value;

    renderAttendance(type, month);

  });

}

function renderAttendance(type, month) {

  if (!attendanceTable) return;

  let header = `
    <thead>
      <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>${type === "monthly" ? month : "Overall %"}</th>
      </tr>
    </thead>
    <tbody>
  `;

  let rows = "";

  studentsData.forEach(student => {

    let value = "";

    if (type === "monthly") {
      const monthData = student.attendance?.monthly?.[month];
      value = monthData
        ? `${monthData.present}/${monthData.total}`
        : "N/A";
    } else {
      value = student.attendance?.overallPercentage ?? "0";
      value += "%";
    }

    rows += `
      <tr>
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>${value}</td>
      </tr>
    `;
  });

  attendanceTable.innerHTML = header + rows + "</tbody>";
}


// ======================================================
// 📝 RENDER MARKS (READ ONLY)
// ======================================================

const marksTable = document.getElementById("marksTable");
const loadMarksBtn = document.getElementById("loadMarksBtn");

if (loadMarksBtn) {

  loadMarksBtn.addEventListener("click", () => {

    const category = document.getElementById("marksCategory").value;
    renderMarks(category);

  });

}

function renderMarks(category) {

  if (!marksTable) return;

  let header = `
    <thead>
      <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>${category.toUpperCase()}</th>
      </tr>
    </thead>
    <tbody>
  `;

  let rows = "";

  studentsData.forEach(student => {

    const mark = student.marks?.[category] ?? "N/A";

    rows += `
      <tr>
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>${mark}</td>
      </tr>
    `;
  });

  marksTable.innerHTML = header + rows + "</tbody>";
}


// ======================================================
// 📷 ATTENDANCE TAKING SYSTEM
// ======================================================

let timerInterval = null;

const startBtn = document.getElementById("startAttendanceBtn");

if (startBtn) {

  startBtn.addEventListener("click", () => {

    const subject = document.getElementById("subject").value.trim();
    const minutes = document.getElementById("minutes").value;
    const passkey = document.getElementById("passkey").value.trim();

    if (!subject || !minutes) {
      alert("Enter subject and time");
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {

      const session = {
        subject,
        passkey,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        expiry: Date.now() + minutes * 60000
      };

      localStorage.setItem("attendanceSession", JSON.stringify(session));

      generateQR(session);
      startTimer(session.expiry);

      document.getElementById("locationStatus").innerText =
        `Location locked at ${session.lat.toFixed(4)}, ${session.lon.toFixed(4)}`;

    }, () => alert("Location permission required"));

  });

}

function generateQR(data) {
  document.getElementById("qr").innerHTML = "";
  new QRCode(document.getElementById("qr"), {
    text: JSON.stringify(data),
    width: 180,
    height: 180
  });
}

function startTimer(expiry) {

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    const remaining = expiry - Date.now();

    if (remaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timer").innerText = "Session expired";
      localStorage.removeItem("attendanceSession");
    } else {
      const min = Math.floor(remaining / 60000);
      const sec = Math.floor((remaining % 60000) / 1000);
      document.getElementById("timer").innerText =
        `Expires in ${min}:${sec.toString().padStart(2,'0')}`;
    }

  }, 1000);

}


// ======================================================
// 🚪 LOGOUT
// ======================================================

const logoutBtn = document.querySelector(".logout");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "index.html";
    } catch (error) {
      alert("Logout failed: " + error.message);
    }

  });

}
