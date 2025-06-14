// teacher-dashboard/manage-attendance/page.jsx
"use client";

import React, {useState, useEffect} from "react";

import {TransparentLoadingComponent} from "@/components/loadingScreen";
import AttendanceManager from "../../../../components/attendanceManager"; // Adjust path as needed
import {
  fetchUser,
  fetchUserData,
} from "../../../../../utils/fetchUserFunctions";

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
    <div className="min-h-screen">
      <AttendanceManager
        currentUserUid={user.uid}
        access={user.type} // Pass the user's access role (e.g., "admin", "teacher")
      />
    </div>
  );
}

export default ManageAttendancePage;
