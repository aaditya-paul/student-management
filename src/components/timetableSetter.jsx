// TimetableSetter.jsx
"use client"; // This directive is often used in Next.js for client-side components

import React, {useState, useEffect, useRef} from "react";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {db} from "../../firebaseConfig"; // Ensure this path is correct
import BRANCHES from "../../branch.json"; // Assuming you have a JSON file for branches
// Assuming TransparentLoadingComponent exists in your components library
// If not, you can create a simple loading spinner or remove its usage
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {fetchSubjects, fetchTeachers} from "../../utils/fetchUserFunctions";

// --- Utility Functions (Normalize strings and generate IDs if needed) ---
const normalizeString = (str) => {
  if (!str) return "";
  return str.trim().toLowerCase();
};

// Simple capitalize function for display
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function TimetableSetter({
  mode = "edit",
  access = "admin",
  currentUserUid = null,
  timetable = null, // Parameter for pre-provided timetable
  branch = null, // Parameter for pre-provided branch
  sem = null, // Parameter for pre-provided semester
}) {
  // --- State Management ---
  // Remove internalTimetable if it's meant to directly reflect the prop
  // const [internalTimetable, setInternalTimetable] = useState(timetable); // This only runs ONCE

  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(branch || "");
  const [selectedSemester, setSelectedSemester] = useState(sem || "");
  const [customTimeInput, setCustomTimeInput] = useState(
    "10:30 AM, 11:30 AM, 12:30 PM, 1:30 PM, 2:30 PM, 3:30 PM, 4:30 AM, 5:30 AM"
  );
  const [timeSlots, setTimeSlots] = useState([]); // Parsed from customTimeInput

  // The core timetable data for display and saving
  // Structure: { "monday": { "9:00 AM": { subject: "IT", teacher: {uid, firstName, lastName} }, ... }, ... }
  const [timetableData, setTimetableData] = useState({});

  // States for selecting a cell to edit
  const [editingCell, setEditingCell] = useState(null); // { day: string, time: string }
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(""); // Stores subject string (e.g., "IT")
  const [currentTeacher, setCurrentTeacher] = useState(""); // Stores teacher UID

  // Available data from Firestore
  const [availableSubjects, setAvailableSubjects] = useState([]); // Array of strings e.g., ["IT", "DBMS"]
  const [availableTeachers, setAvailableTeachers] = useState([]); // Array of objects with uid, firstName, lastName
  const [availableSemesters, setAvailableSemesters] = useState([]);

  // Ref for the time input to maintain focus if needed
  const timeInputRef = useRef(null);

  // --- Initial Data Fetch (subjects, teachers, static semesters) ---
  useEffect(() => {
    const fetchStaticData = async () => {
      setLoading(true);
      try {
        const subjects = await fetchSubjects();
        setAvailableSubjects(subjects);

        const teachers = await fetchTeachers();
        setAvailableTeachers(teachers);

        setAvailableSemesters([
          "1st Sem",
          "2nd Sem",
          "3rd Sem",
          "4th Sem",
          "5th Sem",
          "6th Sem",
        ]);

        // Initialize timeSlots based on customTimeInput default if no timetable prop
        if (!timetable) {
          const initialSlots = customTimeInput
            .split(",")
            .map((time) => time.trim())
            .filter((time) => time !== "");
          setTimeSlots(initialSlots);

          // Initialize timetableData with empty slots for all days if no timetable prop
          const initialTimetable = {};
          const daysOfWeek = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map(normalizeString);
          daysOfWeek.forEach((day) => {
            initialTimetable[day] = {};
            initialSlots.forEach((slot) => {
              initialTimetable[day][slot] = null;
            });
          });
          setTimetableData(initialTimetable);
        }
      } catch (error) {
        console.error("Error fetching initial static data:", error);
        alert("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaticData();
  }, [timetable]); // Add timetable to dependency array if you want this effect to rerun when timetable changes initially

  // --- Effect to update internal state when 'timetable' prop changes ---
  // This is the primary fix for the re-render issue
  useEffect(() => {
    if (timetable) {
      // If a timetable prop is provided, update the internal state
      setTimetableData(timetable.timetable || {});
      setTimeSlots(timetable.timeSlots || []);
      setCustomTimeInput((timetable.timeSlots || []).join(", "));
      setSelectedBranch(branch || ""); // Set branch from prop
      setSelectedSemester(sem || ""); // Set semester from prop
    }
  }, [timetable, branch, sem]); // Depend on timetable, branch, and sem props

  // --- Handle Time Input Change ---
  const handleTimeInputChange = (e) => {
    const input = e.target.value;
    setCustomTimeInput(input);
    const newTimeSlots = input
      .split(",")
      .map((time) => time.trim())
      .filter((time) => time !== "");
    setTimeSlots(newTimeSlots);

    // Re-initialize timetableData based on new time slots
    const newTimetableData = {};
    Object.keys(timetableData).forEach((day) => {
      newTimetableData[day] = {};
      newTimeSlots.forEach((slot) => {
        // Preserve existing data if slot exists, otherwise set to null
        newTimetableData[day][slot] = timetableData[day]?.[slot] || null;
      });
    });
    setTimetableData(newTimetableData);
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]; // Assuming a 6-day week for the timetable

  const getTimetableDocId = () => {
    if (!selectedBranch || !selectedSemester) return null;
    return `${normalizeString(selectedBranch)}_${normalizeString(
      selectedSemester
    ).replace(/\s/g, "")}`; // e.g., "cse_3rdsem"
  };

  // --- Load Timetable from Firestore or Props ---
  useEffect(() => {
    const loadTimetable = async () => {
      setLoading(true);
      try {
        let fetchedTimetableData = null;
        let fetchedTimeSlotsData = null;

        if (timetable) {
          // If timetable prop is provided, use it directly and skip Firestore fetch
          fetchedTimetableData = timetable.timetable || {};
          fetchedTimeSlotsData = timetable.timeSlots || [];
        } else {
          // Otherwise, fetch from Firestore
          const docId = getTimetableDocId();
          if (!docId) {
            // If in edit/admin mode and no branch/semester selected,
            // initialize an empty timetable structure for the current default time slots.
            if (mode === "edit" && access === "admin") {
              const initialTimetable = {};
              daysOfWeek.map(normalizeString).forEach((day) => {
                initialTimetable[day] = {};
                timeSlots.forEach((slot) => {
                  initialTimetable[day][slot] = null;
                });
              });
              setTimetableData(initialTimetable);
            }
            setLoading(false);
            return;
          }

          const docRef = doc(db, "timetables", docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fetchedData = docSnap.data();
            fetchedTimetableData = fetchedData.timetable || {};
            fetchedTimeSlotsData = fetchedData.timeSlots || [];
            alert("Timetable loaded successfully!");
          } else {
            console.log("No existing timetable found for this selection.");
            alert("No existing timetable found. Starting fresh.");
            // Initialize empty timetable if no doc found
            const initialTimetable = {};
            daysOfWeek.map(normalizeString).forEach((day) => {
              initialTimetable[day] = {};
              timeSlots.forEach((slot) => {
                initialTimetable[day][slot] = null;
              });
            });
            setTimetableData(initialTimetable);
            setLoading(false); // Ensure loading is off even if no doc exists
            return;
          }
        }

        // Update time slots if they were fetched (or provided by prop) and are different
        if (
          fetchedTimeSlotsData.length > 0 &&
          fetchedTimeSlotsData.join(",") !== timeSlots.join(",")
        ) {
          setCustomTimeInput(fetchedTimeSlotsData.join(", "));
          setTimeSlots(fetchedTimeSlotsData);
        }

        // Merge fetched data with current structure (to handle new time slots, etc.)
        const mergedTimetable = {};
        daysOfWeek.map(normalizeString).forEach((day) => {
          mergedTimetable[day] = {};
          // Use the *updated* timeSlots (either from prop, fetched, or initial default)
          const currentSlotsToUse =
            fetchedTimeSlotsData.length > 0 ? fetchedTimeSlotsData : timeSlots;
          currentSlotsToUse.forEach((slot) => {
            mergedTimetable[day][slot] =
              fetchedTimetableData[day]?.[slot] || null;
          });
        });
        setTimetableData(mergedTimetable);
      } catch (error) {
        console.error("Error loading timetable:", error);
        alert("Failed to load timetable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Trigger loading based on whether timetable prop is provided or if selection changes (in admin mode)
    if (timetable) {
      // If timetable prop is provided, we assume it's the source of truth,
      // and the useEffect that updates state based on `timetable` prop will handle it.
      // This block will ensure branch/sem are set if they are also props.
      if (branch && sem) {
        setSelectedBranch(branch);
        setSelectedSemester(sem);
      }
      // No need to call loadTimetable here as the other useEffect handles prop changes.
    } else if (selectedBranch && selectedSemester && timeSlots.length > 0) {
      // Only load from Firestore if selections are made and timeSlots are initialized
      loadTimetable();
    } else if (mode === "edit" && access === "admin" && timeSlots.length > 0) {
      // In admin mode, if branch/semester aren't selected yet but timeSlots are ready,
      // allow the initial empty timetable structure to be set up.
      loadTimetable();
    }
  }, [
    selectedBranch,
    selectedSemester,
    timeSlots,
    mode,
    access,
    timetable, // Added timetable here to ensure this effect reacts if `timetable` switches from null to a value (or vice-versa)
    branch, // Added branch
    sem, // Added sem
  ]);

  // --- Save Timetable to Firestore ---
  const handleSaveTimetable = async () => {
    // Only allow saving if mode is 'edit'
    if (mode === "view") {
      alert("You do not have permission to save the timetable in view mode.");
      return;
    }

    const docId = getTimetableDocId();
    if (!docId) {
      alert("Please select a Branch and Semester first.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(db, "timetables", docId),
        {
          branch: selectedBranch,
          semester: selectedSemester,
          timeSlots: timeSlots, // Store the configured time slots as well
          days: daysOfWeek.map(normalizeString), // Store the configured days (normalized)
          timetable: timetableData, // The core timetable data
        },
        {merge: true} // Use merge to avoid overwriting other fields if they exist
      );
      alert("Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to save timetable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Cell Editing Logic ---
  const handleCellClick = (day, time) => {
    // Disable cell click if in view mode
    if (mode === "view") {
      return;
    }

    const currentClass = timetableData[normalizeString(day)]?.[time];

    // If mode is 'edit' and access is 'teacher', only allow editing of their own classes
    if (mode === "edit" && access === "teacher") {
      if (!currentUserUid) {
        alert("Teacher UID not provided. Cannot edit classes.");
        return;
      }
      if (currentClass && currentClass.teacher?.uid !== currentUserUid) {
        alert("You can only edit your own classes.");
        return;
      }
    }

    setEditingCell({day, time});
    setCurrentSubject(currentClass?.subject || ""); // Stores subject string (e.g., "IT")
    setCurrentTeacher(currentClass?.teacher?.uid || ""); // Stores teacher UID
    setShowEditModal(true);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    const {day, time} = editingCell;
    const normalizedDay = normalizeString(day);

    const currentClass = timetableData[normalizedDay]?.[time];

    // Access control for saving a cell
    if (mode === "view") {
      alert("You do not have permission to save changes in view mode.");
      return;
    }
    if (mode === "edit" && access === "teacher") {
      if (!currentUserUid) {
        alert("Teacher UID not provided. Cannot save changes.");
        return;
      }
      // If there was a class, ensure it was assigned to this teacher
      // If there was no class, it's a new assignment, which is generally allowed for a teacher assigning themselves
      if (currentClass && currentClass.teacher?.uid !== currentUserUid) {
        alert("You can only save changes to your own classes.");
        return;
      }
      // If a teacher is trying to assign a class to another teacher, prevent it
      if (currentTeacher && currentTeacher !== currentUserUid) {
        alert("Teachers can only assign themselves to classes.");
        return;
      }
    }

    const subjectToSave = currentSubject;
    const teacherToSave = availableTeachers.find(
      (teacher) => teacher.uid === currentTeacher
    );

    setTimetableData((prevTimetable) => ({
      ...prevTimetable,
      [normalizedDay]: {
        ...prevTimetable[normalizedDay],
        [time]:
          subjectToSave && teacherToSave
            ? {
                subject: subjectToSave,
                teacher: {
                  uid: teacherToSave.uid,
                  firstName: teacherToSave.firstName,
                  lastName: teacherToSave.lastName,
                },
              }
            : null,
      },
    }));

    setShowEditModal(false);
    setEditingCell(null);
    setCurrentSubject("");
    setCurrentTeacher("");
  };

  const handleClearCell = () => {
    if (!editingCell) return;
    const {day, time} = editingCell;
    const normalizedDay = normalizeString(day);

    const currentClass = timetableData[normalizedDay]?.[time];

    // Access control for clearing a cell
    if (mode === "view") {
      alert("You do not have permission to clear cells in view mode.");
      return;
    }
    if (mode === "edit" && access === "teacher") {
      if (!currentUserUid) {
        alert("Teacher UID not provided. Cannot clear classes.");
        return;
      }
      if (currentClass && currentClass.teacher?.uid !== currentUserUid) {
        alert("You can only clear your own classes.");
        return;
      }
    }

    setTimetableData((prevTimetable) => ({
      ...prevTimetable,
      [normalizedDay]: {
        ...prevTimetable[normalizedDay],
        [time]: null,
      },
    }));
    setShowEditModal(false);
    setEditingCell(null);
    setCurrentSubject("");
    setCurrentTeacher("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  // Determine if inputs/buttons should be disabled
  const isDisabled = mode === "view";
  const isTeacherAccess = mode === "edit" && access === "teacher";
  const isAdminAccess = mode === "edit" && access === "admin";

  return (
    <div className="flex flex-col min-h-screen p-5">
      {/* Branch and Semester Selection - Hidden if timetable prop is provided or not admin */}
      {isAdminAccess && (
        <div className="mt-10 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-col flex-1 min-w-[200px]">
              <label
                htmlFor="branch-select"
                className="text-amber-300 font-semibold mb-2"
              >
                Select Branch:
              </label>
              <select
                id="branch-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
                disabled={isDisabled} // Disable based on mode
              >
                <option value="">Choose Branch</option>
                {BRANCHES.map((branchOpt) => (
                  <option key={branchOpt.value} value={branchOpt.value}>
                    {branchOpt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 min-w-[200px]">
              <label
                htmlFor="semester-select"
                className="text-amber-300 font-semibold mb-2"
              >
                Select Semester:
              </label>
              <select
                id="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
                disabled={isDisabled} // Disable based on mode
              >
                <option value="">Choose Semester</option>
                {availableSemesters.map((semOpt) => (
                  <option key={semOpt} value={semOpt}>
                    {semOpt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveTimetable}
                className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95 ${
                  isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#D03035] hover:bg-red-700"
                }`}
                disabled={isDisabled} // Disable for view mode
              >
                Save Timetable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display selected branch and semester if not admin or timetable prop is provided */}
      {(!isAdminAccess || timetable) &&
        (selectedBranch || selectedSemester) && (
          <div className="mt-10 w-[70%] mx-auto justify-between  flex items-center">
            <div className="text-center bg-[#1B1C21] basis-2/3 p-5 rounded-lg shadow-lg ">
              <p className="text-amber-300 text-xl font-semibold">
                Timetable for:{" "}
                {selectedBranch && capitalizeFirstLetter(selectedBranch)}{" "}
                {selectedSemester && ` - ${selectedSemester}`}
              </p>
            </div>
            <div>
              <button
                onClick={handleSaveTimetable}
                className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95 ${
                  isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#D03035] hover:bg-red-700"
                }`}
                disabled={isDisabled} // Disable for view mode
              >
                Save Timetable
              </button>
            </div>
          </div>
        )}

      {/* Save Timetable button for teachers (if branch/sem are pre-selected) */}
      {!isAdminAccess && !timetable && (
        <div className="mt-10 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg flex justify-end">
          <button
            onClick={handleSaveTimetable}
            className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95 ${
              isDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#D03035] hover:bg-red-700"
            }`}
            disabled={isDisabled} // Disable for view mode
          >
            Save Timetable
          </button>
        </div>
      )}

      {/* Time Slot Input - Only visible/editable for admin */}
      {isAdminAccess && (
        <div className="mt-2 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <label
            htmlFor="timeSlotsInput"
            className="block text-amber-300 text-xl font-semibold mb-2"
          >
            Enter Time Slots (comma-separated, e.g., 9:00 AM, 10:00 AM):
          </label>
          <input
            ref={timeInputRef}
            type="text"
            id="timeSlotsInput"
            className="w-full p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white placeholder-gray-500 outline-none focus:border-amber-300"
            placeholder="e.g., 9:00 AM, 10:00 AM, 11:00 AM"
            value={customTimeInput}
            onChange={handleTimeInputChange}
            disabled={isDisabled || isTeacherAccess} // Only admin can change time slots
          />
        </div>
      )}

      {/* Timetable Table */}
      <div className="mt-2 flex-grow w-[80%] mx-auto h-fit  bg-[#1B1C21] p-5 rounded-lg shadow-lg overflow-x-auto">
        {timeSlots.length > 0 && daysOfWeek.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-700 border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider bg-gray-900 border-b border-slate-700">
                  Time / Day
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-center text-xs font-medium text-amber-300 uppercase tracking-wider whitespace-nowrap bg-gray-900 border-b border-slate-700 border-l border-slate-800"
                  >
                    {day.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {timeSlots.map((time, timeIndex) => (
                <tr key={timeIndex} className="hover:bg-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-amber-300 bg-gray-900 border-r border-slate-700">
                    {time}
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    const normalizedDay = normalizeString(day);
                    const classData =
                      timetableData[normalizedDay]?.[time] || null;
                    const cellContent = classData
                      ? `${classData.subject.toUpperCase() || "N/A"} (${
                          classData.teacher?.firstName || "N/A"
                        } ${classData.teacher?.lastName || ""})` // Display full teacher name
                      : "-";

                    // Determine if the cell is clickable based on mode and access
                    const isCellClickable =
                      isAdminAccess ||
                      (isTeacherAccess &&
                        (classData === null || // Teachers can click empty slots to assign themselves
                          classData?.teacher?.uid === currentUserUid)); // Or click their own assigned slots

                    return (
                      <td
                        key={`${timeIndex}-${dayIndex}`}
                        className={`px-4 py-4 text-sm text-gray-300 text-center border-l border-r border-slate-800 transition-colors duration-150 ease-in-out ${
                          isCellClickable
                            ? "cursor-pointer hover:bg-gray-700"
                            : "cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (isCellClickable) {
                            handleCellClick(day, time);
                          } else if (
                            isTeacherAccess &&
                            classData &&
                            classData.teacher?.uid !== currentUserUid
                          ) {
                            alert("You can only modify your own classes.");
                          } else if (isDisabled) {
                            // Do nothing if disabled (view mode)
                          }
                        }}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isAdminAccess
              ? "Please configure time slots to view the timetable."
              : "No timetable data available for display."}
          </div>
        )}
      </div>

      {/* Edit Cell Modal/Popover */}
      {showEditModal && editingCell && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-[#1B1C21] p-6 rounded-lg shadow-xl border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              Edit Slot: {editingCell.day.toUpperCase()} at {editingCell.time}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="subject-select-modal"
                className="block text-gray-300 text-sm font-bold mb-2"
              >
                Subject:
              </label>
              <select
                id="subject-select-modal"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-slate-600 rounded text-white"
                disabled={
                  isDisabled ||
                  (isTeacherAccess &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ]?.teacher?.uid !== currentUserUid &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ] !== null)
                }
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="teacher-select-modal"
                className="block text-gray-300 text-sm font-bold mb-2"
              >
                Teacher:
              </label>
              <select
                id="teacher-select-modal"
                value={currentTeacher}
                onChange={(e) => setCurrentTeacher(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-slate-600 rounded text-white"
                // Teachers can only select themselves
                disabled={
                  isDisabled ||
                  (isTeacherAccess &&
                    currentTeacher !== currentUserUid &&
                    currentTeacher !== "")
                }
              >
                <option value="">Select Teacher</option>
                {availableTeachers
                  .filter(
                    (teacher) =>
                      isAdminAccess ||
                      (isTeacherAccess && teacher.uid === currentUserUid) ||
                      teacher.uid === currentTeacher
                  ) // Teachers only see their own name to select
                  .map((teacher) => (
                    <option key={teacher.uid} value={teacher.uid}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClearCell}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isDisabled ||
                  (isTeacherAccess &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ]?.teacher?.uid !== currentUserUid)
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
                disabled={
                  isDisabled ||
                  (isTeacherAccess &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ]?.teacher?.uid !== currentUserUid)
                }
              >
                Clear
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCell}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                  isDisabled ||
                  (isTeacherAccess &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ]?.teacher?.uid !== currentUserUid &&
                    currentTeacher !== currentUserUid &&
                    currentTeacher !== "")
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-amber-300 text-gray-900 hover:bg-amber-400"
                }`}
                disabled={
                  isDisabled ||
                  (isTeacherAccess &&
                    timetableData[normalizeString(editingCell.day)]?.[
                      editingCell.time
                    ]?.teacher?.uid !== currentUserUid &&
                    currentTeacher !== currentUserUid &&
                    currentTeacher !== "")
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableSetter;
