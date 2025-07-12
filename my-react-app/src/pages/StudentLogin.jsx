import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, db } from '../Firebase/firebase.jsx';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMessage('');
    
    if (isLoginView) {
      // Login logic
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;

        // Check if user document exists, create if it doesn't
        const userRef = doc(db, "students", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // Update lastLogin if document exists
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
          });
        } else {
          // Create document if it doesn't exist (fallback)
          await setDoc(userRef, {
            email: user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: "student",
            uid: user.uid
          });
        }

        navigate('/student-dashboard');
      } catch (error) {
        console.error('Login error:', error);
        setAuthError(getFirebaseErrorMessage(error));
      } finally {
        setLoading(false);
      }

    } else {
      // Signup logic with Firestore integration
      const validationErrors = validateSignup();
      if (Object.keys(validationErrors).length === 0) {
        try {
          setLoading(true);
          // Create user account
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            credentials.email, 
            credentials.password
          );
          
          // Create user document in Firestore
          await setDoc(doc(db, "students", userCredential.user.uid), {
            name: credentials.name,
            email: credentials.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: "student",
            uid: userCredential.user.uid
          });

          // Show success message and switch to login view
          setSuccessMessage('Account created successfully! Please sign in.');
          setIsLoginView(true);
          setCredentials({
            email: credentials.email, // Keep email for convenience
            password: '',
            name: '',
            confirmPassword: ''
          });
          
        } catch (error) {
          console.error('Signup error:', error);
          setAuthError(getFirebaseErrorMessage(error));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        console.error('Unhandled auth error:', error);
        return 'Authentication failed. Please try again.';
    }
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!credentials.name.trim()) newErrors.name = 'Name is required';
    if (!credentials.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) newErrors.email = 'Email is invalid';
    if (!credentials.password) newErrors.password = 'Password is required';
    else if (credentials.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setErrors({});
    setAuthError('');
    setSuccessMessage('');
    // Clear password fields when toggling
    setCredentials({
      ...credentials,
      password: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Header with colorful gradient */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isLoginView ? 'Student Portal' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLoginView ? 'Welcome back! Please sign in' : 'Join us today! Create your account'}
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {authError}
          </div>
        )}

        {/* Form with colorful elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe" 
                  className={`w-full p-3 pl-10 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  value={credentials.name}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input 
                type="email" 
                name="email"
                placeholder="student@example.com" 
                className={`w-full p-3 pl-10 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                value={credentials.email}
                onChange={handleInputChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                className={`w-full p-3 pl-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                value={credentials.password}
                onChange={handleInputChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  className={`w-full p-3 pl-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  value={credentials.confirmPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          )}

          {isLoginView && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isLoginView ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Footer with toggle option */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={toggleView}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            {isLoginView ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;