import { useState, useEffect } from 'react';
import { db } from '../Firebase/firebase.jsx'; // Adjust the import path as necessary 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Announcements = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    recipientType: 'all'
  });
  const [isSending, setIsSending] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'message') {
      setCharacterCount(value.length);
    }
  };

  const sendNotification = async () => {
    if (!formData.message.trim()) {
      toast.error('Please enter a message', { theme: 'colored' });
      return;
    }

    setIsSending(true);

    try {
      await addDoc(collection(db, 'notifications'), {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        recipientType: formData.recipientType,
        createdAt: serverTimestamp(),
        status: 'unread'
      });

      toast.success('Announcements sent successfully!', { theme: 'colored' });
      setFormData({
        title: '',
        message: '',
        priority: 'medium',
        recipientType: 'all'
      });
      setCharacterCount(0);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification', { theme: 'colored' });
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-500 text-red-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low': return 'bg-green-100 border-green-500 text-green-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Make  Announcements</h2>
        <p className="text-gray-600">Broadcast important updates to users</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Announcements title"
            maxLength={60}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <span className={`text-xs ${characterCount > 250 ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/250
            </span>
          </div>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your Announcements message here..."
            maxLength={250}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getPriorityColor(formData.priority)}`}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
            <select
              name="recipientType"
              value={formData.recipientType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="teachers">Teachers Only</option>
              <option value="admins">Admins Only</option>
            </select>
          </div>
        </div>

        <button
          onClick={sendNotification}
          disabled={isSending || !formData.message.trim()}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md`}
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : 'Make Announcements'}
        </button>
      </div>
    </div>
  );
};

export default Announcements;