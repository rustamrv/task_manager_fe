import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/login/ProtectedRoute';
import TaskReport from './pages/TaskReport';
import Settings from './pages/Setting';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import { RootState } from '@api/Store';
import { Toaster } from '@components/ui/Toaster';

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  return (
    <Router>
      <div className="flex flex-col w-full h-screen">
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <TaskReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
