import { db } from "./js/firebase.js";

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const studentsCollection = collection(db, "students");


// ======================================================
// 📌 1️⃣ ADD OR UPDATE SINGLE STUDENT
// ======================================================

export async function saveStudent(studentData) {
  try {

    const studentRef = doc(db, "students", studentData.rollNo.toString());

    await setDoc(studentRef, studentData, { merge: true });

    console.log("Student saved:", studentData.rollNo);

  } catch (error) {
    console.error("Error saving student:", error);
  }
}


// ======================================================
// 📌 2️⃣ BULK UPLOAD STUDENTS (250 STUDENTS)
// ======================================================

export async function bulkUploadStudents(studentsArray) {

  try {

    for (const student of studentsArray) {
      const studentRef = doc(db, "students", student.rollNo.toString());
      await setDoc(studentRef, student, { merge: true });
    }

    alert("Bulk upload successful!");

  } catch (error) {
    console.error("Bulk upload failed:", error);
  }

}


// ======================================================
// 📌 3️⃣ UPDATE ATTENDANCE (MONTHLY)
// ======================================================

export async function updateMonthlyAttendance(rollNo, month, present, total) {

  try {

    const studentRef = doc(db, "students", rollNo.toString());

    await updateDoc(studentRef, {
      [`attendance.monthly.${month}`]: {
        present,
        total
      }
    });

    await calculateOverallAttendance(rollNo);

  } catch (error) {
    console.error("Attendance update error:", error);
  }

}


// ======================================================
// 📌 4️⃣ CALCULATE OVERALL ATTENDANCE
// ======================================================

export async function calculateOverallAttendance(rollNo) {

  const studentRef = doc(db, "students", rollNo.toString());
  const snap = await getDoc(studentRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const monthly = data.attendance?.monthly || {};

  let totalPresent = 0;
  let totalClasses = 0;

  Object.values(monthly).forEach(monthData => {
    totalPresent += monthData.present;
    totalClasses += monthData.total;
  });

  const percentage = totalClasses === 0
    ? 0
    : Math.round((totalPresent / totalClasses) * 100);

  await updateDoc(studentRef, {
    "attendance.overallPercentage": percentage
  });

}


// ======================================================
// 📌 5️⃣ UPDATE MARKS (ANY CATEGORY)
// ======================================================

export async function updateMarks(rollNo, category, marksValue) {

  try {

    const studentRef = doc(db, "students", rollNo.toString());

    await updateDoc(studentRef, {
      [`marks.${category}`]: marksValue
    });

    console.log(`Marks updated: ${rollNo} → ${category}`);

  } catch (error) {
    console.error("Marks update error:", error);
  }

}


// ======================================================
// 📌 6️⃣ GET SINGLE STUDENT
// ======================================================

export async function getStudent(rollNo) {

  const studentRef = doc(db, "students", rollNo.toString());
  const snap = await getDoc(studentRef);

  if (snap.exists()) {
    return snap.data();
  } else {
    return null;
  }

}


// ======================================================
// 📌 7️⃣ GET ALL STUDENTS (250)
// ======================================================

export async function getAllStudents() {

  const snapshot = await getDocs(studentsCollection);

  const students = [];

  snapshot.forEach(doc => {
    students.push({
      rollNo: doc.id,
      ...doc.data()
    });
  });

  return students;

}


// ======================================================
// 📌 8️⃣ DELETE STUDENT
// ======================================================

export async function deleteStudent(rollNo) {

  try {
    await deleteDoc(doc(db, "students", rollNo.toString()));
    alert("Student deleted");
  } catch (error) {
    console.error("Delete error:", error);
  }

}
// Firebase v10 modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, 
  collection, getDocs, serverTimestamp, Timestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp, Timestamp };

// ======================================================
// 📌 9️⃣ EXCEL JSON FORMAT (FOR EASY UPLOAD)
// ======================================================

/*
Expected JSON format for bulk upload:

[
  {
    rollNo: 1,
    name: "Student 1",
    attendance: {
      monthly: {
        January: { present: 20, total: 26 },
        February: { present: 18, total: 24 }
      },
      overallPercentage: 0
    },
    marks: {
      theory: 78,
      practical: 82,
      cat1: 21,
      cat2: 19,
      cat3: 23,
      model: 70,
      university: 88
    }
  }
]

After upload, overall attendance auto-calculated.
*/
