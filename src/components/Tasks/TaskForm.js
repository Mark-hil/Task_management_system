import React, { useState, useEffect } from 'react';

function TaskForm() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('Pending');
  const [users, setUsers] = useState([]);

  // Mock list of users (replace with API call)
  useEffect(() => {
    const fetchUsers = () => {
      const registeredUsers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
      ];
      setUsers(registeredUsers);
    };

    fetchUsers();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!assignedTo) {
      alert('Please assign the task to a member.');
      return;
    }

    const newTask = {
      taskName,
      taskDescription,
      assignedTo,
      status,
    };

    console.log('New Task Created:', newTask);

    // Reset form
    setTaskName('');
    setTaskDescription('');
    setAssignedTo('');
    setStatus('Pending');
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h3>Create Task</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="taskName" className="form-label">
                Task Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="taskDescription" className="form-label">
                Task Description:
              </label>
              <textarea
                className="form-control"
                id="taskDescription"
                rows="3"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="assignedTo" className="form-label">
                Assign To:
              </label>
              <select
                className="form-select"
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select Member</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status:
              </label>
              <select
                className="form-select"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
