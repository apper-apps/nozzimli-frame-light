import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/api/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Verify and refresh user data
        try {
          const currentUser = await userService.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          // If verification fails, clear stored data
          localStorage.removeItem('currentUser');
          setUser(null);
        }
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await userService.logout();
      setUser(null);
      setError(null);
      toast.success('Logged out successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Error during logout');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  const isVIP = () => {
    return user?.role === 'VIP' || user?.role === 'Admin';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated,
    isAdmin,
    isVIP,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;