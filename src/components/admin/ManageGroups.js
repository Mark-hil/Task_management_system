import React, { useState } from 'react';

function ManageGroups() {
  // State to hold the list of groups
  const [groups, setGroups] = useState(['Group A', 'Group B', 'Group C']); // Example initial groups
  const [newGroup, setNewGroup] = useState(''); // State for new group input

  // Function to handle adding a new group
  const handleAddGroup = () => {
    if (newGroup.trim()) {
      setGroups([...groups, newGroup]);  // Add new group to the list
      setNewGroup('');  // Reset the input field
    }
  };

  // Function to handle deleting a group
  const handleDeleteGroup = (groupToDelete) => {
    setGroups(groups.filter((group) => group !== groupToDelete));  // Remove group from the list
  };

  return (
    <div>
      <h3>Manage Groups</h3>
      
      {/* Create Group Input */}
      <div>
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)} // Update the state with input value
          placeholder="Enter new group name"
        />
        <button onClick={handleAddGroup}>Create Group</button>
      </div>
      
      {/* List of Groups */}
      <ul>
        {groups.map((group, index) => (
          <li key={index}>
            {group}
            <button onClick={() => handleDeleteGroup(group)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageGroups;
