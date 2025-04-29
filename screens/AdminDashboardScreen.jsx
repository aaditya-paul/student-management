"use client";
import AdminNavBar from "@/components/adminNavBar";
import {collection, getDocs} from "@firebase/firestore";
import Link from "next/link";
import React, {useEffect} from "react";
import {db} from "../firebaseConfig";

function AdminDashboardScreen() {
  const [currentTime, setCurrentTime] = React.useState(null);
  const [student, setStudents] = React.useState([]);
  const [teacher, setTeachers] = React.useState([]);

  useEffect(() => {
    const currentTime = new Date().getHours();
    setCurrentTime(currentTime);
  }, []);

  useEffect(() => {
    // get students
    getDocs(collection(db, "students"))
      .then((querySnapshot) => {
        const studentList = [];
        querySnapshot.forEach((doc) => {
          studentList.push(doc.data());
        });
        setStudents(studentList);
      })
      .catch((error) => {
        console.log(error);
      });
    // get teachers
    getDocs(collection(db, "teachers"))
      .then((querySnapshot) => {
        const teacherList = [];
        querySnapshot.forEach((doc) => {
          teacherList.push(doc.data());
        });
        setTeachers(teacherList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="  p-5">
      <div className="  w-full ">
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
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {student.length ? (
                  student.length
                ) : (
                  <span className=" font-mono text-lg text-amber-300/50">
                    Please Wait.
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] ">
              <div className="text-xl font-semibold">Total Teachers.</div>
              <div className=" text-3xl text-amber-300 font-ubuntu">
                {teacher.length ? (
                  teacher.length
                ) : (
                  <span className=" font-mono text-lg text-amber-300/50">
                    Please Wait.
                  </span>
                )}
              </div>
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
              href={"/admin-dashboard/manage-students/add-student"}
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
      {/* <div className="">
        <div className="  mt-4 text-4xl font-bold text-amber-200 ">Notices</div>
        <div className=" w-[250px] bg-[#22252E] rounded-2xl h-full"></div>
      </div> */}
    </div>
  );
}

export default AdminDashboardScreen;
