import React, { useState } from 'react';
import { confirmSignUp } from '../../services/AuthService';

function ConfirmRegistration() {
  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
        const result = await confirmSignUp(username, confirmationCode);
        // Parse the response body since it's stringified JSON
        const responseData = JSON.parse(result.body); // Assuming result is the raw API response

        console.log(responseData.message); // Log the success message
        setMessage('Your account has been confirmed! Redirecting to login...');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = '/login'; // Replace with your login page route
        }, 2000);
    } catch (err) {
        setError(err.message); // Display error message to the user
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h2 className="text-center text-primary mb-4">Confirm Registration</h2>
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

          {/* Confirmation Code */}
          <div className="mb-3">
            <label htmlFor="confirmationCode" className="form-label">Confirmation Code</label>
            <input
              type="text"
              id="confirmationCode"
              className="form-control"
              placeholder="Enter the code sent to your email"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Account'}
          </button>
        </form>

        {/* Display success or error messages */}
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default ConfirmRegistration;
