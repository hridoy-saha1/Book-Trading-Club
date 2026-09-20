import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiPlus, FiLogOut, FiSun, FiMoon, FiHeart, FiBell, FiX } from "react-icons/fi";
import NavLogo from "./NavLogo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useAuth } from "./../../firebase/AuthProvider";
import notify from "@/lib/notify";

export default function Navbar() {
  const { user, signOutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      notify.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      notify.error(`Logout failed: ${error.message}`);
    }
  };

  const isAuthenticated = !!user;

  // Notifications state
  type Notice = {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    ts: number;
  };
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { type: Notice["type"]; message: string; ts: number }
        | undefined;
      if (!detail) return;
      setNotices((prev) =>
        [
          {
            id: `${detail.ts}-${Math.random().toString(36).slice(2)}`,
            ...detail,
          },
          ...prev,
        ].slice(0, 10)
      );
    };
    window.addEventListener("app:notify", handler as EventListener);
    return () =>
      window.removeEventListener("app:notify", handler as EventListener);
  }, []);

  const unreadCount = useMemo(() => notices.length, [notices]);

  // Theme toggle
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Active link styling
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 
   ${
     isActive
       ? "text-black dark:text-white"
       : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
   }
   after:content-[''] after:absolute after:left-0 after:bottom-0 
   after:h-[2px] after:transition-all after:duration-300 
   ${
     isActive
       ? "after:w-full after:bg-black dark:after:bg-white"
       : "after:w-0 after:bg-black dark:after:bg-white hover:after:w-full"
   }`;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-600 backdrop-blur border-b border-gray-200 dark:border-gray-600 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <NavLogo />
          </div>

          {/* Center Navigation & Search */}
          <div className="hidden md:flex flex-1 px-6 items-center justify-center gap-6">
            <nav className="flex gap-4">
              <NavLink to="/" className={linkClasses}>
                Home
              </NavLink>
              <NavLink to="/browse" className={linkClasses}>
                Browse
              </NavLink>
              <NavLink to="/around-me" className={linkClasses}>
                AroundMe
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/wishlist" className={linkClasses}>
                  <div className="flex items-center gap-1">
                    <FiHeart className="w-4 h-4" />
                    <span>Favourite</span>
                  </div>
                </NavLink>
              )}
              <NavLink to="/about" className={linkClasses}>
                About
              </NavLink>
              <NavLink to="/contact" className={linkClasses}>
                Contact
              </NavLink>
            </nav>

            {isAuthenticated && (
              <div className="w-full max-w-lg ml-6">
                <SearchBar />
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {theme === "light" ? (
                <FiMoon className="h-5 w-5 text-gray-800" />
              ) : (
                <FiSun className="h-5 w-5 text-primary" />
              )}
            </button>
                        {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="text-gray-700 dark:text-gray-300">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md bg-primary text-white dark:text-black hover:bg-primary-dark transition"
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 relative">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      aria-label="Notifications"
                      className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => setNotifOpen((v) => !v)}
                    >
                      <FiBell className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                          {Math.min(unreadCount, 9)}
                          {unreadCount > 9 ? "+" : ""}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Notifications
                          </span>
                          <button
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={() => setNotices([])}
                          >
                            Clear all
                          </button>
                        </div>
                        <ul className="max-h-80 overflow-auto">
                          {notices.length === 0 ? (
                            <li className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                              No notifications yet
                            </li>
                          ) : (
                            notices.map((n) => (
                              <li
                                key={n.id}
                                className="px-4 py-3 flex items-start gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              >
                                <span
                                  className={`mt-0.5 inline-block h-2 w-2 rounded-full ${
                                    n.type === "success"
                                      ? "bg-green-500"
                                      : n.type === "error"
                                      ? "bg-red-500"
                                      : n.type === "warning"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }`}
                                ></span>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-800 dark:text-gray-200">
                                    {n.message}
                                  </div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                    {new Date(n.ts).toLocaleTimeString()}
                                  </div>
                                </div>
                                <button
                                  className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                                  onClick={() =>
                                    setNotices((prev) => prev.filter((x) => x.id !== n.id))
                                  }
                                >
                                  <FiX className="h-4 w-4" />
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* User Menu */}
                  <UserMenu />
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6 text-gray-800 dark:text-gray-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 space-y-2 transition">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/browse" className={linkClasses}>
            Browse
          </NavLink>
          <NavLink to="/around-me" className={linkClasses}>
            AroundMe
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/wishlist" className={linkClasses}>
              <div className="flex items-center gap-2">
                <FiHeart className="w-4 h-4" />
                <span>Favourite</span>
              </div>
            </NavLink>
          )}
          <NavLink to="/about" className={linkClasses}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClasses}>
            Contact
          </NavLink>

          {isAuthenticated ? (
            <>
              <Link
                to="/add-book"
                className="w-full inline-flex gap-2 items-center justify-center mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                <FiPlus />
                <span>Add Book</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 mt-3">
              <NavLink to="/login" className="text-gray-700 dark:text-gray-300">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 bg-primary text-white dark:text-black rounded-md hover:bg-primary-dark"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

