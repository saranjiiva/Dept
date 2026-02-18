import { 
  db, doc, getDoc, setDoc, collection, getDocs, 
  serverTimestamp 
} from "../data/database.js";

let currentStudent = null;

/* ============================= */
/* LOGIN USING ROLL NUMBER */
/* ============================= */

window.addEventListener("DOMContentLoaded", async () => {
  const rollNo = localStorage.getItem("studentRoll");

  if (!rollNo) {
    alert("Login Required");
    window.location.href = "login.html";
    return;
  }

  const studentSnap = await getDoc(doc(db, "students", rollNo));
  if (!studentSnap.exists()) {
    alert("Student not found");
    return;
  }

  currentStudent = studentSnap.data();
  loadProfile();
  loadMarks();
});


/* ============================= */
/* PROFILE */
/* ============================= */

function loadProfile() {
  document.getElementById("profileCard").innerHTML = `
    <h3>${currentStudent.name}</h3>
    <p>Roll No: ${currentStudent.rollNo}</p>
    <p>Batch: ${currentStudent.batch}</p>
  `;
}


/* ============================= */
/* LOAD MARKS */
/* ============================= */

async function loadMarks() {
  const markSnap = await getDoc(doc(db, "marks", currentStudent.rollNo));
  if (!markSnap.exists()) return;

  const marks = markSnap.data();

  populateTable("theoryMarksTable", marks.theory);
  populateTable("practicalMarksTable", marks.practical);
  populateTable("cat2MarksTable", marks.cat2);
}

function populateTable(tableId, data) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  for (let subject in data) {
    table.innerHTML += `
      <tr>
        <td>${subject.toUpperCase()}</td>
        <td>${data[subject]}</td>
      </tr>
    `;
  }
}


/* ============================= */
/* PASSKEY ATTENDANCE */
/* ============================= */

window.submitPasskey = async function () {

  const passkey = document.getElementById("passkeyInput").value.trim();
  if (!passkey) return alert("Enter Passkey");

  const querySnapshot = await getDocs(collection(db, "attendanceSessions"));

  let validSession = null;

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (
      data.passkey === passkey &&
      data.active === true &&
      new Date(data.expiresAt.toDate()) > new Date()
    ) {
      validSession = { id: docSnap.id, ...data };
    }
  });

  if (!validSession) {
    document.getElementById("attendanceStatus").innerText =
      "❌ Invalid or Expired Session";
    return;
  }

  await setDoc(
    doc(db, "attendanceRecords", validSession.id, currentStudent.rollNo),
    {
      rollNo: currentStudent.rollNo,
      time: serverTimestamp()
    }
  );

  document.getElementById("attendanceStatus").innerText =
    "✅ Attendance Marked Successfully";
};


/* ============================= */
/* QR ATTENDANCE */
/* ============================= */

window.startQR = function () {

  const qrScanner = new Html5Qrcode("reader");

  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {

      // decodedText = sessionId
      const sessionSnap = await getDoc(doc(db, "attendanceSessions", decodedText));

      if (!sessionSnap.exists()) {
        document.getElementById("attendanceStatus").innerText =
          "❌ Invalid QR";
        return;
      }

      const session = sessionSnap.data();

      if (
        session.active === true &&
        new Date(session.expiresAt.toDate()) > new Date()
      ) {

        await setDoc(
          doc(db, "attendanceRecords", decodedText, currentStudent.rollNo),
          {
            rollNo: currentStudent.rollNo,
            time: serverTimestamp()
          }
        );

        document.getElementById("attendanceStatus").innerText =
          "✅ QR Attendance Marked";

        qrScanner.stop();
      } else {
        document.getElementById("attendanceStatus").innerText =
          "❌ Session Expired";
      }
    }
  );
};


/* ============================= */
/* NAVIGATION */
/* ============================= */

window.showSection = function (id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  document.getElementById("pageTitle").innerText =
    document.getElementById(id).querySelector("h3").innerText;
};

window.logout = function () {
  localStorage.removeItem("studentRoll");
  window.location.href = "login.html";
};
