import React, { useState, useEffect } from 'react';

function AdminTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    taskID: null,
    title: '',
    assigneeID: '',
    deadline: '',
    description: '',
    status: 'Pending',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch tasks from the API
  useEffect(() => {
    fetch('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched tasks:', data); // Logs the API response
        setTasks(data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing task
      fetch(`https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks/${taskForm.taskID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskForm),
      })
        .then((response) => response.json())
        .then((updatedTask) => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.taskID === updatedTask.taskID ? updatedTask : task
            )
          );
        })
        .catch((error) => console.error('Error updating task:', error));
    } else {
      // Create new task
      fetch('https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskForm),
      })
        .then((response) => response.json())
        .then((newTask) => {
          setTasks((prevTasks) => [...prevTasks, newTask]);
        })
        .catch((error) => console.error('Error creating task:', error));
    }

    // Reset form and state
    setTaskForm({
      taskID: null,
      title: '',
      assigneeID: '',
      deadline: '',
      description: '',
      status: 'Pending',
    });
    setIsEditing(false);
  };

  const handleEdit = (task) => {
    setTaskForm(task);
    setIsEditing(true);
  };

  const handleDelete = (taskID) => {
    fetch(`https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/tasks/${taskID}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.taskID !== taskID));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary mb-4">Admin Task Manager</h2>

      {/* Task Form */}
      <form className="card shadow-sm mb-4 p-4" onSubmit={handleSubmit}>
        <h4 className="mb-3">{isEditing ? 'Edit Task' : 'Create Task'}</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskForm.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="assigneeID" className="form-label">
              Assignee ID
            </label>
            <input
              type="text"
              id="assigneeID"
              name="assigneeID"
              value={taskForm.assigneeID}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter assignee ID"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="deadline" className="form-label">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={taskForm.deadline}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={taskForm.status}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Task Description
            </label>
            <textarea
              id="description"
              name="description"
              value={taskForm.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{isEditing ? 'Update Task' : 'Create Task'}</button>
      </form>

      {/* Task List */}
      <div className="list-group">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.taskID} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p>{task.description}</p>
                <span>Status: {task.status}</span>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(task.taskID)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No tasks available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminTaskManager;
