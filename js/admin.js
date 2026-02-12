import { auth, db } from "./firebase.js";

import { 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// ==========================
// 🔐 ADMIN AUTH PROTECTION
// ==========================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists() || snap.data().role !== "admin") {
      alert("Access Denied");
      window.location.href = "index.html";
    }

  } catch (error) {
    console.error("Role check error:", error);
    window.location.href = "index.html";
  }

});


// ==========================
// 📌 SIDEBAR SECTION SWITCH
// ==========================

const menuItems = document.querySelectorAll(".menu li[data-section]");
const sections = document.querySelectorAll(".section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    const target = item.getAttribute("data-section");

    // Remove active from all sections
    sections.forEach(sec => sec.classList.remove("active"));

    // Activate selected section
    const activeSection = document.getElementById(target);
    if (activeSection) {
      activeSection.classList.add("active");
    }

  });
});


// ==========================
// 🚪 LOGOUT FUNCTION
// ==========================

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
