import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import BottomNavigation from '@/components/molecules/BottomNavigation';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Layout = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        toast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
      }
    }
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logout */}
      <header className="bg-surface border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName || user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'VIP' ? '👑 VIP Member' : '🌸 Free Member'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Logout"
        >
          <ApperIcon name="LogOut" size={20} />
        </button>
      </header>

      <main className="flex-1 pb-20 overflow-hidden">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;