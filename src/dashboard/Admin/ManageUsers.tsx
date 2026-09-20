import React from "react";

const ManageUsers: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Manage Users</h2>
      <p className="text-gray-600 mb-6">
        Here admin can view, promote, or remove users.
      </p>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>👥 User management table will go here.</p>
      </div>
    </div>
  );
};

export default ManageUsers;
