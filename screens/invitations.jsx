"use client";
import React, {useEffect, useState} from "react";
import {generateUID} from "../utils/uid-generator";
import {collection, deleteDoc, doc, getDocs, setDoc} from "@firebase/firestore";
import {db} from "../firebaseConfig";

function Invitations({environment}) {
  if (environment === "") {
    throw new Error("Type is required");
  } else if (environment !== "admin" && environment !== "teacher") {
    throw new Error("Type must be either 'admin' or 'teacher'");
  }
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");
  const [type, setType] = useState("teacher");
  const [loading, setLoading] = useState(false);
  const [teacherInvitations, setTeacherInvitations] = useState([]);
  const [studentInvitations, setStudentInvitations] = useState([]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "invitations"));
      const teacherInvs = [];
      const studentInvs = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "teacher") teacherInvs.push(data);
        if (data.type === "student") studentInvs.push(data);
      });

      setTeacherInvitations(teacherInvs);
      setStudentInvitations(studentInvs);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const createInviteLink = async (type) => {
    const token = generateUID();
    const baseURL = `${window.location.protocol}//${window.location.host}`;
    const link = `${baseURL}/login?type=${type}&token=${token}`;
    setLink(link);

    await setDoc(
      doc(db, "invitations", token),
      {
        type,
        createdAt: new Date(),
        token,
        link,
        isActive: true,
      },
      {merge: true}
    );

    fetchInvitations(); // Refresh the list after creation
  };

  const modal = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50  backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#1B1C21] w-[700px] h-[300px] rounded-xl shadow-xl flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-amber-300">
          Create {type.toUpperCase()} Link
        </h1>
        <p className="text-sm text-white">
          This link will be valid until you revoke it.
        </p>
        {link && (
          <div
            onClick={() => {
              navigator.clipboard.writeText(link);
              alert("Link Copied to Clipboard.");
            }}
            className="flex flex-col gap-2 mt-5 cursor-pointer"
          >
            <code className=" bg-gray-700/60 p-2 rounded-2xl text-sm text-amber-300 font-bold">
              {link}
            </code>
          </div>
        )}
        <div className="flex gap-5 mt-5">
          <button
            onClick={() => createInviteLink(type)}
            className="active:scale-95 cursor-pointer transition-all ease-linear bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Create
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              setLink("");
            }}
            className="active:scale-95 cursor-pointer transition-all ease-linear bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvites = (invites) =>
    invites.length === 0 ? (
      <div className="h-full w-full flex justify-center items-center text-gray-400">
        No Links Created Yet.
      </div>
    ) : (
      invites.map((invitation, index) => (
        <div
          key={invitation.token}
          className="flex justify-around items-center gap-2"
        >
          <div>{index + 1}.</div>
          <div
            onClick={() => {
              navigator.clipboard.writeText(invitation.link);
              alert("Link Copied to Clipboard.");
            }}
            className="bg-slate-900/60 p-3 cursor-pointer my-2 rounded-lg text-sm text-amber-300 font-bold"
          >
            {invitation.link}
          </div>
          {invitation.isActive ? (
            <div
              onClick={() => {
                setDoc(
                  doc(db, "invitations", invitation.token),
                  {
                    isActive: false,
                  },
                  {merge: true}
                ).then(() => {
                  window.location.reload();
                });
              }}
              className=" bg-red-500/20 hover:bg-red-500 transition-all ease-linear p-3 cursor-pointer my-5 rounded-lg text-sm text-white font-bold"
            >
              <div>Revoke</div>
            </div>
          ) : (
            <div
              onClick={() => {
                setDoc(
                  doc(db, "invitations", invitation.token),
                  {
                    isActive: true,
                  },
                  {merge: true}
                ).then(() => {
                  window.location.reload();
                });
              }}
              className=" bg-green-500/20 cursor-pointer p-3 my-5 rounded-lg text-sm text-white font-bold"
            >
              <div>Activate</div>
            </div>
          )}
          <div>
            <div
              onClick={() => {
                deleteDoc(doc(db, "invitations", invitation.token)).then(() => {
                  window.location.reload();
                });
              }}
              className=" border-2 hover:bg-red-500 border-red-500/20  transition-all ease-linear p-3 cursor-pointer my-5 rounded-lg text-sm text-white font-bold"
            >
              Delete
            </div>
          </div>
        </div>
      ))
    );

  return (
    <div className="p-5">
      {showModal && modal()}
      <h1 className="text-4xl font-bold text-amber-300">Invitation Links</h1>
      <p className="text-sm text-white">Bulk Add Teachers / Students</p>
      <div className="mt-12 flex gap-4">
        {environment === "admin" && (
          <div className="shadow-xl rounded-md basis-1/2 w-full min-h-[350px] border-r-2 border-dashed border-slate-500/20 px-4 py-2">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium text-white">
                Bulk Invite Teachers
              </h2>
              <button
                onClick={() => {
                  setShowModal(true);
                  setType("teacher");
                }}
                className="p-3 cursor-pointer border-2 border-slate-500 text-white hover:bg-slate-500 transition-all rounded-xl"
              >
                Create Link
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center mt-10 text-white">
                Loading...
              </div>
            ) : (
              renderInvites(teacherInvitations)
            )}
          </div>
        )}

        <div className="shadow-xl rounded-md basis-1/2 w-full min-h-[350px] px-4 py-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-medium text-white">
              Bulk Invite Students
            </h2>
            <button
              onClick={() => {
                setShowModal(true);
                setType("student");
              }}
              className="p-3 cursor-pointer border-2 border-slate-500 text-white hover:bg-slate-500 transition-all rounded-xl"
            >
              Create Link
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-10 text-white">
              Loading...
            </div>
          ) : (
            renderInvites(studentInvitations)
          )}
        </div>
      </div>
    </div>
  );
}

export default Invitations;
