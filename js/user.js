if (localStorage.getItem("role") !== "student") location.href = "index.html";

const studentId = localStorage.getItem("studentId");
const table = document.getElementById("table");

const s = database.find(x => x.id === studentId);

table.innerHTML = `
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>ID</td><td>${s.id}</td></tr>
  <tr><td>Name</td><td>${s.name}</td></tr>
  <tr><td>Theory Attendance %</td><td>${s.theoryAttendance}</td></tr>
  <tr><td>Practical Attendance %</td><td>${s.practicalAttendance}</td></tr>
  <tr><td>Theory Marks</td><td>${s.theoryMarks}</td></tr>
  <tr><td>Practical Marks</td><td>${s.practicalMarks}</td></tr>
`;

function logout() {
  localStorage.clear();
  location.href = "index.html";
}
