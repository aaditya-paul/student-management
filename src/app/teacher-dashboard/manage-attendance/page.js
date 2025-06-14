// teacher-dashboard/manage-attendance/page.jsx
"use client";

import React, {useState, useEffect} from "react";
import {fetchUser, fetchUserData} from "../../../../utils/fetchUserFunctions";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import AttendanceManager from "@/components/attendanceManager";
import {IoOpenOutline} from "react-icons/io5";
import Link from "next/link";

function ManageAttendancePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeUser() {
      try {
        const currentUser = await fetchUser(); // Assume this gets auth user
        const userData = await fetchUserData(currentUser.uid); // Assume this gets user details from Firestore
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }
    initializeUser();
  }, []);

  if (loading) {
    return <TransparentLoadingComponent />;
  }

  // Ensure user is loaded and has a valid role before rendering AttendanceManager
  if (!user || (user.type !== "admin" && user.type !== "teacher")) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Access Denied. You must be an admin or teacher to manage attendance.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="text-amber-300 font-bold text-4xl mb-2">
        Manage Attendance.
      </div>
      <div className="text-gray-300 font-bold text-xl ">
        {`Today's date and time: ${new Date().toLocaleString()}`}
      </div>

      <div className="flex flex-wrap gap-5 mt-5">
        <Link
          href={`/teacher-dashboard/manage-attendance/view`}
          className="flex cursor-pointer hover:scale-105 transition-all ease-linear flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
        >
          <div className="text-xl font-semibold">View Attendance</div>
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
        <Link
          href={`/teacher-dashboard/manage-attendance/manage`}
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

      {/* <AttendanceManager
        currentUserUid={user.uid}
        access={user.type} // Pass the user's access role (e.g., "admin", "teacher")
      /> */}
    </div>
  );
}

export default ManageAttendancePage;
