import { useState, useRef, useEffect } from 'react';
import { Megaphone, CheckCircle,CalendarDays, UserPlus,BadgeCheck, BookOpen, User, ChevronRight, Award, FileText, Code, Users, ChevronDown, Image, Mail, Edit, Settings, LogOut, MessageSquare,X } from "lucide-react";
import { db, auth } from '../Firebase/firebase.jsx'; // Your Firebase config file
import { collection, query, where, getDocs, orderBy, limit, Timestamp, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { Clock, MapPin } from 'lucide-react';
import DevClubInsights from '../components/DevClubInsights'; // Adjust the path if needed



const FeedbackCard = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/feedback");
  };
  return (
<div className="w-[1280px] max-w-none bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl shadow-xl p-5 border-2 border-transparent bg-clip-padding hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4 shadow-lg">
            <FiMessageCircle className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Share Your Feedback
            </h3>
            <p className="text-gray-600 mt-1">Your voice shapes our journey forward</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl p-5 text-white text-center shadow-lg -mt-8">
          <h4 className="text-2xl font-bold mb-2">Ready to Share Your Thoughts?</h4>
          <p className="mb-4 opacity-90">Join thousands of users who are helping shape the future of our platform</p>
          <button
            onClick={handleRedirect}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <FiMessageCircle className="text-lg" />
            <span>Give Feedback Now</span>
          </button>
          <p className="text-xs mt-3 opacity-75">Takes less than 2 minutes • Your privacy is protected</p>
        </div>
      </div>
    </div>
  );
};


const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-80 bg-white rounded-xl shadow-xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-200">
          <div className="p-4">
            <div className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <div className="bg-blue-100 p-2 rounded-full mt-1">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <a
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <h3 className="font-semibold text-gray-900">Quick Chat with Classmates</h3>
                  <p className="text-sm text-gray-600 mt-1">Get instant help or discuss course projects</p>
                </a>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DeadlineItem = ({ title, date, daysLeft, progress, course }) => (
  <div className="border-l-2 border-indigo-200 pl-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-gray-500">{course} • Due {date}</p>
      </div>
      <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{daysLeft}</span>
    </div>
    <div className="mt-2">
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-indigo-600 h-1.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-xs text-gray-500 mt-1">{progress}% complete</p>
    </div>
  </div>
);

