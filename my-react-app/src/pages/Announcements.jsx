import React, { useState } from "react";

const Announcements = () => {
  const [announcement, setAnnouncement] = useState("");
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleCreateAnnouncement = () => {
    if (announcement) {
      if (editIndex !== null) {
        const updatedList = announcementsList.map((ann, index) =>
          index === editIndex ? announcement : ann
        );
        setAnnouncementsList(updatedList);
        setEditIndex(null);
      } else {
        setAnnouncementsList([...announcementsList, announcement]);
      }
      setAnnouncement("");
    }
  };

  const handleDeleteAnnouncement = (index) => {
    const updatedList = announcementsList.filter((_, i) => i !== index);
    setAnnouncementsList(updatedList);
  };

  const handleEditAnnouncement = (index) => {
    setAnnouncement(announcementsList[index]);
    setEditIndex(index);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Announcements</h2>

      <div className="mb-6">
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write a new announcement"
          rows="4"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
      </div>

      <button
        onClick={handleCreateAnnouncement}
        className="w-full md:w-auto py-3 px-6 bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
      >
        {editIndex !== null ? "Update Announcement" : "Create Announcement"}
      </button>

      <ul className="mt-8 space-y-4">
        {announcementsList.map((ann, index) => (
          <li
            key={index}
            className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-center"
          >
            <div className="text-gray-700">{ann}</div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEditAnnouncement(index)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAnnouncement(index)}
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

export default Announcements;
