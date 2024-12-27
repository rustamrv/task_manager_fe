import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Retrieve authentication state from Redux
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child component
  return <>{children}</>;
};

export default ProtectedRoute;
