// DashboardLayout.tsx (large project)
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/pages/Dashboards/User/AppSidebar';
import NavbarDashboard from '@/pages/Dashboards/Shared/NavbarDashboard';
import { Outlet } from 'react-router';
import { useAuth } from '@/firebase/AuthProvider';
import AdminSidebar from '@/pages/Dashboards/Admin/AdminSidebar';

export default function DashboardLayout() {
  const { dbUser } = useAuth();
  // console.log(user, dbUser);
  return (
    <div className="flex">
      <SidebarProvider>
        {dbUser?.role == 'user' && <AppSidebar />}
        {dbUser?.role == 'admin' && <AdminSidebar />}

        <main className="w-full">
          <NavbarDashboard />
          <div className="px-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
