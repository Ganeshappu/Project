import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../Firebase/firebase.jsx"; // Added auth import
import { FiSend, FiCheckCircle, FiAlertCircle, FiStar } from "react-icons/fi";

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
    setMessage({ text: "", type: "" });

    try {
      await addDoc(collection(db, "feedbacks"), {
        ...formData,
        userId: auth.currentUser?.uid || "anonymous",
        userEmail: auth.currentUser?.email || formData.email,
        createdAt: serverTimestamp(),
        status: "new",
        archived: false,
      });

      setMessage({
        text: "Thank you for your valuable feedback!",
        type: "success",
      });
      setFormData({
        name: "",
        email: "",
        course: "",
        rating: 0,
        feedback: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage({
        text: error.message || "Error submitting feedback. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Course Feedback
        </h2>
        <p className="text-gray-600">
          We appreciate your input to improve our programs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
              <span className="text-gray-400 ml-1">(optional)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="John Doe"
              maxLength="50"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
              <span className="text-gray-400 ml-1">
                {auth.currentUser ? "(logged in)" : "(optional)"}
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={auth.currentUser?.email || formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                auth.currentUser ? "bg-gray-100" : ""
              }`}
              placeholder="your@email.com"
              disabled={!!auth.currentUser}
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course/Subject<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">Select your course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Rating System */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-2 rounded-md flex items-center justify-center transition-all ${
                    formData.rating >= star
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  aria-label={`Rate ${star} star`}
                >
                  <FiStar
                    className={`w-5 h-5 ${
                      formData.rating >= star ? "fill-current" : ""
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600 self-center">
                {formData.rating > 0 && `${formData.rating}/5`}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Feedback<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="feedback"
            rows={5}
            value={formData.feedback}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="What did you like? What can we improve?"
            required
            minLength="20"
            maxLength="1000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 20 characters (about {Math.ceil(20 - formData.feedback.length)} more needed)
          </p>
        </div>

        {/* Submit Button and Status Message */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || formData.feedback.length < 5 || !formData.course || !formData.rating}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center min-w-[200px] justify-center ${
              loading ? "opacity-90" : ""
            }`}
          >
            {loading ? (
              <span className="inline-block animate-pulse">Processing...</span>
            ) : (
              <>
                <FiSend className="mr-2" />
                Submit Feedback
              </>
            )}
          </button>

          {message.text && (
            <div
              className={`flex-1 max-w-md p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {message.type === "success" ? (
                  <FiCheckCircle className="mr-2 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="mr-2 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentFeedbackForm;