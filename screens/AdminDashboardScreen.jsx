"use client";
import AdminNavBar from "@/components/adminNavBar";
import Link from "next/link";
import React, {useEffect} from "react";

function AdminDashboardScreen() {
  const [currentTime, setCurrentTime] = React.useState(null);
  useEffect(() => {
    const currentTime = new Date().getHours();
    setCurrentTime(currentTime);
  }, []);
  return (
    <div>
      <div className="p-5 w-full">
        {/* Greetings */}
        <div className="text-white font-bold text-3xl mt-4">
          {currentTime >= 0 && currentTime < 12
            ? "Good Morning,"
            : currentTime >= 12 && currentTime < 18
            ? "Good Afternoon,"
            : "Good Evening,"}{" "}
          <br />
          <span className="text-amber-300 text-3xl font-black">Admin.</span>
        </div>
        {/* Metrics */}
        <div className="flex flex-col gap-2 mt-10">
          <div className=" flex  gap-5">
            <div className="flex flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] ">
              <div className="text-xl font-semibold">Total Students.</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">240</div>
            </div>
            <div className="flex flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] ">
              <div className="text-xl font-semibold">Total Teachers.</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">12</div>
            </div>
          </div>
        </div>
        {/* quickAccess */}
        <div>
          <div className="text-white font-bold text-3xl mt-10">
            Quick Access.
          </div>
          <div className="flex gap-5 mt-5">
            <Link
              href={"/admin-dashboard/manage-students"}
              className="flex flex-col items-center justify-center gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className=" text-3xl text-amber-300 font-ubuntu">+</div>
              <div className="text-xl font-semibold">Add Student.</div>
            </Link>
            <Link
              href={"/admin-dashboard/manage-teachers/add-teacher"}
              className="flex flex-col items-center justify-center gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] "
            >
              <div className=" text-3xl text-amber-300 font-ubuntu">+</div>
              <div className="text-xl font-semibold">Add Teacher.</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardScreen;
