if (localStorage.getItem("role") !== "viewers") location.href = "index.html";

const table = document.getElementById("table");

table.innerHTML = `
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Theory Att%</th>
    <th>Practical Att%</th>
    <th>Theory Marks</th>
    <th>Practical Marks</th>
  </tr>
`;

database.forEach(s => {
  table.innerHTML += `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.theoryAttendance}</td>
      <td>${s.practicalAttendance}</td>
      <td>${s.theoryMarks}</td>
      <td>${s.practicalMarks}</td>
    </tr>
  `;
});

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
