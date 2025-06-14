// AttendanceCalendarView.jsx
"use client";

import React, {useState, useEffect} from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "@firebase/firestore";
import {db} from "../../firebaseConfig"; // Ensure this path is correct
import BRANCHES from "../../branch.json"; // Assuming you have a JSON file for branches
import {TransparentLoadingComponent} from "@/components/loadingScreen";
import {fetchSubjects} from "../../utils/fetchUserFunctions"; // Re-using existing function
import {addDesignationToSem} from "../../utils/otherFunctions";

// --- Utility Functions (from previous components) ---
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

function AttendanceCalendarView({access = "admin", user}) {
  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date()); // Used for current month/year view
  const [attendanceSummary, setAttendanceSummary] = useState({}); // { 'YYYY-MM-DD': { P: count, A: count, L: count, classes: [{subject, timeSlot, count, students: []}] } }

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null); // Detailed attendance for a specific day
  const [studentAttendancePercentage, setStudentAttendancePercentage] =
    useState(0); // Percentage for student view
  const [availableSubjects, setAvailableSubjects] = useState([]); // Currently not used directly for filtering in this view, but good to have
  const [availableSemesters] = useState([
    "1st Sem",
    "2nd Sem",
    "3rd Sem",
    "4th Sem",
    "5th Sem",
    "6th Sem",
  ]);

  const canView =
    access === "admin" || access === "teacher" || access === "student";

  // --- Calendar Navigation Handlers ---
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      return newDate;
    });
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate((prevDate) => new Date(newYear, prevDate.getMonth(), 1));
  };

  // --- Fetch Initial Data (Subjects) ---
  useEffect(() => {
    const fetchInitialStaticData = async () => {
      try {
        const subjects = await fetchSubjects();
        setAvailableSubjects(subjects); // Store for potential future use or display
      } catch (error) {
        console.error("Error fetching initial static data:", error);
      }
    };
    fetchInitialStaticData();
  }, []);

  // --- Fetch Attendance Data for the Selected Month ---
  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      if (access === "student") {
        if (user) {
          setSelectedBranch(user.branch);
          const sem =
            user.semester.toString() +
            addDesignationToSem(user.semester.toString()).inShort +
            " Sem";
          setSelectedSemester(sem);

          console.log(
            "Student access detected. Branch:",
            user.branch,
            "Semester:",
            sem
          );
        } else {
          throw new Error("User data not available for student access.");
        }
      }

      if (!selectedBranch || !selectedSemester || !canView) {
        setAttendanceSummary({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed

        // Construct query to get all attendance records for the selected branch and semester
        const attendanceCollectionRef = collection(db, "classAttendance");
        const q = query(
          attendanceCollectionRef,
          where("branch", "==", selectedBranch),
          where("semester", "==", selectedSemester)
        );

        const querySnapshot = await getDocs(q);
        const monthlySummary = {};
        const rawAttendanceData = {}; // Store raw data by date for details modal

        querySnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const recordDateStr = data.date; // e.g., "YYYY-MM-DD"

          // Only process records for the currently selected month and year
          if (recordDateStr) {
            const [year, month, day] = recordDateStr.split("-").map(Number);
            if (year === currentYear && month - 1 === currentMonth) {
              // month-1 because getMonth() is 0-indexed
              if (!monthlySummary[recordDateStr]) {
                monthlySummary[recordDateStr] = {P: 0, A: 0, L: 0, classes: []};
              }
              if (!rawAttendanceData[recordDateStr]) {
                rawAttendanceData[recordDateStr] = [];
              }

              // Aggregate counts for the summary - FIXED: Convert status to lowercase for comparison
              data.attendanceRecords.forEach((record) => {
                const statusLower = record.status.toLowerCase(); // Convert to lowercase
                if (statusLower === "present")
                  monthlySummary[recordDateStr].P++;
                else if (statusLower === "absent")
                  monthlySummary[recordDateStr].A++;
                else if (statusLower === "late")
                  monthlySummary[recordDateStr].L++;
              });

              // Store class-level summary for the modal
              // This is a simplified aggregation, you might want more complex grouping by subject/time slot
              monthlySummary[recordDateStr].classes.push({
                subject: data.subject,
                timeSlot: data.timeSlot,
                records: data.attendanceRecords, // Keep full records for modal
              });
            }
          }
        });
        setAttendanceSummary(monthlySummary);
      } catch (error) {
        console.error("Error fetching monthly attendance:", error);
        alert("Failed to load attendance data.");
        setAttendanceSummary({});
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAttendance();
  }, [selectedBranch, selectedSemester, currentDate, canView]); // Re-fetch when branch, semester, or month/year changes

  // --- Calculate Student Attendance Percentage ---
  useEffect(() => {
    if (
      access === "student" &&
      user?.uid &&
      Object.keys(attendanceSummary).length > 0
    ) {
      let totalPresentForStudent = 0;
      let totalLateForStudent = 0;
      let totalPossibleClasses = 0;

      Object.values(attendanceSummary).forEach((daySummary) => {
        daySummary.classes.forEach((classData) => {
          classData.records.forEach((record) => {
            if (record.studentUid === user.uid) {
              totalPossibleClasses++;
              const statusLower = record.status.toLowerCase();
              if (statusLower === "present") {
                totalPresentForStudent++;
              } else if (statusLower === "late") {
                totalLateForStudent++;
              }
            }
          });
        });
      });

      const effectivePresent = totalPresentForStudent + totalLateForStudent;
      if (totalPossibleClasses > 0) {
        const percentage = (effectivePresent / totalPossibleClasses) * 100;
        setStudentAttendancePercentage(percentage.toFixed(2)); // Format to 2 decimal places
      } else {
        setStudentAttendancePercentage(0); // No classes attended or recorded
      }
    } else if (access !== "student") {
      setStudentAttendancePercentage(0); // Reset for non-student users
    }
  }, [attendanceSummary, user, access]);

  // --- Calendar Grid Generation ---
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of current month

    const startDayIndex = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday
    const numDaysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // Add leading empty cells for calendar alignment
    // getDay() returns 0 for Sunday, 1 for Monday... We want Monday to be the first column (index 0)
    // So, if firstDayOfMonth is Sunday (0), we need 6 empty cells (Sunday is last column)
    // If firstDayOfMonth is Monday (1), we need 0 empty cells
    // If firstDayOfMonth is Tuesday (2), we need 1 empty cell
    const offset = startDayIndex === 0 ? 6 : startDayIndex - 1; // Adjust for Sunday being 0 but often desired as last day
    for (let i = 0; i < offset; i++) {
      calendarDays.push(
        <div
          key={`empty-prev-${i}`}
          className="p-2 border border-slate-700 aspect-square flex items-center justify-center bg-gray-800 text-gray-600"
        ></div>
      );
    }

    // Add actual days of the month
    for (let day = 1; day <= numDaysInMonth; day++) {
      const dateStr = formatDateForDocId(new Date(year, month, day));
      const daySummary = attendanceSummary[dateStr];
      const hasData = !!daySummary; // Check if attendance data exists for this day

      calendarDays.push(
        <div
          key={dateStr}
          className={`p-2 border border-slate-700 aspect-square flex flex-col items-center justify-center transition-colors duration-150 ease-in-out
            ${
              hasData
                ? "bg-indigo-900 hover:bg-indigo-800 cursor-pointer"
                : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
            }
            ${
              formatDateForDocId(new Date()) === dateStr
                ? "ring-2 ring-amber-400"
                : ""
            }
          `}
          onClick={() => {
            // Only show details if there's data and allowed to view
            if (hasData && canView) {
              setSelectedDayDetails({date: dateStr, summary: daySummary});
              setShowDetailsModal(true);
            } else if (canView) {
              alert(`No attendance records for ${dateStr}.`);
            } else {
              alert("You do not have permission to view attendance details.");
            }
          }}
        >
          <span className="font-bold text-lg">{day}</span>
          {hasData && (
            <div className="text-xs mt-1 text-center">
              <span className="text-green-400">P: {daySummary.P}</span>{" "}
              <span className="text-red-400">A: {daySummary.A}</span>{" "}
              <span className="text-yellow-400">L: {daySummary.L}</span>
            </div>
          )}
        </div>
      );
    }

    // Add trailing empty cells for calendar alignment
    const totalCells = offset + numDaysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days = 42 cells
    for (let i = 0; i < remainingCells; i++) {
      calendarDays.push(
        <div
          key={`empty-next-${i}`}
          className="p-2 border border-slate-700 aspect-square flex items-center justify-center bg-gray-800 text-gray-600"
        ></div>
      );
    }

    return calendarDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TransparentLoadingComponent />
      </div>
    );
  }

  // Generate year options for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({length: 10}, (_, i) => currentYear - 5 + i); // 5 years before, current, 4 years after

  return (
    <div className="flex flex-col min-h-screen p-5 bg-gray-900 text-white">
      <div className="mt-10 w-[90%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          View Attendance Calendar
        </h2>
        {access === "student" && (
          <h2 className="text-xl font-bold text-violet-300 mb-4">
            Your Attendance Percentage : {studentAttendancePercentage}%
          </h2>
        )}

        {/* Branch and Semester Selection */}
        {access !== "student" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
                disabled={!canView}
              >
                <option value="">Choose Branch</option>
                {BRANCHES.map((branchOpt) => (
                  <option key={branchOpt.value} value={branchOpt.value}>
                    {branchOpt.label}
                  </option>
                ))}
              </select>
            </div>

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
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="p-3 bg-gray-900 border-2 border-slate-700 rounded-lg text-white outline-none focus:border-amber-300"
                disabled={!canView}
              >
                <option value="">Choose Semester</option>
                {availableSemesters.map((semOpt) => (
                  <option key={semOpt} value={semOpt}>
                    {semOpt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!canView}
          >
            &lt; Prev Month
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="p-2 bg-gray-900 border border-slate-700 rounded-lg text-white"
              disabled={!canView}
            >
              {Array.from({length: 12}, (_, i) =>
                new Date(0, i).toLocaleString("default", {month: "long"})
              ).map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="p-2 bg-gray-900 border border-slate-700 rounded-lg text-white"
              disabled={!canView}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!canView}
          >
            Next Month &gt;
          </button>
        </div>
      </div>

      {selectedBranch && selectedSemester && canView ? (
        <div className="mt-5 w-[90%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
          <div className="grid grid-cols-7 text-center font-bold text-amber-300 mb-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        </div>
      ) : (
        <div className="mt-5 w-[90%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg text-center text-gray-400">
          {!canView
            ? "You do not have permission to view attendance."
            : "Please select a Branch and Semester to view attendance."}
        </div>
      )}

      {/* Attendance Details Modal */}
      {showDetailsModal && selectedDayDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B1C21] p-6 rounded-lg shadow-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              Attendance for {selectedDayDetails.date}
            </h2>
            <div className="mb-4">
              <p className="text-gray-300">Overall Summary:</p>
              <div className="flex space-x-4 text-lg font-semibold mt-2">
                <span className="text-green-400">
                  Present: {selectedDayDetails.summary.P}
                </span>
                <span className="text-red-400">
                  Absent: {selectedDayDetails.summary.A}
                </span>
                <span className="text-yellow-400">
                  Late: {selectedDayDetails.summary.L}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-amber-300 mb-2">
                Classes:
              </h3>
              {selectedDayDetails.summary.classes &&
              selectedDayDetails.summary.classes.length > 0 ? (
                selectedDayDetails.summary.classes.map((classData, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg mb-3 last:mb-0 max-h-96 overflow-y-auto"
                  >
                    <p className="font-semibold text-lg text-blue-300">
                      {classData.subject.toUpperCase()} - {classData.timeSlot}
                    </p>
                    <div className="mt-2 text-sm text-gray-300 gap-5 grid grid-cols-1 sm:grid-cols-2">
                      {classData.records.map((record, recIndex) => (
                        <div
                          key={recIndex}
                          className="flex justify-between items-center border-b border-gray-700 pb-1 "
                        >
                          <span>
                            {capitalizeFirstLetter(record.studentFirstName)}{" "}
                            {capitalizeFirstLetter(record.studentLastName)}
                          </span>
                          <span
                            className={
                              record.status === "Present"
                                ? "text-green-400"
                                : record.status === "Absent"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }
                          >
                            {record.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No class details available for this day.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceCalendarView;
