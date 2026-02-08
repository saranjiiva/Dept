const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "viewers", password: "1234", role: "viewers" },
  { username: "john", password: "1234", role: "user" },
  { username: "mary", password: "1234", role: "user" }
];

const form = document.getElementById("loginForm");

if (localStorage.getItem("loggedIn") === "true") {
  const role = localStorage.getItem("role");
  redirectByRole(role);
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const u = username.value.trim();
  const p = password.value.trim();

  const user = users.find(x => x.username === u && x.password === p);

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("username", user.username);
  localStorage.setItem("role", user.role);

  redirectByRole(user.role);
});

function redirectByRole(role) {
  if (role === "admin") window.location.href = "admin.html";
  else if (role === "viewers") window.location.href = "viewers.html";
  else if (role === "user") window.location.href = "user.html";
}
