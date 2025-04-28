"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";
import PFP from "../../../../public/assets/user.png";
import {collection, deleteDoc, doc, getDocs} from "@firebase/firestore";
import {db} from "../../../../firebaseConfig";
import Modal from "@/components/modal";
function ManageTeachers() {
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

  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "teachers"));
      const teacherList = [];
      querySnapshot.forEach((doc) => {
        teacherList.push(doc.data());
      });
      setTeachers(teacherList);
      setLoading(false);
    }

    fetchTeachers();
  }, []);
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold  text-amber-300">Manage Teachers.</h1>
      <p className="text-sm">Add/Edit/Remove Teachers.</p>
      <div>
        <div className="p-4 mt-5">
          <div className="flex items-center justify-between mb-4 ">
            <h1 className="text-2xl font-bold mb-4">Teachers List</h1>
            <Link
              href={"/admin-dashboard/manage-teachers/add-teacher"}
              className=" p-3 cursor-pointer active:scale-95 transition-all bg-[#CF3235] font-bold rounded-xl"
            >
              Add Teacher
            </Link>
          </div>
          {/* <table className="min-w-full  border text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border-r border-b">Name</th>
                <th className="py-2 px-4 border-r border-b">Subject</th>
                <th className="py-2 px-4 border-r border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="py-2 px-4 border-r border-b">
                    {teacher.name}
                  </td>
                  <td className="py-2 px-4 border-r border-b">
                    {teacher.subject}
                  </td>
                  <td className="py-2 px-4 border-r border-b">
                    {teacher.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 mb-5 border-2 border-dashed border-amber-200 rounded-xl w-full p-2"
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
                    {teacher.firstName} {teacher.lastName}
                  </div>
                </div>
                <div className="w-1/6 text-center">{teacher.branch}</div>
                <div className="w-1/6 text-center">{teacher.phone}</div>
                <div className="w-1/4 text-center">{teacher.email}</div>
                <div className="w-1/6 flex gap-2 justify-center">
                  <Link
                    href={`/admin-dashboard/manage-teachers/edit-teacher?email=${encodeURIComponent(
                      teacher.email
                    )}`}
                    className="text-white bg-blue-400 w-16 text-center p-2 rounded-lg"
                  >
                    Edit
                  </Link>
                  <div
                    onClick={() => {}}
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

export default ManageTeachers;
