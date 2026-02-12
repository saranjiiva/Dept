import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      alert("Role not assigned in Firestore");
      return;
    }

    const user = snap.data();

    if (user.role === "admin") {
      window.location.href = "admin.html";
    } 
    else if (user.role === "viewers") {
      window.location.href = "viewers.html";
    } 
    else if (user.role === "student") {
      window.location.href = "user.html";
    }

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
