import React from 'react';

function ManageUsers() {
  const users = [
    { id: 1, username: 'john_doe', role: 'user' },
    { id: 2, username: 'admin_user', role: 'admin' },
    // Add more users as necessary
  ];

  return (
    <div>
      <h3>Manage Users</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;
