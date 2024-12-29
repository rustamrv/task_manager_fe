import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../api/AuthReducer';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Retrieve authentication state from Redux
  const token = useSelector((state: RootState) => state.auth.token);

  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child component
  return <>{children}</>;
};

export default ProtectedRoute;
