import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { signUp } from '../../services/AuthService';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [group, setGroup] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter.');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter.');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number.');
    if (!/[@$!%*?&]/.test(password)) errors.push('Password must contain at least one special character.');
    return errors;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (passwordErrors.length > 0) {
      alert('Please fix the password errors before submitting.');
      return;
    }

    if (role === 'user' && !group) {
      alert('Please select a group.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(username, password, email, role, group);
      alert('Registration successful! Please verify your email.');
      // Redirect to confirmation page with username
      navigate('/ConfirmRegistration', { state: { username } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '500px' }}>
        <h2 className="text-center text-primary mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
            {passwordErrors.length > 0 && (
              <ul className="text-danger mt-2">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <div>
              <div className="form-check">
                <input
                  type="radio"
                  id="adminRole"
                  name="role"
                  className="form-check-input"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                <label htmlFor="adminRole" className="form-check-label">Register as Admin</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  id="userRole"
                  name="role"
                  className="form-check-input"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />
                <label htmlFor="userRole" className="form-check-label">Register as User</label>
              </div>
            </div>
          </div>

          {/* Group Selection (Only for User) */}
          {role === 'user' && (
            <div className="mb-3">
              <label htmlFor="group" className="form-label">Select Group</label>
              <select
                id="group"
                className="form-select"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
              >
                <option value="">Select Group</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="qa">QA</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {error && <p className="text-danger mt-3">{error}</p>}

        <p className="text-center mt-3">
          Already have an account?{' '}
          <Link to="/" className="text-decoration-none text-primary">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
