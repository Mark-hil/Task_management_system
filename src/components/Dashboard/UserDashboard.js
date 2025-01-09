import React, { useState } from 'react';

function UserDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Backend Setup', assignee: 'John Doe', dueDate: '2025-01-10', status: 'Pending' },
    { id: 2, title: 'Design Login Page', assignee: 'Jane Smith', dueDate: '2025-01-12', status: 'Pending' },
  ]);

  const [user] = useState({ name: 'John Doe' }); // Example user data

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-primary">Welcome, {user.name}!</h2>
        <p className="lead">Here are your assigned tasks:</p>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Your Tasks</h3>
          {tasks.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Task Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.status}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted mt-3">You have no tasks assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
