// AttendanceManager.jsx
"use client"; // This directive is often used in Next.js for client-side components

import React, {useState, useEffect} from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "@firebase/firestore";
import {db} from "../../firebaseConfig"; // Ensure this path is correct
import BRANCHES from "../../branch.json"; // Assuming you have a JSON file for branches
import {TransparentLoadingComponent} from "@/components/loadingScreen"; // Loading spinner
import {fetchSubjects} from "../../utils/fetchUserFunctions"; // Re-using existing function
import {fetchStudentsByQuery} from "../../utils/fetchUserFunctions"; // Assuming this function exists or provide it below
import SLOTS from "../../SLOTS.json";
// --- Utility Functions ---
const normalizeString = (str) => {
  if (!str) return "";
  return String(str).trim().toLowerCase();
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper to format date for Firestore document ID (YYYY-MM-DD)
const formatDateForDocId = (dateObj) => {
  if (!dateObj) return null;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function AttendanceManager({
  currentUserUid = null, // UID of the currently logged-in user (teacher/admin)
  access = "teacher", // "teacher" or "admin" (determines permissions)
}) {
  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    formatDateForDocId(new Date())
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([
    "1st Sem",
    "2nd Sem",
    "3rd Sem",
    "4th Sem",
    "5th Sem",
    "6th Sem",
  ]);

  const [students, setStudents] = useState([]); // List of students for selected branch/semester
  // Attendance records for the current selection: { studentUid: { status: 'P', markedBy: 'uid', markedAt: timestamp } }
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const [timeSlotsFromTimetable, setTimeSlotsFromTimetable] = useState([]); // Timeslots for selected branch/sem

  // --- Fetch initial data (subjects, teachers) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subjects = await fetchSubjects();
        setAvailableSubjects(subjects);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert("Failed to load initial data (subjects).");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- Fetch students and timetable time slots based on branch/semester selection ---
  useEffect(() => {
    const fetchClassData = async () => {
      if (selectedBranch && selectedSemester) {
        setLoading(true);
        try {
          // Fetch students
          const fetchedStudents = await fetchStudentsByQuery(
            selectedBranch,
            selectedSemester
          );
          setStudents(fetchedStudents);

          // Fetch time slots from the timetable document
          const timetableDocId = `${normalizeString(
            selectedBranch
          )}_${normalizeString(selectedSemester).replace(/\s/g, "")}`;
          const timetableRef = doc(db, "timetables", timetableDocId);
          const timetableSnap = await getDoc(timetableRef);

          if (timetableSnap.exists()) {
            const data = timetableSnap.data();
            setTimeSlotsFromTimetable(data.timeSlots || []);
          } else {
            setTimeSlotsFromTimetable([]);
            console.log(
              "No timetable found for this branch/semester. Cannot determine time slots."
            );
          }

          // Reset attendance records and subject/time if selections change
          setAttendanceRecords({});
          setSelectedSubject("");
          setSelectedTimeSlot("");
        } catch (error) {
          console.error("Error fetching class data:", error);
          alert("Failed to load students or timetable data.");
          setStudents([]);
          setTimeSlotsFromTimetable([]);
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setTimeSlotsFromTimetable([]);
      }
    };

    fetchClassData();
  }, [selectedBranch, selectedSemester]);

  // --- Fetch existing attendance records when all parameters are selected ---
  useEffect(() => {
    const loadAttendance = async () => {
      if (
        selectedBranch &&
        selectedSemester &&
        selectedDate &&
        selectedSubject &&
        selectedTimeSlot
      ) {
        setLoading(true);
        try {
          // Construct the document ID for attendance for this specific class and date
          const attendanceDocId = `${normalizeString(
            selectedBranch
          )}_${normalizeString(selectedSemester).replace(
            /\s/g,
            ""
          )}_${selectedDate}_${normalizeString(
            selectedSubject
          )}_${normalizeString(selectedTimeSlot).replace(/[^a-zA-Z0-9]/g, "")}`;

          const attendanceRef = doc(db, "classAttendance", attendanceDocId);
          const attendanceSnap = await getDoc(attendanceRef);

          if (attendanceSnap.exists()) {
            const data = attendanceSnap.data();
            // Convert array of attendance records back to a map for easy lookup
            const recordsMap = data.attendanceRecords.reduce((acc, record) => {
              acc[record.studentUid] = {
                // status: record.status,
                markedBy: record.markedByUid,
                markedAt: record.markedAt.toDate(),
              }; // Convert timestamp to Date object
              return acc;
            }, {});
            setAttendanceRecords(recordsMap);
            // alert("Existing attendance loaded.");
          } else {
            setAttendanceRecords({}); // No existing records, start fresh
            // alert(
            //   "No existing attendance found for this selection. Starting fresh."
            // );
          }
        } catch (error) {
          console.error("Error loading attendance:", error);
          alert("Failed to load existing attendance.");
          setAttendanceRecords({});
        } finally {
          setLoading(false);
        }
      } else {
        setAttendanceRecords({}); // Clear records if selections are incomplete
      }
    };

    loadAttendance();
  }, [
    selectedBranch,
    selectedSemester,
    selectedDate,
    selectedSubject,
    selectedTimeSlot,
  ]); // Re-load when any of these change

  // --- Handlers for selection changes ---
  const handleBranchChange = (e) => setSelectedBranch(e.target.value);
  const handleSemesterChange = (e) => setSelectedSemester(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);
  const handleTimeSlotChange = (e) => setSelectedTimeSlot(e.target.value);

  const handleAttendanceChange = (studentUid, status) => {
    if (access !== "admin" && access !== "teacher") {
      alert("You do not have permission to mark attendance.");
      return;
    }
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentUid]: {
        status,
        markedByUid: currentUserUid,
        markedAt: Timestamp.now(), // Use Firestore Timestamp for consistency
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (access !== "admin" && access !== "teacher") {
      alert("You do not have permission to save attendance.");
      return;
    }
    if (
      !selectedBranch ||
      !selectedSemester ||
      !selectedDate ||
      !selectedSubject ||
      !selectedTimeSlot
    ) {
      alert(
        "Please select Branch, Semester, Date, Subject, and Time Slot before saving."
      );
      return;
    }

    setLoading(true);
    try {
      const attendanceDocId = `${normalizeString(
        selectedBranch
      )}_${normalizeString(selectedSemester).replace(
        /\s/g,
        ""
      )}_${selectedDate}_${normalizeString(selectedSubject)}_${normalizeString(
        selectedTimeSlot
      ).replace(/[^a-zA-Z0-9]/g, "")}`;

      // Convert attendanceRecords map to an array for Firestore saving
      const recordsArray = students.map((student) => {
        const record = attendanceRecords[student.uid];
        // Ensure all students have a record, default to Absent if not marked
        return {
          studentUid: student.uid,
          studentFirstName: student.firstName || "N/A",
          studentLastName: student.lastName || "N/A",
          status: record?.status.toLowerCase() || "absent", // Default to Absent if no status marked
          markedByUid: record?.markedByUid || currentUserUid, // Use current user if not explicitly marked
          markedAt: record?.markedAt || Timestamp.now(),
          subject: selectedSubject, // Redundant but useful for simpler queries later if needed
          timeSlot: selectedTimeSlot,
          date: selectedDate,
        };
      });

      await setDoc(
        doc(db, "classAttendance", attendanceDocId),
        {
          branch: selectedBranch,
          semester: selectedSemester,
          date: selectedDate, // Storing as string, could also use Timestamp if you convert the Date obj
          dateTimestamp: Timestamp.fromDate(new Date(selectedDate)), // Convert to Timestamp
          subject: selectedSubject,
          timeSlot: selectedTimeSlot,
          attendanceRecords: recordsArray,
          lastUpdated: Timestamp.now(),
          updatedBy: currentUserUid,
        },
        {merge: true} // Merge to avoid overwriting unrelated fields if they exist
      );
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isMarkingAllowed = access === "admin" || access === "teacher";
  const isSelectionComplete =
    selectedBranch &&
    selectedSemester &&
    selectedDate &&
    selectedSubject &&
    selectedTimeSlot;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-5 bg-gray-900 text-white">
      <div className="mt-10 w-[80%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          Manage Class Attendance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Branch Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="branch-select"
              className="text-amber-300 font-semibold mb-2"
            >
              Select Branch:
            </label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={handleBranchChange}
              className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
              disabled={!isMarkingAllowed}
            >
              <option value="">Choose Branch</option>
              {BRANCHES.map((branchOpt) => (
                <option key={branchOpt.value} value={branchOpt.value}>
                  {branchOpt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="semester-select"
              className="text-amber-300 font-semibold mb-2"
            >
              Select Semester:
            </label>
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
              disabled={!isMarkingAllowed}
            >
              <option value="">Choose Semester</option>
              {availableSemesters.map((semOpt) => (
                <option key={semOpt} value={semOpt}>
                  {semOpt}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="date-select"
              className="text-amber-300 font-semibold mb-2"
            >
              Select Date:
            </label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={handleDateChange}
              className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
              disabled={!isMarkingAllowed}
            />
          </div>

          {/* Subject Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="subject-select"
              className="text-amber-300 font-semibold mb-2"
            >
              Select Subject:
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
              disabled={!isMarkingAllowed}
            >
              <option value="">Choose Subject</option>
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="time-slot-select"
              className="text-amber-300 font-semibold mb-2"
            >
              Select Time Slot:
            </label>
            <select
              id="time-slot-select"
              value={selectedTimeSlot}
              onChange={handleTimeSlotChange}
              className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
              disabled={!isMarkingAllowed}
            >
              <option value="">Choose Time Slot</option>
              {timeSlotsFromTimetable.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isSelectionComplete && students.length > 0 ? (
        <div className="mt-5 w-[80%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-amber-300 mb-4">
            Mark Attendance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700 border border-slate-700 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider bg-gray-900 border-b border-slate-700">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-amber-300 uppercase tracking-wider bg-gray-900 border-b border-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {students.map((student) => (
                  <tr key={student.uid} className="hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {capitalizeFirstLetter(student.firstName)}{" "}
                      {capitalizeFirstLetter(student.lastName)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {["Present", "Absent", "Late"].map((statusOption) => (
                          <button
                            key={statusOption}
                            onClick={() =>
                              handleAttendanceChange(student.uid, statusOption)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ease-in-out
                              ${
                                attendanceRecords[student.uid]?.status ===
                                statusOption
                                  ? statusOption === "Present"
                                    ? "bg-green-600 text-white"
                                    : statusOption === "Absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-yellow-500 text-black"
                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }
                              ${
                                !isMarkingAllowed
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                            `}
                            disabled={!isMarkingAllowed}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={handleSaveAttendance}
              className={`px-6 py-3 text-white cursor-pointer font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out active:scale-95 ${
                !isMarkingAllowed || !isSelectionComplete
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={!isMarkingAllowed || !isSelectionComplete}
            >
              Save Attendance
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 w-[80%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg text-center text-gray-400">
          {selectedBranch && selectedSemester
            ? "Select Date, Subject, and Time Slot to mark attendance."
            : "Please select a Branch and Semester first."}
        </div>
      )}
    </div>
  );
}

export default AttendanceManager;