const NotificationCard = ({ type, title, message, time, status }) => {
  const typeStyles = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300'
    },
    medium: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300'
    },
    low: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300'
    }
  };

  const styles = typeStyles[type] || typeStyles.low;

  return (
    <div
      className={`p-4 rounded-lg transition hover:shadow-sm ${styles.bg} ${styles.border} border ${
        status === 'unread' ? 'ring-2 ring-blue-300' : ''
      }`}
    >
      <span className={`text-xs font-medium px-2 py-1 bg-white/60 rounded-full inline-block ${styles.text}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)} priority
      </span>
      <h3 className={`font-semibold mt-2 ${styles.text}`}>{title}</h3>
      <p className="text-sm text-gray-700 mt-1">{message}</p>
      <p className="text-xs text-gray-500 mt-2">{time}</p>
    </div>
  );
};

// Main Component
const StudentDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [studentData, setStudentData] = useState({
    name: "Loading...",
    email: "Loading...",
    profileImage: null,
    role: "student",
    id: null,
    nim: null,
    uid: null
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const profileRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const navigate = useNavigate();

  // Firebase Authentication State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        setCurrentUser(user);
        await fetchStudentData(user.uid);
      } else {
        console.log("User not authenticated");
        setCurrentUser(null);
        setAuthError("User not authenticated");
        // Optionally redirect to login
        // navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch student data from Firestore
  const fetchStudentData = async (uid) => {
    try {
      console.log("Fetching student data for UID:", uid);
      const studentDocRef = doc(db, "students", uid);
      const studentDoc = await getDoc(studentDocRef);
      
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        console.log("Student data fetched:", data);
        
        setStudentData({
          name: data.name || data.displayName || "Unknown User",
          email: data.email || currentUser?.email || "No email",
          profileImage: data.profileImage || data.photoURL || null,
          role: data.role || "student",
          id: uid,
          nim: data.nim || data.studentId || null,
          uid: uid,
          createdAt: data.createdAt,
          lastLogin: data.lastLogin
        });
        
        // Update last login timestamp
        await updateDoc(studentDocRef, {
          lastLogin: Timestamp.now()
        });
      } else {
        console.log("No student document found, creating default data");
        // Create a default student document if it doesn't exist
        const defaultData = {
          name: currentUser?.displayName || "New Student",
          email: currentUser?.email || "No email",
          role: "student",
          uid: uid,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now()
        };
        
        await setDoc(studentDocRef, defaultData);
        setStudentData({
          ...defaultData,
          id: uid,
          profileImage: null,
          nim: null
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setAuthError("Failed to load student data");
    }
  };

  // Event registration handler
  const handleRegister = async (eventId) => {
  if (!currentUser) {
    alert("Please log in to register for events");
    return;
  }

  try {
    const registrationRef = doc(db, "registrations", `${currentUser.uid}_${eventId}`);
    const registrationSnap = await getDoc(registrationRef);
    
    if (registrationSnap.exists()) {
      alert("You're already registered for this event!");
      return;
    }

    // Optimistically update the UI
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId
          ? { 
              ...event, 
              registrationCount: (event.registrationCount || 0) + 1,
              isRegistered: true 
            }
          : event
      )
    );

    await setDoc(registrationRef, {
      eventId,
      studentId: currentUser.uid,
      studentName: studentData.name,
      studentEmail: studentData.email,
      studentNim: studentData.nim,
      registeredAt: Timestamp.now(),
      registrationStatus: "confirmed"
    });

    await updateDoc(doc(db, "events", eventId), {
      registrationCount: increment(1),
      lastUpdated: Timestamp.now()
    });

    const event = events.find(e => e.id === eventId);
    alert(`Successfully registered for ${event?.title}!`);

  } catch (error) {
    console.error("Registration error:", error);
    alert(`Registration failed: ${error.message}`);
    
    // Revert the optimistic update on error
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId
          ? { 
              ...event, 
              registrationCount: Math.max(0, (event.registrationCount || 0) - 1),
              isRegistered: false 
            }
          : event
      )
    );
  }
};

  // Fetch events

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);

      // Fetch all events, sorted by date (optional)
      const q = query(
        collection(db, "events"),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);

      const eventsData = [];
      
      for (const eventDoc of querySnapshot.docs) {
        const eventData = {
          id: eventDoc.id,
          ...eventDoc.data(),
          formattedDate: formatFirestoreTimestamp(eventDoc.data().date),
          registrationCount: eventDoc.data().registrationCount || 0,
          isRegistered: false // Default to false
        };

        // Check if current user is registered for this event
        if (currentUser) {
          const registrationRef = doc(db, "registrations", `${currentUser.uid}_${eventDoc.id}`);
          const registrationSnap = await getDoc(registrationRef);
          eventData.isRegistered = registrationSnap.exists();
        }

        eventsData.push(eventData);
      }

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Only fetch events if currentUser is available
  if (currentUser) {
    fetchEvents();
  }
}, [currentUser]);

  // Only fetch events if currentUser is available
 


  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const q = query(
          collection(db, 'notifications'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const fetchedNotifications = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedNotifications.push({
            id: doc.id,
            title: data.title || 'Notification',
            message: data.message || data.content || data.description || '',
            type: data.priority || data.type || 'medium',
            time: formatFirestoreTimestamp(data.createdAt),
            status: data.status || 'unread'
          });
        });

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown date";
    
    try {
      if (typeof timestamp === 'string' && timestamp.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(timestamp).toLocaleDateString(undefined, options);
      }
      
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return timestamp.toDate().toLocaleDateString(undefined, options);
      }
      
      if (timestamp instanceof Date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return timestamp.toLocaleDateString(undefined, options);
      }
      
      return "Unknown date";
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Unknown date";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsProfileSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData({ ...studentData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setStudentData({ ...studentData, name: e.target.value });
  };

  const handleEmailChange = (e) => {
    setStudentData({ ...studentData, email: e.target.value });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      const studentDocRef = doc(db, "students", currentUser.uid);
      await updateDoc(studentDocRef, {
        name: studentData.name,
        email: studentData.email,
        profileImage: studentData.profileImage,
        updatedAt: Timestamp.now()
      });
      
      setIsProfileSettingsOpen(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Authentication error state
  if (authError && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{authError}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, {studentData.name}
            </h1>
            <p className="text-gray-600 mt-1">Track your progress and activities</p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 w-full md:w-auto hover:bg-gray-50 transition"
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full relative">
                {studentData.profileImage ? (
                  <img
                    src={studentData.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{studentData.name}</p>
                <p className="text-sm text-gray-500">{studentData.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition ${isProfileOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                {!isProfileSettingsOpen ? (
                  <>
                    <div className="p-2">
                      <button
                        onClick={() => setIsProfileSettingsOpen(true)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <User className="w-4 h-4" />
                        Your Profile
                      </button>
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                      
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setIsProfileSettingsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ChevronRight className="w-5 h-5 transform rotate-180" />
                      </button>
                      <h3 className="font-medium text-gray-900">Profile Settings</h3>
                      <div className="w-5"></div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {studentData.profileImage ? (
                            <img
                              src={studentData.profileImage}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                          <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-200 cursor-pointer">
                            <Image className="w-3 h-3 text-gray-600" />
                            <input
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <span className="text-sm text-gray-600">Change photo</span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={studentData.name}
                            onChange={handleNameChange}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <Edit className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={studentData.email}
                            onChange={handleEmailChange}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {studentData.nim && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
                          <p className="text-sm text-gray-700">{studentData.nim}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                      <button
                        onClick={handleSaveProfile}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-rose-500" />
                Announcements
                {loadingNotifications && (
                  <span className="text-sm text-gray-500 ml-2">Loading...</span>
                )}
              </h2>
              <button className="text-sm text-rose-600 hover:text-rose-800 flex items-center">
                Mark all as read <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    time={notification.time}
                    status={notification.status}
                  />
                ))}
              </div>
            ) : (
              !loadingNotifications && (
                <div className="text-center py-8 text-gray-500">
                  No notifications found.
                </div>
              )
            )}
          </div>

         
          
          {/* Upcoming Events Section */}
<div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl shadow-lg border border-slate-200 lg:col-span-2">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
        <CalendarDays className="w-6 h-6 text-white" />
      </div>
      Upcoming Events
    </h2>
    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      View all <ChevronRight className="w-4 h-4" />
    </button>
  </div>

  {loadingEvents ? (
    <div className="flex justify-center py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <span className="animate-spin text-2xl">🌀</span>
        <span className="ml-3 text-slate-600 font-medium">Loading events...</span>
      </div>
    </div>
  ) : events.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-red-90 to-red-100 p-3 text-gray-800">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-1 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                <p className="text-grey/900 text-sm mt-1">{event.formattedDate}</p>
              </div>
            </div>
          </div>
          
          {/* Event Image */}
          {event.imageURL && (
            <div className="relative">
              <img 
                src={event.imageURL} 
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          {/* Event Details */}
          <div className="p-5">
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="bg-slate-100 p-1 rounded">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="bg-slate-100 p-1 rounded">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{event.venue}</span>
              </div>
            </div>
            
            {/* Registration Info and Button - Fixed Version */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto"></div>
                <span className="text-sm text-slate-600 font-medium">
                  {event.registrationCount || 0} registered
                </span>
              </div>
              
              <button
                onClick={() => handleRegister(event.id)}
                disabled={event.isRegistered}
                className={`px-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  event.isRegistered
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                }`}
              >
                {event.isRegistered ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Registered</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto">
        <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Events Scheduled</h3>
        <p className="text-slate-500">Check back later for upcoming events</p>
      </div>
    </div>
  )}
</div>

          {/* Upcoming Deadlines */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                Upcoming Deadlines
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <DeadlineItem
                title="Machine Learning Project"
                date="May 15, 2023"
                daysLeft="3 days left"
                progress={75}
                course="CS401"
              />
              <DeadlineItem
                title="Web App Prototype"
                date="May 22, 2023"
                daysLeft="10 days left"
                progress={30}
                course="CS305"
              />
              <DeadlineItem
                title="Research Paper Draft"
                date="June 1, 2023"
                daysLeft="20 days left"
                progress={10}
                course="CS410"
              />
            </div>
          </div>
          

          {/* Feedback Section */}
          <div className="lg:col-span-3">
                        <DevClubInsights />
</div>
            <FeedbackCard />
            
             
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ... all your existing content ... */}
      
      {/* Add the floating chat widget */}
      <FloatingChatWidget />
    </div>
  

          </div>
        </div>
      </div>
    
  );
};

export default StudentDashboard;