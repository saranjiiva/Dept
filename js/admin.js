import { auth, db } from "./firebase.js";



import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// =====================================================
// 🔐 ADMIN AUTH PROTECTION WITH LOADER
// =====================================================

const body = document.body;

function showLoader() {
  const loader = document.createElement("div");
  loader.id = "authLoader";
  loader.innerHTML = "Verifying Admin Access...";
  loader.style.position = "fixed";
  loader.style.inset = "0";
  loader.style.background = "#ffffff";
  loader.style.display = "flex";
  loader.style.alignItems = "center";
  loader.style.justifyContent = "center";
  loader.style.fontSize = "18px";
  loader.style.fontWeight = "600";
  loader.style.zIndex = "9999";
  body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById("authLoader");
  if (loader) loader.remove();
}

showLoader();

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists() || snap.data().role !== "admin") {
      alert("Access Denied");
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }

    hideLoader();

  } catch (error) {
    console.error("Role verification error:", error);
    window.location.href = "index.html";
  }

});


// =====================================================
// 📌 SIDEBAR NAVIGATION SYSTEM
// =====================================================

const menuItems = document.querySelectorAll(".menu li[data-section]");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");

menuItems.forEach(item => {

  item.addEventListener("click", () => {

    const target = item.dataset.section;

    // Remove active state
    sections.forEach(sec => sec.classList.remove("active"));
    menuItems.forEach(m => m.classList.remove("active"));

    // Activate section
    const activeSection = document.getElementById(target);
    if (activeSection) {
      activeSection.classList.add("active");
      pageTitle.innerText = activeSection.querySelector("h3")?.innerText || "Dashboard";
      item.classList.add("active");
    }

  });

});


// =====================================================
// 📊 ATTENDANCE VIEW CONTROLLER
// =====================================================

const attendanceType = document.getElementById("attendanceType");
const attendanceMonth = document.getElementById("attendanceMonth");
const loadAttendanceBtn = document.getElementById("loadAttendanceBtn");
const attendanceTable = document.getElementById("attendanceTable");

if (loadAttendanceBtn) {

  loadAttendanceBtn.addEventListener("click", () => {

    const type = attendanceType.value;
    const month = attendanceMonth.value;

    console.log("Loading Attendance:", type, month);

    // 🔹 Replace with real database.js logic
    renderDummyAttendance(type, month);

  });

}

function renderDummyAttendance(type, month) {

  attendanceTable.innerHTML = `
    <thead>
      <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>${type === "monthly" ? month : "Overall %"}</th>
      </tr>
    </thead>
    <tbody>
      ${generateRows(250, type)}
    </tbody>
  `;

}

function generateRows(count, type) {
  let rows = "";
  for (let i = 1; i <= count; i++) {
    rows += `
      <tr>
        <td>${i}</td>
        <td>Student ${i}</td>
        <td>${type === "monthly" ? Math.floor(Math.random() * 26) + "/26" : Math.floor(Math.random() * 100) + "%"}</td>
      </tr>
    `;
  }
  return rows;
}


// =====================================================
// 📝 MARKS VIEW CONTROLLER
// =====================================================

const marksCategory = document.getElementById("marksCategory");
const loadMarksBtn = document.getElementById("loadMarksBtn");
const marksTable = document.getElementById("marksTable");

if (loadMarksBtn) {

  loadMarksBtn.addEventListener("click", () => {

    const category = marksCategory.value;
    console.log("Loading Marks:", category);

    renderDummyMarks(category);

  });

}

function renderDummyMarks(category) {

  marksTable.innerHTML = `
    <thead>
      <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>${category.toUpperCase()} Marks</th>
      </tr>
    </thead>
    <tbody>
      ${generateMarksRows(250)}
    </tbody>
  `;

}

function generateMarksRows(count) {
  let rows = "";
  for (let i = 1; i <= count; i++) {
    rows += `
      <tr>
        <td>${i}</td>
        <td>Student ${i}</td>
        <td>${Math.floor(Math.random() * 100)}</td>
      </tr>
    `;
  }
  return rows;
}


// =====================================================
// 📷 ATTENDANCE TAKING CONTROLLER (REDIRECT)
// =====================================================

const startAttendanceBtn = document.getElementById("startAttendance");

if (startAttendanceBtn) {
  startAttendanceBtn.addEventListener("click", () => {
    window.location.href = "attendance-session.html";
  });
}



// =====================================================
// 📤 EXTRACT DATA BUTTONS
// =====================================================

document.querySelectorAll("[id^='extract']").forEach(btn => {

  btn.addEventListener("click", () => {
    alert("Data extraction triggered (Connect to exportExcel in admin-dashboard.js)");
  });

});


// =====================================================
// 📥 UPLOAD DATA BUTTONS
// =====================================================

document.querySelectorAll("[id^='upload']").forEach(btn => {

  btn.addEventListener("click", () => {
    alert("Upload system ready (Connect to database.js)");
  });

});


// =====================================================
// 🚪 LOGOUT
// =====================================================

const logoutBtn = document.querySelector(".logout");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      alert("Logout failed: " + error.message);
    }

  });

}
