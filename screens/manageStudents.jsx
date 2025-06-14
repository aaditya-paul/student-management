"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";
import PFP from "../public/assets/user.png";
import {collection, deleteDoc, doc, getDoc, getDocs} from "@firebase/firestore";
import {db} from "../firebaseConfig";
import Modal from "@/components/modal";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {addDesignationToSem} from "../utils/otherFunctions";

function ManageStudents({type}) {
  const [environment, setEnvironment] = React.useState(type);
  if (type === "") {
    throw new Error("Type is required");
  } else if (type !== "admin" && type !== "teacher") {
    throw new Error("Type must be either 'admin' or 'teacher'");
  }

  //   const teachers = [

  //     {
  //       id: "abc123",
  //       name: "John Doe",
  //       subject: "Mathematics",
  //       email: "john@example.com",
  //     },
  //     {
  //       id: "def456",
  //       name: "Jane Smith",
  //       subject: "Physics",
  //       email: "jane@example.com",
  //     },
  //     //   ...
  //   ];

  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  useEffect(() => {
    if (type === "teacher") {
      setEnvironment("teacher-dashboard");
    } else if (type === "admin") {
      setEnvironment("admin-dashboard");
    }
  }, [environment]);
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "student-invitations")
      );

      const studentPromises = querySnapshot.docs.map(async (docSnap) => {
        const invitationData = docSnap.data();

        if (invitationData.confirmed && invitationData.uid) {
          // Fetch from users collection in parallel
          const userSnap = await getDoc(doc(db, "users", invitationData.uid));
          if (userSnap.exists()) {
            return {...userSnap.data(), uid: invitationData.uid};
          }
        }

        // Fallback to invitation data
        return {...invitationData};
      });

      const studentList = await Promise.all(studentPromises);
      setStudents(studentList);
      setLoading(false);
    }

    fetchStudents();
  }, []);
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold  text-amber-300">Manage Students.</h1>
      <p className="text-sm">Add/Edit/Remove Students.</p>
      <div className="text-sm mt-5 space-y-2">
        <div className="flex gap-3 items-center">
          <div className="border-t-2 border-dashed border-amber-300 font-bold w-6"></div>
          <div>Invitation Not Accepted</div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="border-t-2 border-amber-300 font-bold w-6"></div>
          <div>Invitation Accepted</div>
        </div>
      </div>
      <div>
        <div className="p-4 mt-5">
          <div className="flex items-center justify-between mb-4 ">
            <h1 className="text-2xl font-bold mb-4">Student List</h1>
            <div className=" flex gap-3 items-center">
              <Link
                href={`/${environment}/invitations`}
                className=" p-3 cursor-pointer active:scale-95 transition-all bg-green-500 font-bold rounded-xl"
              >
                Invite Using Link
              </Link>
              <Link
                href={`/${environment}/manage-students/add-student`}
                className=" p-3 cursor-pointer active:scale-95 transition-all bg-[#CF3235] font-bold rounded-xl"
              >
                Add Student
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <TransparentLoadingComponent />
            </div>
          ) : (
            students.map((student, index) => (
              <div
                key={index}
                className={`flex flex-col gap-5 mb-5 border-2 ${
                  student.confirmed ? "border-solid" : "border-dashed"
                } border-amber-200 rounded-xl w-full p-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 w-1/6">
                    <Image
                      src={PFP}
                      alt="pfp"
                      width={50}
                      height={50}
                      className="rounded-full invert"
                    />
                    <div className="font-semibold">
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                  <div className="w-1/6 text-center">{student.branch}</div>
                  <div className="w-1/6 text-center">{student.phone}</div>
                  <div className="w-1/4 text-center">{student.email}</div>
                  <div className="w-1/4 text-center">
                    {student?.semester}

                    {student?.semester && (
                      <span className="">
                        {
                          addDesignationToSem(student?.semester.toString())
                            .inShort
                        }{" "}
                        semester
                      </span>
                    )}
                  </div>
                  <div className="w-1/4 text-center">
                    {student.regNo.toUpperCase()}
                  </div>
                  <div className="w-1/6 flex gap-2 justify-center">
                    <Link
                      href={
                        student?.uid
                          ? `/${environment}/manage-students/edit-student?uid=${encodeURIComponent(
                              student?.uid
                            )}`
                          : "#"
                      }
                      // {`/admin-dashboard/manage-teachers/edit-teacher?uid=${encodeURIComponent(
                      //   teacher?.uid
                      // )}`}
                      className={`text-white w-16 text-center p-2 rounded-lg ${
                        student?.uid ? "bg-blue-400" : "bg-gray-500 text-black"
                      } `}
                    >
                      Edit
                    </Link>
                    <div
                      onClick={() => {
                        console.log("dsds");

                        if (student?.uid) {
                          deleteDoc(doc(db, "users", student?.uid)).then(() => {
                            window.location.reload();
                            alert("Deleted Successfully");
                          });

                          deleteDoc(
                            doc(db, "student-invitations", student.email)
                          ).then(() => {
                            // window.location.reload();
                          });
                        } else {
                          // deleteDoc(doc(db, "users", student?.uid)).then(() => {
                          //   window.location.reload();
                          //   alert("Deleted Successfully");
                          // });

                          deleteDoc(
                            doc(db, "student-invitations", student.email)
                          ).then(() => {
                            window.location.reload();
                          });
                        }
                      }}
                      className={`text-white cursor-pointer ${
                        student?.uid ? "bg-red-500" : " bg-orange-500"
                      } w-18 text-center p-2 rounded-lg`}
                    >
                      {student?.uid ? "Delete" : "Revoke"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageStudents;
