import type { FC } from "react";
import { motion } from "framer-motion";
import ManageUsers from "./ManageUsers";
import Reports from "./Reports";
import Settings from "./Settings";

// 👇 Add a prop type to receive activeItem from parent (Dashboard)
interface AdminDashboardProps {
  activeItem: string;
}

const AdminDashboard: FC<AdminDashboardProps> = ({ activeItem }) => {
  // This is your teammate’s existing Overview section
  const OverviewSection = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">1,245</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-gray-600">Active Sellers</h3>
          <p className="text-3xl font-bold text-green-600">98</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-gray-600">Total Trades</h3>
          <p className="text-3xl font-bold text-yellow-600">3,452</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$85,420</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activities
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li>👤 New user registered: User #1023</li>
          <li>📘 Seller #45 added a new listing</li>
          <li>💰 Processed payout for Seller #21</li>
          <li>📊 Generated weekly reports</li>
        </ul>
      </div>
    </div>
  );

  // 👇 Conditionally render based on sidebar item clicked
  return (
    <div className="min-h-[70vh]">
      {activeItem === "Overview" && <OverviewSection />}
      {activeItem === "Manage Users" && <ManageUsers />}
      {activeItem === "Reports" && <Reports />}
      {activeItem === "Settings" && <Settings />}
    </div>
  );
};

export default AdminDashboard;
