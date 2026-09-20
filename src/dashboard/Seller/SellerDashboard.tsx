import type { FC } from "react";
import { motion } from "framer-motion";

const SellerDashboard: FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Seller Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Listings</h3>
          <p className="text-3xl font-bold text-indigo-600">42</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Active Orders</h3>
          <p className="text-3xl font-bold text-green-600">18</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$4,250</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
        <ul className="space-y-3 text-gray-700">
          <li>📘 Added a new listing: *JavaScript: The Good Parts*</li>
          <li>🛒 Order #302 confirmed by Buyer #112</li>
          <li>💰 Earned $120 from Order #298</li>
          <li>📦 Order #310 is awaiting shipment</li>
        </ul>
      </div>
    </div>
  );
};

export default SellerDashboard;
