// pages/AdminDashboard.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import CertificateGenerator from '../components/CertificateGenerator';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Activity, Mail, Lock, FileText, Calendar, 
  Plus, Send, FileBarChart, Target, Shield, ClipboardList,
  MessageSquare, AlertCircle, CheckCircle, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, Loader2
} from 'lucide-react';

// Import Firebase functions
import { db } from '../Firebase/firebase'; // Adjust path as needed
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminDashboar = () => {
  const profileRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [error, setError] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Helper function to format Firestore timestamp
  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      // Handle Firestore Timestamp
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString();
      }
      
      // Handle regular Date object
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
      }
      
      // Handle timestamp in milliseconds
      if (typeof timestamp === 'number') {
        return new Date(timestamp).toLocaleDateString();
      }
      
      // Handle string dates
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString();
      }
      
      return 'Unknown date';
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown date';
    }
  };

  // FIXED: Improved feedback fetching using Firebase
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoadingFeedback(true);
        setError(null);
        console.log("Fetching feedback...");

        // Create a query against the feedback collection
        // FIXED: Made query more flexible to catch more feedback
        const q = query(
          collection(db, 'feedback'), // Adjust collection name as needed
          orderBy('createdAt', 'desc'), // Newest first
          limit(10) // Limit to 10 most recent feedback
        );

        const querySnapshot = await getDocs(q);
        const fetchedFeedback = [];
        
        console.log("Feedback query returned:", querySnapshot.size, "documents");

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Feedback document:", doc.id, data);
          
          fetchedFeedback.push({
            id: doc.id,
            message: data.message || data.feedback || data.comment || data.content || '',
            userName: data.userName || data.name || data.user || 'Anonymous',
            userEmail: data.userEmail || data.email || '',
            rating: data.rating || null,
            type: data.type || 'general',
            createdAt: formatFirestoreTimestamp(data.createdAt || data.timestamp),
            status: data.status || 'unread'
          });
        });

        console.log("Processed feedback:", fetchedFeedback);
        setFeedback(fetchedFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback. Please try again later.");
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchFeedback();
  }, []);

  // Sample data (other sections remain the same)
  const metrics = [
    { name: 'Total Users', value: '1,250', change: '5.4%', trend: 'up' },
    { name: 'New Signups Today', value: '24', change: '12%', trend: 'up' },
    { name: 'Active Sessions', value: '89', change: '3.2%', trend: 'down' },
    { name: 'Pending Verifications', value: '7', change: '0%', trend: 'neutral' }
  ];

  const events = [
    { name: 'AI & ML Hackathon', date: 'June 1, 2025', status: 'Scheduled' },
    { name: 'Web Dev Bootcamp', date: 'June 5, 2025', status: 'Draft' },
    { name: 'Alumni Meet & Greet', date: 'June 10, 2025', status: 'Confirmed' },
    { name: 'Blockchain Summit', date: 'June 20, 2025', status: 'Pending' }
  ];

  const activities = [
    { type: 'signup', user: 'Ravi Kumar', time: '10 minutes ago' },
    { type: 'profile', user: 'Anjali M.', time: '30 mins ago' },
    { type: 'lockout', user: 'raj123', time: '1 hour ago' },
    { type: 'email', user: 'all registered users', time: 'Today at 9:00 AM' }
  ];

  const quickActions = [
    { name: 'Add New Admin', icon: <Plus size={18} /> },
    { name: 'Send Announcement', icon: <Send size={18} /> },
    { name: 'Generate Report', icon: <FileBarChart size={18} /> },
    { name: 'Set Weekly Goal', icon: <Target size={18} /> }
  ];

  const tasks = [
    { name: 'Review user-uploaded documents', completed: false },
    { name: 'Approve 3 event proposals', completed: false },
    { name: 'Backup system database', completed: false },
    { name: 'Moderate user comments', completed: false }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'signup': return <Users size={16} className="text-blue-500" />;
      case 'profile': return <Activity size={16} className="text-purple-500" />;
      case 'lockout': return <Lock size={16} className="text-red-500" />;
      case 'email': return <Mail size={16} className="text-green-500" />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'text-xs px-2 py-1 rounded-full';
    switch(status) {
      case 'Scheduled': return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
      case 'Draft': return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
      case 'Confirmed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'Pending': return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>{status}</span>;
      default: return <span className={`${baseClasses} bg-gray-100`}>{status}</span>;
    }
  };

  // Helper function to render star rating
  const renderStarRating = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">🎉 Welcome, Admin!</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening across your platform today. Use the sections below to manage users, monitor events, and keep everything running smoothly.
        </p>
      </div>

      {/* Dashboard Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <FileText className="mr-2" size={18} /> Dashboard Overview
          </h2>
          <button 
            onClick={() => toggleSection('metrics')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSection === 'metrics' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {expandedSection !== 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{metric.name}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                    {metric.trend === 'up' ? <TrendingUp size={16} /> : 
                     metric.trend === 'down' ? <TrendingDown size={16} /> : 
                     <Minus size={16} />}
                    <span className="ml-1 text-sm">{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <Calendar className="mr-2" size={18} /> Upcoming Events
            </h2>
            <button 
              onClick={() => toggleSection('events')}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedSection === 'events' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection !== 'events' && (
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent User Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <Activity className="mr-2" size={18} /> Recent User Activities
            </h2>
            <button 
              onClick={() => toggleSection('activities')}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedSection === 'activities' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection !== 'activities' && (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                  <div className="mt-1 mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.type === 'signup' && <span>🆕 {activity.user} signed up</span>}
                      {activity.type === 'profile' && <span>✏️ {activity.user} updated her profile</span>}
                      {activity.type === 'lockout' && <span>🔒 Account lockout for user {activity.user}</span>}
                      {activity.type === 'email' && <span>📧 Email sent to {activity.user}</span>}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <Shield className="mr-2" size={18} /> Quick Actions
            </h2>
            <button 
              onClick={() => toggleSection('actions')}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedSection === 'actions' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection !== 'actions' && (
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="mb-2 p-2 bg-blue-100 text-blue-600 rounded-full">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium">{action.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback - Updated with Firebase fetching */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <MessageSquare className="mr-2" size={18} /> Recent Feedback
            </h2>
            <button 
              onClick={() => toggleSection('feedback')}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedSection === 'feedback' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection !== 'feedback' && (
            <div className="space-y-4">
              {loadingFeedback ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                  <span className="ml-2 text-gray-500">Loading feedback...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <AlertCircle className="mr-2" size={16} />
                  <span>{error}</span>
                </div>
              ) : feedback.length > 0 ? (
                feedback.map((item, index) => (
                  <div key={item.id || index} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-gray-700 italic mb-1">"{item.message}"</p>
                        {item.rating && renderStarRating(item.rating)}
                      </div>
                      {item.type && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full ml-2">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>— {item.userName}</span>
                      <span>{item.createdAt}</span>
                    </div>
                    {item.userEmail && (
                      <p className="text-xs text-gray-400 mt-1">{item.userEmail}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <MessageSquare className="mr-2" size={20} />
                  <span>No feedback received yet</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <ClipboardList className="mr-2" size={18} /> Pending Tasks
            </h2>
            <button 
              onClick={() => toggleSection('tasks')}
              className="text-gray-500 hover:text-gray-700"
            >
              {expandedSection === 'tasks' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection !== 'tasks' && (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={task.completed}
                      onChange={() => {}}
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                      {task.name}
                    </span>
                  </div>
                  {!task.completed && (
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Start
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;