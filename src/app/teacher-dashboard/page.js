"use client";
import {onAuthStateChanged} from "@firebase/auth";
import React, {useEffect} from "react";
import {auth, db} from "../../../firebaseConfig";
import {doc, getDoc} from "@firebase/firestore";
import {useRouter} from "next/navigation";
import LoadingScreen, {
  TransparentLoadingComponent,
} from "@/components/loadingScreen";
import {IoOpenOutline} from "react-icons/io5";
import Link from "next/link";
import NoticeBoard from "@/components/noticeBoard";

function TeacherDashboard() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const [currentTime, setCurrentTime] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  useEffect(() => {
    const currentTime = new Date().getHours();
    setCurrentTime(currentTime);
  }, []);
  // TODO CHANGE THIS LATER TO MODULE

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in:", user.uid);
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData.type);
            console.log(userData);
            setUserData(userData);
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
  if (loading || !userData) {
    return (
      <div className="fixed top-0 left-0 w-screen flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="text-white font-bold text-3xl mt-4">
        {currentTime >= 0 && currentTime < 12
          ? "Good Morning,"
          : currentTime >= 12 && currentTime < 18
          ? "Good Afternoon,"
          : "Good Evening,"}{" "}
        <br />
        <span className="text-amber-300 text-3xl font-black">
          {userData?.firstName} {userData?.lastName}.
        </span>
      </div>
      {/* main shit */}
      <div className="flex justify-between">
        <div className=" basis-[90%] flex flex-col gap-2 mt-10">
          <div className=" flex  gap-5">
            <Link
              href={`/teacher-dashboard/profile`}
              className="flex cursor-pointer hover:scale-105 transition-all ease-linear flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className="text-xl font-semibold">Profile Summary</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {/* {student.length ? (
                student.length
              ) : (
                <span className=" font-mono text-lg text-amber-300/50">
                  Please Wait.
                </span>
              )} */}
                {<IoOpenOutline />}
              </div>
            </Link>
            <Link
              href={`/teacher-dashboard/manage-timetable`}
              className="flex cursor-pointer hover:scale-105 transition-all ease-linear flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className="text-xl font-semibold">View Timetable</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {/* {teacher.length ? (
                teacher.length
              ) : (
                <span className=" font-mono text-lg text-amber-300/50">
                  Please Wait.
                </span>
              )} */}
                {<IoOpenOutline />}
              </div>
            </Link>
          </div>
          <div className=" flex  gap-5">
            <Link
              href={`/teacher-dashboard/manage-students`}
              className="flex cursor-pointer hover:scale-105 transition-all ease-linear flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className="text-xl font-semibold">Manage Students</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {<IoOpenOutline />}
              </div>
            </Link>
            <Link
              href={`/teacher-dashboard/manage-attendance`}
              className="flex cursor-pointer hover:scale-105 transition-all ease-linear flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className="text-xl font-semibold">Manage Attendance</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {/* {teacher.length ? (
                teacher.length
              ) : (
                <span className=" font-mono text-lg text-amber-300/50">
                  Please Wait.
                </span>
              )} */}
                {<IoOpenOutline />}
              </div>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-screen w-[30%] p-5 mx-5 ">
          {/* notice */}
          <NoticeBoard
            currentUserUid={userData.uid}
            access={userData.type}
            currentUserFirstName={userData.firstName}
            currentUserLastName={userData.lastName}
          />
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
