"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";
import PFP from "../../../../public/assets/user.png";
import {collection, deleteDoc, doc, getDoc, getDocs} from "@firebase/firestore";
import {db} from "../../../../firebaseConfig";
import Modal from "@/components/modal";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
function ManageTeachers() {
  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  // useEffect(() => {
  //   async function fetchTeachers() {
  //     setLoading(true);
  //     const querySnapshot = await getDocs(
  //       collection(db, "teacher-invitations")
  //     );
  //     const teacherList = [];

  //     // Loop through each invitation
  //     for (const docSnap of querySnapshot.docs) {
  //       const invitationData = docSnap.data();

  //       if (invitationData.confirmed && invitationData.uid) {
  //         // Fetch full user data from users collection
  //         const userRef = doc(db, "users", invitationData.uid);
  //         const userSnap = await getDoc(userRef);
  //         // const userSnap = await userRef.getD();

  //         if (userSnap.exists()) {
  //           teacherList.push({...userSnap.data(), uid: invitationData.uid});
  //         }
  //       } else {
  //         // Use invitation data directly
  //         teacherList.push({...invitationData});
  //       }
  //     }

  //     setTeachers(teacherList);
  //     setLoading(false);
  //   }

  //   fetchTeachers();
  // }, []);

  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "teacher-invitations")
      );

      const teacherPromises = querySnapshot.docs.map(async (docSnap) => {
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

      const teacherList = await Promise.all(teacherPromises);
      setTeachers(teacherList);
      setLoading(false);
    }

    fetchTeachers();
  }, []);
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold  text-amber-300">Manage Teachers.</h1>
      <p className="text-sm">Add/Edit/Remove Teachers.</p>
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
            <h1 className="text-2xl font-bold mb-4">Teachers List</h1>
            <div className=" flex gap-3 items-center">
              <Link
                href={"/admin-dashboard/invitations"}
                className=" p-3 cursor-pointer active:scale-95 transition-all bg-green-500 font-bold rounded-xl"
              >
                Invite Using Link
              </Link>
              <Link
                href={"/admin-dashboard/manage-teachers/add-teacher"}
                className=" p-3 cursor-pointer active:scale-95 transition-all bg-[#CF3235] font-bold rounded-xl"
              >
                Add Teacher
              </Link>
            </div>
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
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <TransparentLoadingComponent />
            </div>
          ) : (
            teachers.map((teacher, index) => (
              <div
                key={index}
                className={`flex flex-col gap-5 mb-5 border-2 ${
                  teacher.confirmed ? "border-solid" : "border-dashed"
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
                      {teacher.firstName} {teacher.lastName}
                    </div>
                  </div>
                  <div className="w-1/6 text-center">{teacher.branch}</div>
                  <div className="w-1/6 text-center">{teacher.phone}</div>
                  <div className="w-1/4 text-center">{teacher.email}</div>
                  <div className="w-1/6 flex gap-2 justify-center">
                    <Link
                      href={
                        teacher?.uid
                          ? `/admin-dashboard/manage-teachers/edit-teacher?uid=${encodeURIComponent(
                              teacher?.uid
                            )}`
                          : "#"
                      }
                      // {`/admin-dashboard/manage-teachers/edit-teacher?uid=${encodeURIComponent(
                      //   teacher?.uid
                      // )}`}
                      className={`text-white w-16 text-center p-2 rounded-lg ${
                        teacher?.uid ? "bg-blue-400" : "bg-gray-500 text-black"
                      } `}
                    >
                      Edit
                    </Link>
                    <div
                      onClick={() => {
                        if (teacher?.uid) {
                          deleteDoc(doc(db, "users", teacher?.uid)).then(() => {
                            window.location.reload();
                          });
                        } else {
                          deleteDoc(
                            doc(db, "teacher-invitations", teacher.email)
                          ).then(() => {
                            window.location.reload();
                          });
                        }
                      }}
                      className={`text-white cursor-pointer ${
                        teacher?.uid ? "bg-red-500" : " bg-orange-500"
                      } w-18 text-center p-2 rounded-lg`}
                    >
                      {teacher?.uid ? "Delete" : "Revoke"}
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

export default ManageTeachers;
