import axios from "axios";
import type { FC } from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminOverview: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://book-trading-club-backend.vercel.app/api/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
        <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-600">Active Sellers</h3>
        <p className="text-3xl font-bold text-green-600">
          {users.filter((user) => user.role === "seller").length}
        </p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-600">Total Trades</h3>
        <p className="text-3xl font-bold text-yellow-600">—</p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
        <p className="text-3xl font-bold text-purple-600">—</p>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
