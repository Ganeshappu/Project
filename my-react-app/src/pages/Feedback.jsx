import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../Firebase/firebase.jsx";
import { FiSend, FiCheckCircle, FiAlertCircle, FiMail } from "react-icons/fi";

const StudentFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.feedback.trim()) {
      setMessage({ text: "Please provide your feedback", type: "error" });
      return;
    }

    if (!formData.email) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await addDoc(collection(db, "feedback"), {
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
        feedback: "",
      });

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
          Feedback Form
        </h2>
        <p className="text-gray-600">
          We appreciate your input to improve our services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field (still optional) */}
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

          {/* Email Field (now required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                placeholder="your@email.com"
                required
              />
              <FiMail className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Feedback<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="feedback"
            rows={5}
            value={formData.feedback}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Share your thoughts with us..."
            required
            minLength="20"
            maxLength="1000"
          />
          
        </div>

        {/* Submit Button and Status Message */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || formData.feedback.length < 5 || !formData.email}
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
