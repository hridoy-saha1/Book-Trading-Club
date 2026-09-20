import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './../../firebase/AuthProvider';
import {
  FiHeart,
  FiMail,
  FiBell,
  FiLogOut,
  FiUser,
  FiSettings,
  FiBook,
} from 'react-icons/fi';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, signOutUser } = useAuth();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      alert('Logged out successfully');
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Profile button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white dark:bg-gold dark:text-black shadow-[0_0_8px_var(--ai-soft)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {' '}
        <img src="../../assests/photo/user.png" alt="" />
        <span className="font-semibold">
          {user?.email?.[0].toUpperCase() || ''}
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white/70 dark:border-bg-card  dark:bg-gray-400/80 dark:text-white text-text-main  shadow-lg z-50"
        >
          {/* User info */}
          <div className="px-4 py-2 text-sm text-gray-600 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-700">
            {user?.email}
          </div>

          {/* Menu items */}
          <div className="flex flex-col ">
            {[
              { to: '/wishlist', label: 'Favourite Books', icon: <FiHeart /> },
              {
                to: '/messages',
                label: 'Messages',
                icon: <FiMail />,
                badge: 3,
              },
              {
                to: '/notifications',
                label: 'Notifications',
                icon: <FiBell />,
                badge: 5,
              },
              { to: '/dashboard', label: 'Dashboard', icon: <FiBook /> },
              {
                to: '/dashboard/myProfile',
                label: 'My Profile',
                icon: <FiUser />,
              },
              { to: '/settings', label: 'Settings', icon: <FiSettings /> },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center gap-2  px-4 py-2 hover:bg-ai-soft/20 dark:hover:bg-primary-dark/40 transition rounded relative dark:text-white "
              >
                {item.icon} {item.label}
                {item.badge && (
                  <span className="absolute right-4 inline-flex h-4 w-4 items-center justify-center dark:text-white rounded-full bg-error text-white text-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-left text-error hover:bg-ai-soft/20 dark:hover:bg-primary-dark/40 dark:text-white transition rounded"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
