"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";
import PFP from "../../../../public/assets/user.png";
import {collection, deleteDoc, doc, getDocs} from "@firebase/firestore";
import {db} from "../../../../firebaseConfig";
import Modal from "@/components/modal";
function ManageStudents() {
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
    async function fetchStudents() {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "student-invitations")
      );
      const studentList = [];
      querySnapshot.forEach((doc) => {
        studentList.push(doc.data());
      });
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
            <Link
              href={"/admin-dashboard/manage-students/add-student"}
              className=" p-3 cursor-pointer active:scale-95 transition-all bg-[#CF3235] font-bold rounded-xl"
            >
              Add Student
            </Link>
          </div>

          {students.map((student, index) => (
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
                <div className="w-1/6 flex gap-2 justify-center">
                  <Link
                    href={`/admin-dashboard/manage-students/edit-student?email=${encodeURIComponent(
                      student.email
                    )}`}
                    className="text-white bg-blue-400 w-16 text-center p-2 rounded-lg"
                  >
                    Edit
                  </Link>
                  <div
                    onClick={() => {
                      deleteDoc(
                        doc(db, "student-invitations", student.email)
                      ).then(() => {
                        window.location.reload();
                      });
                    }}
                    className="text-white cursor-pointer bg-[#CF3235] w-16 text-center p-2 rounded-lg"
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageStudents;
