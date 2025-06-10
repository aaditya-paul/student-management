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
