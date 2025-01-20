import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    assigneeID: '',
    deadline: '',
    priority: 'Low', // Default priority
    status: 'Pending', // Default status
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Fetching users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = new URL('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/registration/users');
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const data = await response.json();
        console.log('API Response:', data);  // Log the raw API response
  
        // Check if the response body contains a users array
        if (data.body && Array.isArray(data.body.users)) {
          const formattedUsers = data.body.users.map(user => {
            // Extract the relevant user information
            const email = user.Attributes.find(attr => attr.Name === 'email')?.Value;
            const role = user.Attributes.find(attr => attr.Name === 'custom:role')?.Value;
            const username = user.Username;
  
            return {
              email,
              role,
              username
            };
          });
  
          setUsers(formattedUsers);  // Set the formatted user data
        } else {
          setError('Invalid data format received: Expected an array inside the "body" property.');
        }
      } catch (error) {
        setError('Error fetching users: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetching tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = new URL('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks');
        url.searchParams.append('role', 'admin');
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        setError('Error fetching tasks: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const response = await fetch('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to create task');
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask({
        taskName: '',
        description: '',
        assigneeID: '',
        deadline: '',
        priority: 'Low',
        status: 'Pending',
      });
      setShowModal(false); // Close modal after creating a task
    } catch (error) {
      setError('Error creating task: ' + error.message);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');  // Assuming role is stored in localStorage after login
      console.log(`Changing status for task to ${role}`);
      if (!token) {
        setError('Access token not found. Please log in again.');
        return;
      }
  
      // Construct the request body
      const body = {
        taskID: isEditing,  // Add taskID to the body for the update request
        role: role, 
      };
  
      // Admins can update all task fields
      if (role === 'admin') {
        body.taskName = newTask.taskName;
        body.description = newTask.description;
        body.assigneeID = newTask.assigneeID;
        body.deadline = newTask.deadline;
        body.priority = newTask.priority;
        body.status = newTask.status;
      }
  
      // Make the PUT request to the API
      const response = await fetch('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header with the token
        },
        body: JSON.stringify(body),  // Pass the taskID and all other fields in the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
  
      // Update the task locally after a successful update
      setTasks(tasks.map(task => 
        task.taskID === isEditing 
        ? { ...task, ...newTask } // Update only the task that was edited
        : task // Leave other tasks unchanged
      ));
  
      // Reset the form and close the modal
      setIsEditing(null);
      setNewTask({
        taskName: '',
        description: '',
        assigneeID: '',
        deadline: '',
        priority: 'Low',
        status: 'Pending',
      });
      setShowModal(false); // Close modal after updating
    } catch (error) {
      setError('Error updating task: ' + error.message);
    }
  };

  const handleDeleteTask = async (taskID) => {
    try {
      const response = await fetch(`https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks/${taskID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task.taskID !== taskID)); // Remove task from the state
    } catch (error) {
      setError('Error deleting task: ' + error.message);
    }
  };

  // New function to handle editing tasks
  const handleEditTask = (taskID) => {
    const taskToEdit = tasks.find(task => task.taskID === taskID);
    if (taskToEdit) {
      setIsEditing(taskID);
      setNewTask({
        taskName: taskToEdit.taskName,
        description: taskToEdit.description,
        assigneeID: taskToEdit.assigneeID,
        deadline: taskToEdit.deadline,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
      });
      setShowModal(true); // Open the modal when editing a task
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-primary">Admin Dashboard</h2>
            <p className="lead">Manage tasks efficiently</p>
          </div>

          <div className="mb-4 text-right">
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
              Create Task
            </button>
          </div>

          <div className="row">
            {tasks.map((task, index) => (
              <div className="col-md-4" key={task.taskID || index}>
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Task Name: {task.taskName}</h5>
                    <p className="card-text">Task Description: {task.description}</p>
                    <p className="card-text">Priority: {task.priority}</p>
                    <p className="card-text">Status: {task.status}</p>
                    <p className="card-text">
                      <small className="text-muted">Task ID: {task.taskID}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Assigned to: {task.assigneeID}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Deadline: {task.deadline}</small>
                    </p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-warning btn-sm" onClick={() => handleEditTask(task.taskID)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.taskID)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h5>
                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Task Name"
                        value={newTask.taskName}
                        onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                      />
                      <textarea
                        className="form-control mb-2"
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                      <select
                        className="form-control mb-2"
                        value={newTask.assigneeID}
                        onChange={(e) => setNewTask({ ...newTask, assigneeID: e.target.value })}
                      >
                        <option value="">Select Assignee</option>
                        {users.map(user => (
                          <option key={user.username} value={user.username}>
                            {user.email}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        className="form-control mb-2"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      />
                      <select
                        className="form-control mb-2"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <select
                        className="form-control mb-2"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={isEditing ? handleUpdateTask : handleCreateTask}
                    >
                      {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
