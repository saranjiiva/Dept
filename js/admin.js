protect("admin");

const table = document.getElementById("table");

function render() {
  const data = getData();
  table.innerHTML = `
    <tr><th>ID</th><th>Name</th><th>Diagnosis</th><th>Owner</th><th>Action</th></tr>
    ${data.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.diagnosis}</td>
        <td>${r.owner}</td>
        <td>
          <button onclick="del(${r.id})">Delete</button>
        </td>
      </tr>`).join("")}
  `;
}

function del(id) {
  const data = getData().filter(x => x.id !== id);
  saveData(data);
  render();
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
