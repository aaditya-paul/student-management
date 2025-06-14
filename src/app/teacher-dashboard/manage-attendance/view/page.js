// teacher-dashboard/view-attendance/page.jsx
"use client";

import React, {useState, useEffect} from "react";

import {TransparentLoadingComponent} from "@/components/loadingScreen";
import AttendanceCalendarView from "@/components/attendanceViewer";
import {
  fetchUser,
  fetchUserData,
} from "../../../../../utils/fetchUserFunctions";

function ViewAttendancePage() {
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
        // Handle error, e.g., redirect to login or show an error message
      } finally {
        setLoading(false);
      }
    }
    initializeUser();
  }, []);

  if (loading) {
    return <TransparentLoadingComponent />;
  }

  // Render the AttendanceCalendarView component
  return (
    <div className="min-h-screen">
      <AttendanceCalendarView
        access={user?.type || "guest"} // Pass the user's access role
      />
    </div>
  );
}

export default ViewAttendancePage;
