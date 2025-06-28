import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import BottomNavigation from '@/components/molecules/BottomNavigation';
import Loading from '@/components/ui/Loading';

const Layout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20 overflow-hidden">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;