import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); // Initially null, to be set after login

  useEffect(() => {
    const userID = localStorage.getItem('username'); // The userID from localStorage
    const token = localStorage.getItem('accessToken'); // The access token from localStorage

    if (!userID || !token) {
      setError('User is not logged in properly.');
      return;
    }

    setUser({ name: userID, userID: userID }); // Dynamically setting user info
  }, []); // Run only once on component mount

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken'); // Retrieve access token
      const role = localStorage.getItem('userRole'); // Retrieve user role
      const userID = user?.userID || localStorage.getItem('username'); // Use dynamic userID from user state

      if (!token || !role || !userID) {
        setError('Access token, user role, or userID not found. Please log in again.');
        return;
      }

      const response = await fetch(
        `https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks?role=${role}&userID=${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Using the Bearer token for authorization
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch tasks.');

      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setError('Invalid data format received from API.');
      }
    } catch (error) {
      setError(`Error fetching tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks(); // Fetch tasks only if the user data is available
    }
  }, [user]);

  const handleStatusChange = async (taskID, newStatus) => {
    console.log(`Changing status for task ${taskID} to ${newStatus}`);  // Check if it's being called
    try {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');  // Assuming role is stored in localStorage after login
      console.log("User role:", role);

      if (!token) {
        setError('Access token not found. Please log in again.');
        return;
      }
  
      // Construct the request body
      const body = { taskID,role, status: newStatus };
  
      // Make the PUT request to the API to update the task
      const response = await fetch('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header with the token
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) throw new Error('Failed to update task status.');
  
      // Refetch the tasks after a successful status update to reflect the change
      fetchTasks();
  
    } catch (error) {
      setError(`Error updating task: ${error.message}`);
    }
  };
  

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-primary">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-primary">Welcome, {user.name}!</h2>
        <p className="lead text-muted">Here are your assigned tasks:</p>
      </div>

      <div className="card shadow-lg rounded-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Your Tasks</h3>
          {loading ? (
            <p className="text-center text-muted mt-3">Loading tasks...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : tasks.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {tasks.map((task) => (
                <div className="col" key={task.taskID}>
                  <div className="card shadow-sm border-light rounded">
                    <div className="card-body">
                      <h5 className="card-title"><strong>Task Name:</strong> {task.taskName}</h5>
                      <p className="card-text"><strong>Priority:</strong> {task.priority}</p>
                      <p className="card-text"><strong>Description:</strong> {task.description}</p>
                      <p className="card-text"><strong>Due Date:</strong> {task.deadline}</p>
                      <p className="card-text"><strong>Status:</strong> {task.status}</p>
                      <select
                        className="form-select form-select-sm"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.taskID, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted mt-3">You have no tasks assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
