"use client";
import React, {useEffect} from "react";
import Profile from "../../../../screens/profie";
import {onAuthStateChanged} from "@firebase/auth";
import {auth, db} from "../../../../firebaseConfig";
import {doc, getDoc} from "@firebase/firestore";
import {
  TransparentLoadingComponent,
  TransparentLoadingScreen,
} from "@/components/loadingScreen";
import {fetchUser, fetchUserData} from "../../../../utils/fetchUserFunctions";

function Page() {
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState(null);
  useEffect(() => {
    // const fetchUserData = async (uid) => {
    //   getDoc(doc(db, "users", uid))
    //     .then((docSnap) => {
    //       if (docSnap.exists()) {
    //         const userData = docSnap.data();
    //         console.log("User data:", userData);
    //         setUserData(userData);
    //         setLoading(false);
    //       } else {
    //         console.log("No such document!");
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching user data:", error);
    //       setLoading(false);
    //     });
    // };
    // const fetchUser = async () => {
    //   onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       console.log("User is signed in:", user);
    //       fetchUserData(user.uid);
    //     }
    //   });
    // };
    // fetchUser();
    async function fetch() {
      const user = await fetchUser();
      const userDetails = await fetchUserData(user.uid);

      setUserData(userDetails);
    }

    fetch().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading || !userData) {
    return <TransparentLoadingComponent />;
  }
  return <Profile type="student" userData={userData} />;
}

export default Page;
