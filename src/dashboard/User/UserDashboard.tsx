import type { FC } from "react";
import { motion } from "framer-motion";

const UserDashboard: FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Your Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className=" p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Books Owned</h3>
          <p className="text-3xl font-bold text-indigo-600">24</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Active Trades</h3>
          <p className="text-3xl font-bold text-green-600">6</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Wishlist Items</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Trades</h3>
          <p className="text-3xl font-bold text-purple-600">32</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
        <ul className="space-y-3 text-gray-700">
          <li>📘 You added a new book: *Clean Code*</li>
          <li>🔄 Trade request accepted with User #45</li>
          <li>💖 Added *The Pragmatic Programmer* to wishlist</li>
          <li>📦 Trade #12 completed successfully</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
