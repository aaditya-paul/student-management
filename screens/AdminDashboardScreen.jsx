"use client";
import AdminNavBar from "@/components/adminNavBar";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import Link from "next/link";
import React, {useEffect} from "react";
import {db} from "../firebaseConfig";
import LoadingScreen, {
  TransparentLoadingComponent,
  TransparentLoadingScreen,
} from "@/components/loadingScreen";

function AdminDashboardScreen() {
  const [currentTime, setCurrentTime] = React.useState(null);
  const [student, setStudents] = React.useState([]);
  const [teacher, setTeachers] = React.useState([]);
  const [branch, setBranch] = React.useState("");
  const [semesterType, setSemesterType] = React.useState("");
  const [admin, setAdmin] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [subjects, setSubjects] = React.useState([]);
  const [subjectText, setSubjectText] = React.useState("");
  useEffect(() => {
    const currentTime = new Date().getHours();
    setCurrentTime(currentTime);
  }, []);

  useEffect(() => {
    // get students
    getDocs(query(collection(db, "users"), where("admin", "==", true))).then(
      (querySnapshot) => {
        const admin = [];
        querySnapshot.forEach((doc) => {
          admin.push(doc.data());
          // console.log("Admin Data:", doc.data().uid);
        });
        console.log(admin[0].uid);
        setSemesterType(admin[0]?.semesterType || "");
        setAdmin(admin[0]);
        // admin[0]
        // setStudents(studentList);
      }
    );
    getDocs(collection(db, "student-invitations"))
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
    getDocs(collection(db, "teacher-invitations"))
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

    setLoading(false);
  }, []);

  if (loading || teacher == "" || student == "") {
    return (
      <div className=" w-full h-screen flex justify-center items-center">
        {/* <LoadingScreen /> */}
        <TransparentLoadingComponent />
      </div>
    );
  }

  return (
    <div className=" h-full p-5">
      <div className=" h-full w-full ">
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
        <div className="mt-10">
          <span className="text-white font-semibold text-lg ">
            Please Set Timetable
          </span>
          <Link
            href={`/admin-dashboard/manage-timetable`}
            className="text-black font-semibold text-lg p-4 bg-amber-300 rounded-lg hover:bg-amber-400 transition-all ease-linear ml-3"
          >
            Set Time Table
          </Link>
        </div>
        <div className=" mt-5 ">
          <span className="text-white font-semibold text-lg ">
            Semester Type :{" "}
            <span className="text-amber-300">
              {/* Display semester type here */}
              <select
                value={semesterType}
                onChange={(e) => setSemesterType(e.target.value)}
                className="outline-none bg-[#090C15] p-2 text-gray-400 md:p-2 border-2 border-slate-700 rounded-lg mt-2 w-52"
              >
                <option value="">Select Type</option>
                <option value="odd">ODD</option>
                <option value="even">EVEN</option>
              </select>
            </span>
            <button
              onClick={() => {
                setDoc(
                  doc(db, "users", admin?.uid),
                  {semesterType: semesterType},
                  {merge: true}
                ).then(() => {
                  alert("Semester Type Updated Successfully.");
                });
              }}
              className=" ml-3 w-24 cursor-pointer bg-amber-300 text-black p-2 rounded-lg hover:bg-amber-400 transition-all ease-linear"
            >
              Set
            </button>
          </span>
        </div>

        <div className="mt-10 flex flex-col  gap-5 bg-white/10 p-5 rounded-lg  w-[62%] h-[400px]">
          <div className="text-lg font-semibold">
            <div className="text-xl">Add Subjects Taught in College.</div>
            <div className="mt-3 flex justify-between items-center gap-4">
              <input
                type="text"
                className="outline-none p-2 md:p-3 border-2 border-gray-500 rounded-lg  w-[70%]"
                placeholder="Enter Subject"
                onChange={(e) => {
                  setSubjectText(e.target.value.toLowerCase());
                }}
              />
              <button
                onClick={() => {
                  if (subjectText) {
                    setDoc(
                      doc(db, "users", admin?.uid),
                      {
                        subjects: arrayUnion(subjectText),
                      },
                      {merge: true}
                    ).then(() => {
                      alert("Subject Added Successfully.");
                      setSubjectText("");
                      window.location.reload();
                    });
                  } else {
                    alert("Please enter a subject.");
                  }
                }}
                className="text-center cursor-pointer hover:bg-amber-300 transition-all ease-linear basis-1/3 bg-white p-2 md:p-3 rounded-lg text-black"
              >
                Add
              </button>
            </div>
            <div className="h-60 mt-2 flex flex-col overflow-y-scroll hide-scrollbar">
              {admin?.subjects ? (
                admin?.subjects.map((subject, index) => (
                  <div
                    className=" flex justify-between items-center  text-[16px] pl-3 py-1 mt-3 rounded-md bg-[#1B1C21]/40 font-medium "
                    key={index}
                  >
                    <div className=" ">{subject.toUpperCase()}</div>
                    <button
                      onClick={() => {
                        setDoc(
                          doc(db, "users", admin?.uid),
                          {
                            subjects: arrayRemove(subject),
                          },
                          {merge: true}
                        ).then(() => {
                          window.location.reload();
                        });
                      }}
                      className="cursor-pointer hover:bg-red-500 transition-all ease-linear border border-red-500 rounded-lg p-2"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 mt-5">No Subjects Added Yet.</div>
              )}
            </div>
          </div>
        </div>
        {/* Metrics */}
        <div className="flex flex-col gap-2 mt-10">
          <div className=" flex  gap-5">
            <div className="flex flex-col gap-5 bg-white/10 p-5 rounded-lg mt-5 w-[30%] h-[200px] ">
              <div className="text-xl font-semibold">
                <span>Total Students.</span>
                <br />
                <span>(includes invitations)</span>
              </div>
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
              <div className="text-xl font-semibold">
                <span>Total Teachers.</span>
                <br />
                <span>(includes invitations)</span>
              </div>
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
