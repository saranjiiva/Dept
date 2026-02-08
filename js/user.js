protect("user");

const table = document.getElementById("table");
const me = localStorage.getItem("username");

function render() {
  const data = getData().filter(r => r.owner === me);
  table.innerHTML = `
    <tr><th>ID</th><th>Name</th><th>Diagnosis</th></tr>
    ${data.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.diagnosis}</td>
      </tr>`).join("")}
  `;
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function protect(role) {
  if (localStorage.getItem("role") !== role) {
    window.location.href = "index.html";
  }
}

render();
