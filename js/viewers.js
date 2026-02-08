protect("viewers");

const table = document.getElementById("table");

function render() {
  const data = getData();
  table.innerHTML = `
    <tr><th>ID</th><th>Name</th><th>Diagnosis</th><th>Owner</th></tr>
    ${data.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.diagnosis}</td>
        <td>${r.owner}</td>
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
