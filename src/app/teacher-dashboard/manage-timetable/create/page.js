"use client";
import {useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {fetchUserData} from "../../../../../utils/fetchUserFunctions";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import TimetableSetter from "@/components/timetableSetter";

function CreateTimeTable() {
  const uid = useSearchParams().get("uid");
  const branch = useSearchParams().get("branch");
  const semesterType = useSearchParams().get("semesterType");
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [subjects, setSubjects] = React.useState([]);
  const [timetable, setTimetable] = React.useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  useEffect(() => {
    fetchUserData(uid)
      .then((d) => {
        setUserData(d);
        setTimetable(d.timetable || []);
        setSubjects(d.subjects || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uid]);

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }
  if (!uid || !branch || !semesterType) {
    return (
      <div className="p-5">
        <div className="text-2xl font-bold mb-4 text-red-500">
          Missing required parameters.
        </div>
        <p>Please provide uid, branch, and semesterType in the URL.</p>
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="text-4xl font-bold mb-4 text-amber-300">
        Create Timetable.
      </div>
      <div className="text-xl bg-[#1B1C21] p-4 rounded-lg w-[70%] mx-auto mt-10 ">
        <div>
          <p className="text-gray-300 font-bold font-ubuntu">
            Creating timetable for :{" "}
            <span className="text-amber-300">
              {userData.firstName} {userData.lastName}
            </span>
          </p>
          <p className="text-gray-300 font-bold font-ubuntu">
            Semester :{" "}
            <span className="text-amber-300">
              {semesterType.toUpperCase()}{" "}
            </span>
          </p>
          <p className="text-gray-300 font-bold font-ubuntu">
            Branch :{" "}
            <span className="text-amber-300">{branch.toUpperCase()}</span>
          </p>
        </div>
      </div>
      {/* <div className="text-xl bg-[#1B1C21] p-4 rounded-lg w-[70%] mx-auto mt-2 "></div> */}
      {/* <TimetableSetter /> */}
    </div>
  );
}

export default CreateTimeTable;
