import { useState } from 'react';
import { Users } from 'lucide-react';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import { useAuth } from '@/firebase/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';

// ✅ Define the user type
interface ChatUser {
  _id: string;
  displayName: string;
  email: string;
  image?: string;
}

const ChatUsersSidebar = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Explicitly type the state
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  // ✅ Fetch all chat users
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['chatUsers', dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/messages/get-users/${dbUser?._id}`
      );
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  const users: ChatUser[] = usersResponse?.data || [];

  const handleUserClick = (user: ChatUser) => {
    setSelectedUser(user);
    navigate(`user-chats/${user._id}`);
  };

  if (isLoading) {
    return <div className="p-5 text-center text-sm">Loading users...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 h-[calc(100vh-5rem)]">
      {/* ===== Sidebar ===== */}
      <aside className="col-span-1 h-full border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
        {/* === Header === */}
        <div className="border-b border-zinc-200 dark:border-zinc-700 p-5 flex items-center gap-2">
          <Users className="size-6 text-zinc-600 dark:text-zinc-300" />
          <span className="font-medium hidden lg:block text-zinc-800 dark:text-zinc-100">
            Contacts
          </span>
        </div>

        {/* === Users List === */}
        <div className="overflow-y-auto py-3 flex-1">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`w-full p-3 flex items-center gap-3 transition-colors
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                ${
                  selectedUser?._id === user._id
                    ? 'bg-zinc-200 dark:bg-zinc-800'
                    : ''
                }
              `}
            >
              {/* Avatar */}
              <div className="mx-auto lg:mx-0">
                <img
                  src={user.image || '/avatar.png'}
                  alt={user.displayName}
                  className="size-12 object-cover rounded-full"
                />
              </div>

              {/* Info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-zinc-800 dark:text-zinc-100">
                  {user.displayName}
                </div>
                <div className="text-sm text-zinc-500 truncate">
                  {user.email}
                </div>
              </div>
            </button>
          ))}

          {users.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      </aside>

      {/* ===== Chat Screen (Outlet) ===== */}
      <div className="col-span-2 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatUsersSidebar;
