"use client";
import {onAuthStateChanged} from "@firebase/auth";
import React, {useEffect} from "react";
import {auth, db} from "../../../firebaseConfig";
import {doc, getDoc} from "@firebase/firestore";
import {useRouter} from "next/navigation";
import LoadingScreen, {
  TransparentLoadingComponent,
} from "@/components/loadingScreen";

function TeacherDashboard() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in:", user.uid);
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData.type);
            // Perform any actions you need with the user data
          } else {
            // console.log("No such document!");
            router.push("/teacher/details?uid=" + user.uid);
          }
        });
        // Perform any actions you need with the authenticated user
      } else {
        // User is not logged in, redirect or show a message
        console.log("User is not logged in");
      }
    });
    setLoading(false);
  }, [router]);
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }
  return <div>teacher </div>;
}

export default TeacherDashboard;
