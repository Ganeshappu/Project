const AdminLogin = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all hover:shadow-2xl">
          {/* Header with admin icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-rose-500 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7l6 3m-6-3l-6 3m6-3v10m-6-3v10m6-10v10m6-3v10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-gray-500 mt-2">Secure access to system controls</p>
          </div>
  
          {/* Form with enhanced styling */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="admin@example.com" 
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="admin-remember" 
                  name="admin-remember" 
                  type="checkbox" 
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="admin-remember" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Recover access
                </a>
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            >
              Access Dashboard
            </button>
          </form>
  
          {/* Security reminder */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex">
              <svg className="h-5 w-5 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-indigo-700">
                Ensure you're on a secure network before logging in
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminLogin;