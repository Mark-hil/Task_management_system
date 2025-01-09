import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to handle authentication and admin check
const ProtectedRoute = ({ isAuthenticated, isAdmin, children }) => {
  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" />;
  }

  // Additional check for admin route (if required)
  if (isAdmin && !isAuthenticated) {
    // Redirect to login or some other page if user is not admin
    return <Navigate to="/AdminDashboard" />;
  }

  // If authenticated, render the children (the requested page)
  return children;
};

export default ProtectedRoute;
