import { useState, useEffect } from "react";
import { db, storage, auth } from "../Firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const ResourceUploader = () => {
  // State management
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("pdf");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sanitize filename to prevent issues with special characters
  const sanitizeFilename = (filename) => {
    const extension = filename.split('.').pop();
    const nameWithoutExtension = filename.replace(`.${extension}`, '');
    const sanitized = nameWithoutExtension
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
    return `${sanitized}.${extension}`;
  };

  // Generate unique filename to prevent conflicts
  const generateUniqueFilename = (originalFilename) => {
    const timestamp = Date.now();
    const sanitized = sanitizeFilename(originalFilename);
    const extension = sanitized.split('.').pop();
    const nameWithoutExtension = sanitized.replace(`.${extension}`, '');
    return `${nameWithoutExtension}_${timestamp}.${extension}`;
  };

  // Validate file
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = {
      'pdf': ['application/pdf'],
      'video': ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'],
      'image': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      'document': [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
    };

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const typeGroup = type === 'pdf' ? 'pdf' : 
                     type === 'video' ? 'video' : 
                     type === 'image' ? 'image' : 'document';

    const isValidType = allowedTypes[typeGroup].includes(file.type);
    if (!isValidType) {
      throw new Error(`Invalid file type for ${type}. Please select a valid ${type} file.`);
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation checks
      if (!user) {
        alert("Please log in to upload files");
        return;
      }

      if (!file) {
        alert("Please select a file");
        return;
      }

      if (!title.trim()) {
        alert("Please enter a title");
        return;
      }

      if (!category.trim()) {
        alert("Please enter a category");
        return;
      }

      // Validate file
      validateFile(file);

      setUploading(true);
      setUploadProgress(0);

      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(file.name);
      console.log("Uploading file:", uniqueFilename);

      // Create storage reference
      const storageRef = ref(storage, `resources/${uniqueFilename}`);

      // Upload file
      console.log("Starting upload...");
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("Upload successful:", uploadResult);

      setUploadProgress(50);

      // Get download URL
      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);

      setUploadProgress(75);

      // Save to Firestore
      console.log("Saving to Firestore...");
      const docRef = await addDoc(collection(db, "resources"), {
        title: title.trim(),
        type,
        category: category.trim(),
        url: downloadURL,
        description: description.trim(),
        filename: uniqueFilename,
        originalFilename: file.name,
        fileSize: file.size,
        uploadedAt: Timestamp.now(),
        uploadedBy: user.uid,
        uploaderEmail: user.email
      });

      console.log("Firestore document created:", docRef.id);
      setUploadProgress(100);

      // Success - reset form
      alert("File uploaded successfully!");
      resetForm();

    } catch (error) {
      console.error("Upload error:", error);
      
      // Provide specific error messages
      let errorMessage = "Failed to upload file. ";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage += "You don't have permission to upload files. Please check your authentication.";
      } else if (error.code === 'storage/canceled') {
        errorMessage += "Upload was canceled.";
      } else if (error.code === 'storage/unknown') {
        errorMessage += "An unknown error occurred. Please try again.";
      } else if (error.code === 'storage/invalid-checksum') {
        errorMessage += "File integrity check failed. Please try again.";
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage += "Upload retry limit exceeded. Please try again later.";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setType("pdf");
    setCategory("");
    setFile(null);
    setDescription("");
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name, selectedFile.type, selectedFile.size);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">🔒 Authentication Required</h2>
          <p className="text-gray-600">Please log in to upload resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📤 Upload New Resource</h2>
      
      {/* User info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Logged in as: <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={100}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pdf">PDF Document</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="document">Document (Word/Text)</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Machine Learning, Web Development, Data Science"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={50}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File * (Max 10MB)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.mp4,.mov,.avi,.mkv,.png,.jpg,.jpeg,.gif"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the resource (optional)"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={500}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Resource"}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceUploader;