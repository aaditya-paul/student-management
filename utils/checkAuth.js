// "use client";
// import {onAuthStateChanged} from "@firebase/auth";
// import React, {useEffect} from "react";
// import {useDispatch} from "react-redux";
// import {useSelector} from "react-redux";
// import {auth, db} from "../../../firebaseConfig";
// import {usePathname, useRouter} from "next/navigation";
// import {setUserRedux} from "@/lib/redux/features/auth";
// import {doc, getDoc} from "@firebase/firestore";
// import LoadingScreen from "@/components/loadingScreen";

// function ProtectedRoute() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const url = usePathname();
//   const user = useSelector((state) => state.authState.user);
//   const getUser = async () => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         await getDoc(doc(db, "users", user.uid)).then((docSnap) => {
//           if (docSnap.exists()) {
//             const userData = docSnap.data();
//             console.log("User data:", userData);
//             dispatch(setUserRedux(userData));
//           } else {
//             console.log("No such document!");
//           }
//         });
//       } else {
//         // TODO MIGHT BE CHANGED
//         router.push("/");
//       }
//     });
//   };

//   useEffect(() => {
//     if (user) {
//       getUser();

//       if (user.type === "admin") {
//         router.push("/admin-dashboard");
//       } else if (user.type === "student") {
//         router.push("/student-dashboard");
//       } else if (user.type === "teacher") {
//         router.push("/teacher-dashboard");
//       } else {
//         router.push("/");
//       }
//     }
//   }, []);
//   console.log("user", user);

//   return null;
// }

// export default ProtectedRoute;

import React from "react";

function ProtectedRoute() {
  return null;
}

export default ProtectedRoute;
