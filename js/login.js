import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* =========================================================
   LOGIN FUNCTION
========================================================= */

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const loginBtn = document.querySelector(".login-btn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  loginStatus.textContent = "";
  loginBtn.textContent = "Signing in...";
  loginBtn.disabled = true;

  try {
    // Firebase Authentication
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userAuth = result.user;


    const uid = userAuth.uid;

    // Fetch role from Firestore
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      loginStatus.style.color = "#f87171";
      loginStatus.textContent = "User role not assigned. Contact admin.";
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    const userData = snap.data();
    const role = userData.role;

    // Role-based redirect
    if (role === "admin") {
      window.location.href = "admin.html";
    } 
    else if (role === "viewer") {
      window.location.href = "viewers.html";
    } 
    else if (role === "student") {
      window.location.href = "user.html";
    } 
    else {
      loginStatus.style.color = "#f87171";
      loginStatus.textContent = "Invalid role assigned.";
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
    }

  } catch (error) {

    // Friendly Error Handling
    let message = "Login failed. Please try again.";

    switch (error.code) {
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/user-not-found":
        message = "User not found.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password.";
        break;
      case "auth/invalid-credential":
        message = "Invalid credentials.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Try again later.";
        break;
    }

    loginStatus.style.color = "#f87171";
    loginStatus.textContent = message;

    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
  }
});

/* =========================================================
   FORGOT PASSWORD FUNCTION
========================================================= */

const resetBtn = document.getElementById("resetPasswordBtn");
const resetEmail = document.getElementById("resetEmail");
const resetStatus = document.getElementById("resetStatus");

if (resetBtn) {
  resetBtn.addEventListener("click", async () => {

    const email = resetEmail.value.trim();

    if (!email) {
      resetStatus.style.color = "#f87171";
      resetStatus.textContent = "Please enter your registered email.";
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      resetStatus.style.color = "#22c55e";
      resetStatus.textContent = "Password reset email sent successfully.";

    } catch (error) {

      let message = "Failed to send reset email.";

      if (error.code === "auth/user-not-found") {
        message = "No user found with this email.";
      }

      resetStatus.style.color = "#f87171";
      resetStatus.textContent = message;
    }
  });
}
