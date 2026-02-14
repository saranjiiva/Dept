import { getDocs, collection } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { db } from "./firebase.js";

export async function exportExcel() {

  const snap = await getDocs(collection(db, "attendanceRecords"));

  let csv = "Student Email,Session ID,Timestamp\n";

  snap.forEach(doc => {
    const d = doc.data();
    csv += `${d.studentEmail},${d.sessionId},${d.timestamp?.toDate()}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance.csv";
  a.click();
}
