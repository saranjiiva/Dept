document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("loginForm");
  const forgotLink = document.getElementById("forgotLink");

  // Auto-login if already logged in
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "viewer.html";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    // Demo credentials
    if (username === "admin" && password === "1234") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", username);
      window.location.href = "viewer.html";
    } else {
      alert("Invalid username or password");
    }
  });

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Please contact administrator to reset your password.");
  });

});
