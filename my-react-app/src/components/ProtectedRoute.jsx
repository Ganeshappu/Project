// src/components/ProtectedRoute.js
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/student-login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;