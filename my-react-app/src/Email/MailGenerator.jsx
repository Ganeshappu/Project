import React, { useState, useEffect } from 'react';
import EmailService from '../Email/EmailService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebase.jsx';

const MailGenerator = () => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: '',
    html_body: ''
  });
  const [emailType, setEmailType] = useState('single');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [templates, setTemplates] = useState({
    welcome: {
      subject: 'Welcome to Our Program!',
      body: `Dear [Student Name],

Welcome to our educational program! We're excited to have you join us.

Here are some important details:
- Classes start on [Date]
- Please check your schedule regularly
- Contact us if you have any questions

Best regards,
Admin Team`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Our Program!</h2>
          <p>Dear <strong>[Student Name]</strong>,</p>
          <p>Welcome to our educational program! We're excited to have you join us.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Important Details:</h3>
            <ul>
              <li>Classes start on <strong>[Date]</strong></li>
              <li>Please check your schedule regularly</li>
              <li>Contact us if you have any questions</li>
            </ul>
          </div>
          <p>Best regards,<br>Admin Team</p>
        </div>
      `
    },
    announcement: {
      subject: 'Important Announcement',
      body: `Dear Students,

We have an important announcement to share with you.

[Announcement Details]

Please take note of this information.

Best regards,
Admin Team`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Important Announcement</h2>
          <p>Dear Students,</p>
          <p>We have an important announcement to share with you.</p>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>[Announcement Details]</strong></p>
          </div>
          <p>Please take note of this information.</p>
          <p>Best regards,<br>Admin Team</p>
        </div>
      `
    },
    reminder: {
      subject: 'Reminder: Upcoming Class',
      body: `Dear [Student Name],

This is a friendly reminder about your upcoming class:

Class: [Class Name]
Date: [Date]
Time: [Time]
Location: [Location]

Please make sure to attend on time.

Best regards,
Admin Team`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Class Reminder</h2>
          <p>Dear <strong>[Student Name]</strong>,</p>
          <p>This is a friendly reminder about your upcoming class:</p>
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td><strong>Class:</strong></td><td>[Class Name]</td></tr>
              <tr><td><strong>Date:</strong></td><td>[Date]</td></tr>
              <tr><td><strong>Time:</strong></td><td>[Time]</td></tr>
              <tr><td><strong>Location:</strong></td><td>[Location]</td></tr>
            </table>
          </div>
          <p>Please make sure to attend on time.</p>
          <p>Best regards,<br>Admin Team</p>
        </div>
      `
    },
    // New templates below
    assignment: {
      subject: 'New Assignment: [Assignment Name]',
      body: `Dear [Student Name],

A new assignment has been posted for [Class Name]:

Assignment: [Assignment Name]
Due Date: [Due Date]
Points: [Points]
Description: [Brief description]

You can find more details in the learning management system.

Best regards,
[Instructor Name]`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Assignment: [Assignment Name]</h2>
          <p>Dear <strong>[Student Name]</strong>,</p>
          <p>A new assignment has been posted for <strong>[Class Name]</strong>:</p>
          <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td><strong>Assignment:</strong></td><td>[Assignment Name]</td></tr>
              <tr><td><strong>Due Date:</strong></td><td>[Due Date]</td></tr>
              <tr><td><strong>Points:</strong></td><td>[Points]</td></tr>
              <tr><td><strong>Description:</strong></td><td>[Brief description]</td></tr>
            </table>
          </div>
          <p>You can find more details in the learning management system.</p>
          <p>Best regards,<br>[Instructor Name]</p>
        </div>
      `
    },
    feedback: {
      subject: 'Feedback on Your [Assignment/Project Name]',
      body: `Dear [Student Name],

Thank you for submitting your [Assignment/Project Name]. Here's my feedback:

Grade: [Grade]
Strengths: [List strengths]
Areas for Improvement: [List areas for improvement]
Additional Comments: [Any additional comments]

Please don't hesitate to reach out if you have any questions.

Best regards,
[Instructor Name]`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9333ea;">Feedback on Your [Assignment/Project Name]</h2>
          <p>Dear <strong>[Student Name]</strong>,</p>
          <p>Thank you for submitting your <strong>[Assignment/Project Name]</strong>. Here's my feedback:</p>
          <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td><strong>Grade:</strong></td><td>[Grade]</td></tr>
              <tr><td><strong>Strengths:</strong></td><td>[List strengths]</td></tr>
              <tr><td><strong>Areas for Improvement:</strong></td><td>[List areas for improvement]</td></tr>
              <tr><td><strong>Additional Comments:</strong></td><td>[Any additional comments]</td></tr>
            </table>
          </div>
          <p>Please don't hesitate to reach out if you have any questions.</p>
          <p>Best regards,<br>[Instructor Name]</p>
        </div>
      `
    },
    event: {
      subject: 'Upcoming Event: [Event Name]',
      body: `Dear Students,

We're excited to invite you to our upcoming event:

Event: [Event Name]
Date: [Date]
Time: [Time]
Location: [Location]
Description: [Event description]

Please RSVP by [RSVP Date] if you plan to attend.

We hope to see you there!

Best regards,
Event Team`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Upcoming Event: [Event Name]</h2>
          <p>Dear Students,</p>
          <p>We're excited to invite you to our upcoming event:</p>
          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
            <table style="width: 100%;">
              <tr><td><strong>Event:</strong></td><td>[Event Name]</td></tr>
              <tr><td><strong>Date:</strong></td><td>[Date]</td></tr>
              <tr><td><strong>Time:</strong></td><td>[Time]</td></tr>
              <tr><td><strong>Location:</strong></td><td>[Location]</td></tr>
              <tr><td><strong>Description:</strong></td><td>[Event description]</td></tr>
            </table>
          </div>
          <p>Please RSVP by <strong>[RSVP Date]</strong> if you plan to attend.</p>
          <p>We hope to see you there!</p>
          <p>Best regards,<br>Event Team</p>
        </div>
      `
    },
    
    course_completion: {
      subject: 'Congratulations on Completing [Course Name]!',
      body: `Dear [Student Name],

Congratulations on successfully completing [Course Name]!

Your final grade is: [Grade]
Certificate: [Certificate Link]

We appreciate your hard work and dedication throughout the course. We hope you found the experience valuable.

If you'd like to provide feedback about your experience, please complete our course evaluation:
[Evaluation Link]

Best wishes for your future endeavors!

Sincerely,
[Instructor Name]`,
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #065f46;">Congratulations on Completing [Course Name]!</h2>
          <p>Dear <strong>[Student Name]</strong>,</p>
          <p>Congratulations on successfully completing <strong>[Course Name]</strong>!</p>
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td><strong>Final Grade:</strong></td><td>[Grade]</td></tr>
              <tr><td><strong>Certificate:</strong></td><td><a href="[Certificate Link]">Download Certificate</a></td></tr>
            </table>
          </div>
          <p>We appreciate your hard work and dedication throughout the course. We hope you found the experience valuable.</p>
          <p>If you'd like to provide feedback about your experience, please complete our course evaluation:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="[Evaluation Link]" style="display: inline-block; padding: 12px 24px; background-color: #065f46; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Complete Course Evaluation
            </a>
          </div>
          <p>Best wishes for your future endeavors!</p>
          <p>Sincerely,<br>[Instructor Name]</p>
        </div>
      `
    },
    
  });


  // Mock student data - replace with actual data from your backend

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  fetchStudents();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templates[templateKey];
    setEmailData(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body,
      html_body: template.html_body
    }));
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const getRecipientEmails = () => {
    if (emailType === 'single') {
      return emailData.to.split(',').map(email => email.trim()).filter(email => email);
    } else {
      return selectedStudents.map(id => {
        const student = students.find(s => s.id === id);
        return student ? student.email : null;
      }).filter(email => email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const recipients = getRecipientEmails();
      
      if (recipients.length === 0) {
        throw new Error('Please select at least one recipient');
      }

      const emailPayload = {
        to: recipients,
        subject: emailData.subject,
        body: emailData.body,
        html_body: emailData.html_body || undefined
      };

      const result = await EmailService.sendEmail(emailPayload);
      setStatus({ 
        type: 'success', 
        message: `Email sent successfully to ${recipients.length} recipient(s)!` 
      });
      
      // Reset form if single email
      if (emailType === 'single') {
        setEmailData({ to: '', subject: '', body: '', html_body: '' });
      }
      
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to send email. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mail Generator</h1>
          <p className="text-gray-600 mt-2">Send emails to students and manage communications</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Email Composition */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="single"
                        checked={emailType === 'single'}
                        onChange={(e) => setEmailType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Single/Custom Recipients</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bulk"
                        checked={emailType === 'bulk'}
                        onChange={(e) => setEmailType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bulk to Students</span>
                    </label>
                  </div>
                </div>

                {/* Recipients */}
                {emailType === 'single' ? (
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                      Recipients (comma-separated emails)
                    </label>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      value={emailData.to}
                      onChange={handleInputChange}
                      placeholder="student1@example.com, student2@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Students ({selectedStudents.length} selected)
                      </label>
                      <button
                        type="button"
                        onClick={selectAllStudents}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                      {students.map(student => (
                        <label key={student.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {student.name} ({student.email})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter email subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                    Message Body
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    value={emailData.body}
                    onChange={handleInputChange}
                    rows="8"
                    placeholder="Enter your message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    required
                  />
                </div>

                {/* HTML Body (Optional) */}
                <div>
                  <label htmlFor="html_body" className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Body (Optional)
                  </label>
                  <textarea
                    id="html_body"
                    name="html_body"
                    value={emailData.html_body}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Enter HTML content for rich formatting..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
                  />
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-md text-white font-medium transition duration-200 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      `Send Email${emailType === 'bulk' ? ` to ${selectedStudents.length} Students` : ''}`
                    )}
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {status && (
                <div className={`mt-6 p-4 rounded-md ${
                  status.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {status.type === 'success' ? (
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{status.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Templates Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
              <div className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTemplateSelect(key)}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    <div className="font-medium text-sm text-gray-900 capitalize">
                      {key.replace('_', ' ')} Email
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.subject}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setEmailData({ to: '', subject: '', body: '', html_body: '' })}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                  >
                    Clear Form
                  </button>
                  <button
                    type="button"
                    onClick={() => EmailService.checkHealth().then(console.log)}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailGenerator;