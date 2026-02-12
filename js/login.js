import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const u = username.value.trim();
  const p = password.value.trim();

  try {
    const result = await signInWithEmailAndPassword(auth, u, p);
    const uid = result.user.uid;

    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return alert("No role assigned");

    const user = snap.data();

    localStorage.setItem("role", user.role);
    localStorage.setItem("user", user.username);
    if (user.studentId) localStorage.setItem("studentId", user.studentId);

    if (user.role === "admin") location.href = "admin.html";
    if (user.role === "viewers") location.href = "viewers.html";
    if (user.role === "student") location.href = "user.html";

  } catch (err) {
    alert("Invalid login");
  }
});
