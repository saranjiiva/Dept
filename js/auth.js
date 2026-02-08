const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "faculty", password: "faculty123", role: "viewer" },
  { username: "arun", password: "1234", role: "student", studentId: "ST001" },
  { username: "divya", password: "1234", role: "student", studentId: "ST002" },
  { username: "rahul", password: "1234", role: "student", studentId: "ST003" }
];

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const u = username.value.trim();
  const p = password.value.trim();

  const user = users.find(x => x.username === u && x.password === p);
  if (!user) return alert("Invalid login");

  localStorage.setItem("role", user.role);
  localStorage.setItem("user", user.username);
  if (user.studentId) localStorage.setItem("studentId", user.studentId);

  if (user.role === "admin") location.href = "admin.html";
  if (user.role === "viewer") location.href = "viewer.html";
  if (user.role === "student") location.href = "user.html";
});
