import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import { 
  collection,
  addDoc,
  onSnapshot, 
  query, 
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

const AdminEvents = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationDeadline: "",
    published: true,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch events
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationCount: doc.data().registrationCount || 0
      }));
      setEvents(eventsData);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        createdAt: Timestamp.now(),
        registrationCount: 0
      });
      setMessage("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        registrationDeadline: "",
        published: true,
      });
    } catch (error) {
      setMessage("Error creating event");
      console.error(error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Events Dashboard</h1>
      
      {/* Event Creation Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Registration Deadline</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
          {message && <p className="text-green-600">{message}</p>}
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Event</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Venue</th>
                <th className="p-2 border text-left">Registrations</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{event.title}</td>
                  <td className="p-2 border">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{event.venue}</td>
                  <td className="p-2 border font-bold">{event.registrationCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;