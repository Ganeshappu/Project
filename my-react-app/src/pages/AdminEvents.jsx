import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import { 
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit3, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";

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
  const [registrations, setRegistrations] = useState({});
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Fetch events from Firebase
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribeEvents = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationCount: doc.data().registrationCount || 0
      }));
      setEvents(eventsData);
    });
    
    return () => unsubscribeEvents();
  }, []);

  // Fetch registrations for all events
  useEffect(() => {
    const unsubscribeRegistrations = onSnapshot(
      collection(db, "registrations"), 
      (snapshot) => {
        const regData = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          if (!regData[data.eventId]) {
            regData[data.eventId] = [];
          }
          regData[data.eventId].push({
            id: doc.id,
            ...data
          });
        });
        setRegistrations(regData);
      }
    );
    
    return () => unsubscribeRegistrations();
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

  const getStatusColor = (registrationCount) => {
    if (registrationCount === 0) return 'text-gray-500';
    if (registrationCount < 10) return 'text-yellow-600';
    if (registrationCount < 20) return 'text-blue-600';
    return 'text-green-600';
  };

  const getStatusIcon = (registrationCount) => {
    if (registrationCount === 0) return <AlertCircle className="w-4 h-4" />;
    if (registrationCount < 10) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const toggleEventExpand = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? All associated registrations will also be deleted.")) {
      return;
    }

    setDeleting(true);
    try {
      // First delete all registrations for this event
      const registrationsQuery = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      const deletePromises = registrationsSnapshot.docs.map(async (regDoc) => {
        await deleteDoc(doc(db, "registrations", regDoc.id));
      });

      await Promise.all(deletePromises);
      
      // Then delete the event itself
      await deleteDoc(doc(db, "events", eventId));
      
      setMessage("Event and all associated registrations deleted successfully!");
    } catch (error) {
      setMessage("Error deleting event");
      console.error("Error deleting event:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Events Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage and monitor your events</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {events.reduce((sum, event) => sum + event.registrationCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Registrations</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Creation Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Edit3 className="w-4 h-4" />
                  <span>Event Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Event Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

          

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>Time</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>Venue</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Event venue"
                />
              </div>
              
              
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
              
              {message && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>{message}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Event</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Venue</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Registrations</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map(event => (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{event.venue}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-2 ${getStatusColor(event.registrationCount)}`}>
                          {getStatusIcon(event.registrationCount)}
                          <span className="font-bold text-lg">{event.registrationCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => toggleEventExpand(event.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            <span>View</span>
                            {expandedEvent === event.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={deleting}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {deleting ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {expandedEvent === event.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold text-lg mb-4">Registered Students ({registrations[event.id]?.length || 0})</h3>
                            
                            {registrations[event.id] ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration Date
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations[event.id].map((reg, index) => (
                                      <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="text-sm font-medium text-gray-900">
                                            {reg.studentName}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="text-sm text-gray-500">
                                            {reg.studentEmail}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="text-sm text-gray-500">
                                            {reg.registeredAt?.toDate().toLocaleString()}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            reg.registrationStatus === 'confirmed' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {reg.registrationStatus}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                No registrations for this event yet.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            
            {events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No events created yet. Create your first event above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;