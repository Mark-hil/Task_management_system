import React from 'react';

function Dashboard({ role }) {
  return (
    <div>
      {role === 'admin' ? (
        <div>Admin Dashboard</div>
      ) : (
        <div>Member Dashboard</div>
      )}
    </div>
  );
}

export default Dashboard;
