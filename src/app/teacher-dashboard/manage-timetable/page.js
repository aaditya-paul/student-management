"use client";
import React, {useEffect} from "react";
import {
  fetchSemesterType,
  fetchSubjects,
  fetchTimeTable,
  fetchUser,
  fetchUserData,
} from "../../../../utils/fetchUserFunctions";
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {collection, getDoc, getDocs, query, where} from "@firebase/firestore"; // These are not used in the provided code, can be removed if truly unused
import {db} from "../../../../firebaseConfig"; // Not directly used in Page.jsx, but assumed for fetchUserFunctions
import Link from "next/link";
import TimetableDisplay from "@/components/timetable"; // Not used in the provided code, can be removed if truly unused
import TimetableSetter from "@/components/timetableSetter";

function Page() {
  const [date, setDate] = React.useState(new Date());
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [semesterType, setSemesterType] = React.useState("");
  const [subjects, setSubjects] = React.useState([]); // Not used in Page.jsx rendering, can be removed if truly unused
  const [timetable, setTimetable] = React.useState(null); // Initialize as null or an empty object suitable for your TimetableSetter
  const [selectedSem, setSelectedSem] = React.useState("1stsem"); // Initial value might need to be dynamic or set based on user's current semester

  // Effect to update date
  useEffect(() => {
    setDate(new Date());
  }, []);

  const sem = [
    {
      name: (
        <span>
          1<sup>st</sup> Sem
        </span>
      ),
      value: "1stsem",
      id: 1,
    },
    {
      name: (
        <span>
          2<sup>nd</sup> Sem
        </span>
      ),
      value: "2ndsem",
      id: 2,
    },
    {
      name: (
        <span>
          3<sup>rd</sup> Sem
        </span>
      ),
      value: "3rdsem",
      id: 3,
    },
    {
      name: (
        <span>
          4<sup>th</sup> Sem
        </span>
      ),
      value: "4thsem",
      id: 4,
    },
    {
      name: (
        <span>
          5<sup>th</sup> Sem
        </span>
      ),
      value: "5thsem",
      id: 5,
    },
    {
      name: (
        <span>
          6<sup>th</sup> Sem
        </span>
      ),
      value: "6thsem",
      id: 6,
    },
  ];

  // Effect for initial data fetching (user, semester type, subjects)
  useEffect(() => {
    async function initializeData() {
      try {
        const currentUser = await fetchUser();
        const userData = await fetchUserData(currentUser.uid);
        setUser(userData);

        const type = await fetchSemesterType();
        setSemesterType(type);

        const fetchedSubjects = await fetchSubjects();
        setSubjects(fetchedSubjects);
      } catch (err) {
        // console.error("Error initializing data:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeData();
  }, []);

  // Effect to fetch timetable when user data or selected semester changes
  useEffect(() => {
    // Only fetch timetable if user data is loaded and a branch exists
    if (user && user.branch) {
      const fetchRoutine = async () => {
        const tuid = `${user.branch.toLowerCase()}_${selectedSem}`;
        try {
          const fetchedTimetable = await fetchTimeTable(tuid);
          setTimetable(fetchedTimetable); // This will update the timetable prop
          console.log("Fetched timetable for", tuid, ":", fetchedTimetable);
        } catch (err) {
          console.error("Error fetching timetable:", err);
          setTimetable(null); // Set to null if fetching fails or no timetable found
        }
      };
      fetchRoutine();
    }
  }, [selectedSem, user]); // Depend on selectedSem and user

  if (loading) {
    return <TransparentLoadingComponent />;
  }

  return (
    <div className=" p-5 w-full h-full">
      <div className=" w-full flex items-center justify-center gap-2 text-2xl font-bold text-amber-300 mt-2">
        <div>Today&apos;s Date</div>
        <div>:</div>
        <div className="text-white">
          {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()} ,{" "}
          {date.getDay() === 0
            ? "Sunday"
            : date.getDay() === 1
            ? "Monday"
            : date.getDay() === 2
            ? "Tuesday"
            : date.getDay() === 3
            ? "Wednesday"
            : date.getDay() === 4
            ? "Thursday"
            : date.getDay() === 5
            ? "Friday"
            : "Saturday"}
        </div>
      </div>
      <div className=" flex flex-col h-full ">
        <div className="mt-10 basis-1 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <div className=" flex justify-between gap-2">
            <div className=" text-xl flex font-medium gap-2 font-ubuntu text-amber-300">
              <div>Timetable For Branch</div>
              <div>:</div>
              <div className="text-white font-normal">{user?.branch}</div>
            </div>
            <div className=" text-xl flex font-medium gap-2 font-ubuntu text-amber-300">
              <div>Current Semester</div>
              <div>:</div>
              <div className="text-white font-normal">
                {semesterType?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 basis-1 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <div className=" flex flex-col gap-2 w-full">
            <div className=" w-full flex gap-4 justify-between text-lg font-semibold text-amber-300">
              {sem.map((s, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSem(s.value)}
                  className={` ${
                    selectedSem === s.value
                      ? "bg-amber-300 text-black"
                      : "text-amber-300"
                  } hover:bg-amber-300 hover:text-black cursor-pointer transition-colors duration-200  px-4 py-2 rounded-lg`}
                >
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conditional rendering for TimetableSetter or Create Timetable link */}
        {timetable ? (
          <div className="w-full ">
            <TimetableSetter
              key={selectedSem}
              mode="edit" // Set to edit mode for teachers to modify their slots
              currentUserUid={user?.uid}
              access="teacher"
              timetable={timetable} // Pass the fetched timetable object
              branch={user?.branch.toLowerCase()} // Pass the branch
              sem={selectedSem} // Pass the selected semester
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-white text-center text-xl ">
              No timetable created yet for {user?.branch} -{" "}
              {selectedSem.replace("sem", " Sem")}.
            </div>
            {/* Show "Create Timetable" only if the user is an admin or has specific permission */}
            {user?.access === "admin" && ( // Assuming user object has an 'access' field
              <Link
                href={`/teacher-dashboard/manage-timetable/create?uid=${
                  user?.uid
                }&branch=${user?.branch.toLowerCase()}&semesterType=${semesterType}`}
                prefetch={false}
                className="mt-4 cursor-pointer bg-amber-300 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors duration-200"
              >
                Create Timetable
              </Link>
            )}
            {user?.access !== "admin" && (
              <div className="text-gray-400 text-sm mt-2">
                Please contact your administrator to create a timetable.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
