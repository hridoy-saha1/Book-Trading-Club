import { useState } from "react";
import {
  FiHome,
  FiBook,
  FiRepeat,
  FiHeart,
  FiSettings,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiPlusCircle,
  FiMessageSquare,
} from "react-icons/fi";
import AdminDashboard from "./Admin/AdminDashboard";
import SellerDashboard from "./Seller/SellerDashboard";
import UserDashboard from "./User/UserDashboard";
import { Link } from "react-router";

function Dashboard() {
  const [role, setRole] = useState<"user" | "seller" | "admin">("user");
  const [activeItem, setActiveItem] = useState("Overview");

  const getSidebarItems = () => {
    if (role === "admin") {
      return [
        { name: "Overview", icon: <FiHome /> },
        { name: "Manage Users", icon: <FiBook /> },
        { name: "Reports", icon: <FiBarChart2 /> },
        { name: "Settings", icon: <FiSettings /> },
      ];
    }

    if (role === "seller") {
      return [
        { name: "Overview", icon: <FiHome /> },
        { name: "My Listings", icon: <FiPackage /> },
        { name: "Add Book", icon: <FiPlusCircle />, link: "/add-book" },
        { name: "Orders", icon: <FiShoppingCart /> },
        { name: "Buyer Requests", icon: <FiMessageSquare /> },
        { name: "Analytics", icon: <FiBarChart2 /> },
        { name: "Settings", icon: <FiSettings /> },
      ];
    }

    // Default for "user"
    return [
      { name: "Overview", icon: <FiHome /> },
      { name: "My Books", icon: <FiBook /> },
      { name: "My Trades", icon: <FiRepeat /> },
      { name: "Favourite Books", icon: <FiHeart /> },
      { name: "Settings", icon: <FiSettings /> },
    ];
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8 tracking-wide">ShelfShare</h2>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) =>
              item.link ? (
                <Link
                  to={item.link}
                  key={item.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.name
                      ? "bg-white text-black bg-opacity-20 shadow-md"
                      : "hover:bg-white hover:text-black hover:bg-opacity-10"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.name
                      ? "bg-white text-black bg-opacity-20 shadow-md"
                      : "hover:bg-white hover:text-black hover:bg-opacity-10"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Role Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full shadow-lg overflow-hidden border border-gray-300 bg-white">
            {["user", "seller", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r as any)}
                className={`px-8 py-3 font-medium transition-colors duration-300 ${
                  role === r
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard View */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          {role === "admin" && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Welcome, Admin 👑
              </h2>
              <p className="text-gray-600 ">
                Here you can manage users, view reports, and configure settings.
              </p>
              <AdminDashboard activeItem={activeItem} />

            </div>
          )}

          {role === "user" && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Welcome, User 👤
              </h2>
              <p className="text-gray-600 mb-6">
                Here you can view your books, trades, and favourite books.
              </p>
              <UserDashboard></UserDashboard>
            </div>
          )}

          {role === "seller" && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Welcome, Seller 🛒
              </h2>
              <p className="text-gray-600">
                Manage your book listings, view orders, and track analytics.
              </p>
              <SellerDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
