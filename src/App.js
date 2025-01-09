import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ConfirmRegistration from './components/Auth/ConfirmRegistration';
import Dashboard from './components/Dashboard/UserDashboard';
import TaskForm from './components/Tasks/TaskForm'; // Import TaskForm
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageGroups from './components/admin/ManageGroups';
import AdminSettings from './components/admin/AdminSettings';
import AdminTaskManager from './components/admin/AdminTaskManager';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDashboard from './components/Dashboard/UserDashboard';

function App() {
  const isAuthenticated = true; // Set based on your authentication logic
  const isAdmin = false; // Set based on the user's role

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/ConfirmRegistration" element={<ConfirmRegistration />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard role="member" /></ProtectedRoute>}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/groups" element={<ManageGroups />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin/tasks" element={<AdminTaskManager />} />
          <Route path="/tasks" element={<TaskForm />} /> {/* TaskForm route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
