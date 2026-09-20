import React from "react";

const Reports: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Reports</h2>
      <p className="text-gray-600 mb-6">
        Here admin can see platform analytics and statistics.
      </p>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>📊 Charts or data summaries will appear here.</p>
      </div>
    </div>
  );
};

export default Reports;
