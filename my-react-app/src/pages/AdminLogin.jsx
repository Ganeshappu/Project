import React, { useState } from 'react';

const AdminLogin = () => {
  // OTP states
  const [email, setEmail] = useState('bucky202206@gmail.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append("email", email);
      
      // Mock API call for demonstration
      const response = await fetch("http://localhost:8000/send-otp", {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error sending OTP');
      }
      
      setOtpSent(true);
      setMessage("OTP sent! Check your email.");
    } catch (err) {
      setMessage(err.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);
      
      // Mock API call for demonstration
      const response = await fetch("http://localhost:8000/verify-otp", {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error verifying OTP');
      }
      
      const res = await response.json();
      setMessage("Success: " + res.message);
      
      // Store token if remember me is checked
      if (rememberMe && res.token) {
        console.log('Would store token:', res.token);
      }
      
      // Set login success to true which will trigger the redirect
      setLoginSuccess(true);
      
    } catch (err) {
      setMessage(err.message || "Error verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setOtpSent(false);
    setOtp('');
    setMessage('');
  };

  // Redirect to admin dashboard if login was successful
  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-green-100 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Login Successful!</h2>
            <p className="text-gray-600 mt-2 mb-6">You are being redirected to the admin dashboard...</p>
            <a 
              href="/admin-dashboard" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all hover:shadow-2xl">
        {/* Header with admin icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-rose-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 mt-2">
            {otpSent ? 'Enter verification code' : 'Secure access to system controls'}
          </p>
        </div>

        {/* Message display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('Success') || message.includes('sent') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                {message.includes('Success') || message.includes('sent') ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}

        {/* Enhanced form with OTP functionality */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {otpSent ? 'Admin Email' : 'Username'}
            </label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="admin@example.com" 
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-center text-lg font-mono tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8A6 6 0 006 8v2H5a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3h-1V8zM9 8a3 3 0 016 0v2H9V8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="admin-remember" 
                name="admin-remember" 
                type="checkbox" 
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="admin-remember" className="ml-2 block text-sm text-gray-700">
                Keep me signed in
              </label>
            </div>
            
            {otpSent ? (
              <button
                type="button"
                onClick={handleGoBack}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Change email
              </button>
            ) : (
              <div className="text-sm">
                <a href="" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Recover access
                </a>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            disabled={isLoading}
            className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {otpSent ? 'Verifying...' : 'Sending OTP...'}
              </div>
            ) : (
              otpSent ? 'Verify & Access Dashboard' : 'Send OTP'
            )}
          </button>
        </div>

        {/* Security reminder */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex">
            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-indigo-700">
              {otpSent 
                ? 'OTP is valid for 5 minutes. Check your email for the verification code.'
                : 'Ensure you\'re on a secure network before logging in'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;