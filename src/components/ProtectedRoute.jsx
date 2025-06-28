import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children, requireVIP = false, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isVIP, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check VIP requirement
  if (requireVIP && !isVIP()) {
    return <Navigate to="/settings" replace />;
  }

  // Check Admin requirement
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;