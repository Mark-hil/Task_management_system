import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../services/AuthService'; // Assuming this handles the API call to the login endpoint
// import { getUserRole } from '../../services/AuthService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
    }

    try {
        const response = await authenticateUser(email, password);

        // Get tokens from response body
        const result =  response.body;
        const tokens =  result.tokens;

        console.log("Role: ", result.role);


        if (!tokens || !tokens.AccessToken || !tokens.IdToken) {
            console.error('Missing tokens in response');
            setError('Authentication failed. Tokens are missing.');
            return;
        }

        const { AccessToken, IdToken } = tokens;
        const role = result.role;

        localStorage.setItem('accessToken', AccessToken);
        localStorage.setItem('idToken', IdToken);
        

        if (role === 'admin') {
            navigate('/admin-dashboard');
        } else if (role === 'user') {
            navigate('/User-Dashboard');
        } else {
            setError('Role not defined for this user.');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('Invalid credentials or error during login.');
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h2 className="text-center text-primary mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none text-primary">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
