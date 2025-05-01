"use client";
import {onAuthStateChanged} from "@firebase/auth";
import React, {useEffect} from "react";
import {auth, db} from "../../../firebaseConfig";
import {usePathname, useRouter} from "next/navigation";
import {setUserRedux} from "@/lib/redux/features/auth";
import {doc, getDoc} from "@firebase/firestore";
import {useDispatch} from "react-redux";
import LoadingScreen from "@/components/loadingScreen";

function Redirect() {
  const router = useRouter();
  const dispatch = useDispatch();
  const url = usePathname();
  const [UD, setUD] = React.useState(null);
  console.log("URL", url);

  useEffect(() => {
    setInterval(() => {
      window.location.reload();
    }, 5000);
  }, []);

  const getUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData.type);
            dispatch(setUserRedux(userData));
            setUD(userData);
            if (userData.type === "admin") {
              router.replace("/admin-dashboard");
            } else if (userData.type === "student") {
              router.replace("/student-dashboard");
            } else if (userData.type === "teacher") {
              router.replace("/teacher-dashboard");
            }
          } else {
            console.log("No such document!");
          }
        });
      } else {
        // TODO MIGHT BE CHANGED
        router.push("/");
      }
    });
  };
  useEffect(() => {
    setTimeout(() => {
      getUser();
    }, 2500);
  }, []);
  return (
    <div>
      <LoadingScreen />
    </div>
  );
}

export default Redirect;
