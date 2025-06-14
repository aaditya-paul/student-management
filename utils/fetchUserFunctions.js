import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import {onAuthStateChanged} from "@firebase/auth";
import {auth, db} from "../firebaseConfig";
import {resolve} from "styled-jsx/css";
import {GitBranch} from "lucide-react";

// Get current user as a Promise
export const fetchUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Stop listening after first response
        if (user) {
          resolve(user);
        } else {
          reject(new Error("No user is signed in."));
        }
      },
      reject
    );
  });
};

// Fetch user data from Firestore
export const fetchUserData = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data(); // returns userData
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    throw new Error(`Error fetching user data: ${error.message}`);
  }
};
export const fetchTeachers = async () => {
  try {
    const docSnap = await getDocs(
      query(collection(db, "users"), where("type", "==", "teacher"))
    );
    if (docSnap.empty) {
      throw new Error("No teachers found.");
    }
    const teachers = [];
    docSnap.forEach((doc) => {
      teachers.push(doc.data());
    });
    return teachers;
  } catch (error) {
    throw new Error(`Error fetching user data: ${error.message}`);
  }
};

export const fetchStudentsByQuery = async (branch, semester) => {
  try {
    const studentsCollectionRef = collection(db, "users"); // Assuming students are stored in a 'users' collection

    // Start with a query filtering by branch and role
    let q = query(
      studentsCollectionRef,
      where("branch", "==", branch), // Filter by the selected branch
      where("type", "==", "student") // Ensure only documents with type "student" are fetched
    );

    // --- IMPORTANT: Uncomment the following block when you add 'semester' field to your student documents ---
    // This will allow you to further filter students by semester.
    // if (semester) {
    //     // Ensure the 'semester' field in your student documents matches the format
    //     // of the 'semester' parameter (e.g., "1st Sem", "2nd Sem").
    //     q = query(q, where("semester", "==", semester));
    // }
    // -----------------------------------------------------------------------------------------------------

    const querySnapshot = await getDocs(q);

    // Map the document snapshots to student objects, including their UID
    const students = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    // Throw the error to be caught by the calling component (AttendanceManager)
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
};
export const fetchStudents = async () => {
  try {
    const docSnap = await getDocs(
      query(collection(db, "users"), where("type", "==", "student"))
    );
    if (docSnap.empty) {
      throw new Error("No students found.");
    }
    const students = [];
    docSnap.forEach((doc) => {
      students.push(doc.data());
    });
    return students;
  } catch (error) {
    throw new Error(`Error fetching user data: ${error.message}`);
  }
};

export const fetchSubjects = async () => {
  return new Promise((resolve, reject) => {
    try {
      getDocs(query(collection(db, "users"), where("admin", "==", true))).then(
        (querySnapshot) => {
          const subjects = [];
          querySnapshot.forEach((doc) => {
            subjects.push(doc.data().subjects);
          });
          resolve(subjects[0]);
        }
      );
    } catch (error) {
      reject(new Error(`Error fetching subjects: ${error.message}`));
    }
  });
};
export const fetchTimeTable = async (tuid) => {
  return new Promise((resolve, reject) => {
    try {
      getDoc(doc(db, "timetables", tuid)).then((querySnapshot) => {
        if (querySnapshot.exists()) {
          const timetable = querySnapshot.data();
          resolve(timetable);
        } else {
          // reject(new Error("No timetable found for this user."));
          resolve(null); // Return null if no timetable exists
        }
      });
    } catch (error) {
      reject(new Error(`Error fetching time table: ${error.message}`));
    }
  });
};

export const fetchSemesterType = async () => {
  return new Promise((resolve, reject) => {
    const admin = [];
    try {
      getDocs(query(collection(db, "users"), where("admin", "==", true))).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            admin.push(doc.data());
          });
          console.log(admin[0].semesterType);
          resolve(admin[0]?.semesterType);
        }
      );
    } catch (error) {
      reject(new Error(`Error fetching semester type: ${error.message}`));
    }
  });
};
