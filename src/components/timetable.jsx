import React from "react";

function TimetableDisplay({user, semesterType}) {
  // Define time slots for the left column (you can customize these)

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timeSlots = [
    "10:30 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "4:00 PM",
    "4:00 PM",
    "4:00 PM",
    "4:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Branch and Semester Info */}
      <div className=" basis-1/3 w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg">
        <div className="flex justify-between gap-2">
          <div className="text-xl flex font-medium gap-2 font-ubuntu text-amber-300">
            <div>Timetable For Branch</div>
            <div>:</div>
            <div className="text-white font-normal">{user?.branch}</div>
          </div>
          <div className="text-xl flex font-medium gap-2 font-ubuntu text-amber-300">
            <div>Current Semester</div>
            <div>:</div>
            <div className="text-white font-normal">
              {semesterType.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Table with Inverted Headers */}
      <div className="mt-2 basis-2/3 flex-grow w-[70%] mx-auto bg-[#1B1C21] p-5 rounded-lg shadow-lg overflow-x-auto overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                Time / Day
              </th>
              {days.map(
                (
                  day,
                  index // Days are now the column headers
                ) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-center text-xs font-medium text-amber-300 uppercase tracking-wider whitespace-nowrap"
                  >
                    {day.toUpperCase()}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {timeSlots.map(
              (
                time,
                timeIndex // Time slots are now row headers
              ) => (
                <tr key={timeIndex} className="hover:bg-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-amber-300">
                    {time}
                  </td>
                  {days.map((day, dayIndex) => (
                    <td
                      key={`${timeIndex}-${dayIndex}`}
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 text-center border-l border-r border-slate-800"
                    >
                      {/* Placeholder for class/subject data. You'll populate this from your timetable data. */}
                      {/* Example: {timetableData[time][day] || '-'} */}-
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
        {/* Placeholder for actual timetable data */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          (Timetable data to be populated dynamically)
        </div>
      </div>
    </div>
  );
}

export default TimetableDisplay;
