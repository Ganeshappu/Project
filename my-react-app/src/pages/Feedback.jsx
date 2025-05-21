import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase.jsx";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const StudentFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    rating: 0,
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const courses = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Arts",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.feedback.trim()) {
      setMessage({ text: "Please provide your feedback", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "feedbacks"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new", // for admin to track feedback status
      });
      setMessage({
        text: "Feedback submitted successfully!",
        type: "success",
      });
      setFormData({
        name: "",
        email: "",
        course: "",
        rating: 0,
        feedback: "",
      });
    } catch (error) {
      setMessage({
        text: "Error submitting feedback. Please try again.",
        type: "error",
      });
      console.error("Error submitting feedback:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Share Your Feedback
        </h2>
        <p className="text-gray-600">
          Your opinion helps us improve our services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course/Subject
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    formData.rating >= star
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Feedback*
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows={5}
            value={formData.feedback}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Please share your thoughts, suggestions, or concerns..."
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-70 flex items-center"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <FiSend className="mr-2" />
                Submit Feedback
              </>
            )}
          </button>

          {message.text && (
            <div
              className={`flex items-center ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="mr-2" />
              ) : (
                <FiAlertCircle className="mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentFeedbackForm;
