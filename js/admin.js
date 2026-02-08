if (localStorage.getItem("role") !== "admin") location.href = "index.html";

const table = document.getElementById("table");

function load() {
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Theory Att%</th>
      <th>Practical Att%</th>
      <th>Theory Marks</th>
      <th>Practical Marks</th>
      <th>Edit</th>
    </tr>
  `;

  database.forEach((s, i) => {
    table.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td contenteditable="true" onblur="save(${i}, 'theoryAttendance', this.innerText)">${s.theoryAttendance}</td>
        <td contenteditable="true" onblur="save(${i}, 'practicalAttendance', this.innerText)">${s.practicalAttendance}</td>
        <td contenteditable="true" onblur="save(${i}, 'theoryMarks', this.innerText)">${s.theoryMarks}</td>
        <td contenteditable="true" onblur="save(${i}, 'practicalMarks', this.innerText)">${s.practicalMarks}</td>
        <td>✏️</td>
      </tr>
    `;
  });
}

function save(i, field, value) {
  database[i][field] = value;
  alert("Updated");
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

load();
