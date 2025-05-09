import React, { useState } from "react";

const Schedule = () => {
  const [schedule, setSchedule] = useState({ day: "", time: "", workshopName: "" });
  const [scheduleList, setScheduleList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddSchedule = () => {
    if (schedule.day && schedule.time && schedule.workshopName) {
      if (editIndex !== null) {
        const updatedList = scheduleList.map((sched, index) =>
          index === editIndex ? schedule : sched
        );
        setScheduleList(updatedList);
        setEditIndex(null);
      } else {
        setScheduleList([...scheduleList, schedule]);
      }
      setSchedule({ day: "", time: "", workshopName: "" });
    }
  };

  const handleDeleteSchedule = (index) => {
    const updatedList = scheduleList.filter((_, i) => i !== index);
    setScheduleList(updatedList);
  };

  const handleEditSchedule = (index) => {
    setSchedule(scheduleList[index]);
    setEditIndex(index);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Workshops Schedule</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <input
          type="text"
          value={schedule.day}
          onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
          placeholder="Day"
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
        <input
          type="text"
          value={schedule.time}
          onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
          placeholder="Time"
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
        <input
          type="text"
          value={schedule.workshopName}
          onChange={(e) => setSchedule({ ...schedule, workshopName: e.target.value })}
          placeholder="Workshop Name"
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
      </div>

      <button
        onClick={handleAddSchedule}
        className="w-full md:w-auto py-3 px-6 bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
      >
        {editIndex !== null ? "Update Schedule" : "Add Workshop Schedule"}
      </button>

      <ul className="mt-8 space-y-4">
        {scheduleList.map((sched, index) => (
          <li
            key={index}
            className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-center"
          >
            <div className="text-gray-700">
              <strong className="text-indigo-600">{sched.day}</strong> - {sched.time} - {sched.workshopName}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEditSchedule(index)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSchedule(index)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
