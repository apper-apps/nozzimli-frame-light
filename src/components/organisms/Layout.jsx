import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/molecules/BottomNavigation';

const Layout = () => {
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