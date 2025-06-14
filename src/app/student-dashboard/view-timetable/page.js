"use client";
import TimetableSetter from "@/components/timetableSetter";
import React, {useEffect} from "react";
import {
  fetchTimeTable,
  fetchUser,
  fetchUserData,
} from "../../../../utils/fetchUserFunctions";
import {addDesignationToSem} from "../../../../utils/otherFunctions";

function Page() {
  const [user, setUser] = React.useState(null);
  const [timetable, setTimetable] = React.useState(null);
  // Initialize as null or an empty object suitable for your TimetableSetter
  const [selectedSem, setSelectedSem] = React.useState(""); // Initial value might need to be dynamic or set based on user's current semester
  useEffect(() => {
    const fetchInit = async () => {
      const user = await fetchUser();
      const userData = await fetchUserData(user.uid);
      setUser(userData);
    };
    fetchInit();
  }, []);

  useEffect(() => {
    // Only fetch timetable if user data is loaded and a branch exists
    const fetchRoutine = async () => {
      if (!user || !user.branch || !user.semester) {
        return; // Exit if user data is not ready or branch/semester is missing
      }
      const selectedSem =
        user.semester +
        addDesignationToSem(user.semester.toString()).inShort +
        "sem";
      setSelectedSem(selectedSem); // Update selectedSem state
      const tuid = `${user.branch.toLowerCase()}_${selectedSem}`;
      console.log(tuid);

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
  }, [user]); // Depend on selectedSem and user

  return (
    <div className="flex flex-col h-screen p-5">
      <TimetableSetter
        mode="view"
        access={user?.type}
        currentUserUid={user?.uid}
        timetable={timetable}
        branch={user?.branch}
        semester={selectedSem}
        fullScreen={true}
      />
    </div>
  );
}

export default Page;
