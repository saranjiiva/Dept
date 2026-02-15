/* ===============================
   AUTH CHECK
================================= */
if (localStorage.getItem("role") !== "student") {
  location.href = "index.html";
}

const studentId = localStorage.getItem("studentId");
const student = database.find(s => s.id === studentId);

if (!student) {
  alert("Student record not found!");
  location.href = "index.html";
}

/* ===============================
   PROFILE CARD
================================= */
const profileCard = document.getElementById("profileCard");

if (profileCard) {
  profileCard.innerHTML = `
    <h3>${student.name}</h3>
    <p><strong>Roll No:</strong> ${student.id}</p>
    <p><strong>Course:</strong> ${student.course || "MBBS"}</p>
    <p><strong>Semester:</strong> ${student.semester || "I"}</p>
  `;
}

/* ===============================
   TABLE GENERATOR FUNCTION
================================= */
function generateTable(tableId, dataObj) {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.innerHTML = `<tr><th>Field</th><th>Value</th></tr>`;

  Object.keys(dataObj).forEach(key => {
    table.innerHTML += `
      <tr>
        <td>${key}</td>
        <td>${dataObj[key]}</td>
      </tr>
    `;
  });
}

/* ===============================
   LOAD ATTENDANCE
================================= */
generateTable("monthlyAttendanceTable", {
  "Theory %": student.theoryAttendance,
  "Practical %": student.practicalAttendance
});

generateTable("overallAttendanceTable", {
  "Overall Theory %": student.theoryAttendance,
  "Overall Practical %": student.practicalAttendance
});

/* ===============================
   LOAD MARKS
================================= */
generateTable("theoryMarksTable", {
  "Internal Theory": student.theoryMarks
});

generateTable("practicalMarksTable", {
  "Internal Practical": student.practicalMarks
});

generateTable("cat1MarksTable", {
  "CAT 1": student.cat1 || "Not Available"
});

generateTable("cat2MarksTable", {
  "CAT 2": student.cat2 || "Not Available"
});

generateTable("cat3MarksTable", {
  "CAT 3": student.cat3 || "Not Available"
});

/* ===============================
   SECTION SWITCHING
================================= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  const title = document.querySelector(`#${id} h3`);
  document.getElementById("pageTitle").innerText =
    title ? title.innerText : "Dashboard";
}

/* ===============================
   PASSKEY ATTENDANCE
================================= */
function submitPasskey() {
  const input = document.getElementById("passkeyInput").value.trim();
  const status = document.getElementById("attendanceStatus");

  const validPasskey = localStorage.getItem("activePasskey"); 
  // Admin must set this during attendance session

  if (!input) {
    status.innerText = "Please enter passkey.";
    status.style.color = "red";
    return;
  }

  if (input === validPasskey) {
    status.innerText = "Attendance Marked Successfully ✅";
    status.style.color = "green";

    // Example update
    student.theoryAttendance = parseInt(student.theoryAttendance) + 1;

  } else {
    status.innerText = "Invalid Passkey ❌";
    status.style.color = "red";
  }
}

/* ===============================
   QR ATTENDANCE
================================= */
let html5QrCode;

function startQR() {
  const status = document.getElementById("attendanceStatus");

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {

      html5QrCode.start(
        devices[0].id,
        {
          fps: 10,
          qrbox: 250
        },
        qrCodeMessage => {

          const validQR = localStorage.getItem("activeQR");

          if (qrCodeMessage === validQR) {
            status.innerText = "QR Attendance Marked ✅";
            status.style.color = "green";
          } else {
            status.innerText = "Invalid QR Code ❌";
            status.style.color = "red";
          }

          html5QrCode.stop();
        },
        errorMessage => {
          console.log("QR Scan Error:", errorMessage);
        }
      );

    }
  }).catch(err => {
    console.error("Camera Error:", err);
    status.innerText = "Camera access denied.";
    status.style.color = "red";
  });
}

/* ===============================
   LOGOUT
================================= */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}
