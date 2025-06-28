import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthProvider from '@/contexts/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/organisms/Layout';
import Home from '@/components/pages/Home';
import Tasks from '@/components/pages/Tasks';
import CareSpace from '@/components/pages/CareSpace';
import Affirmations from '@/components/pages/Affirmations';
import Settings from '@/components/pages/Settings';
import VIPFeatures from '@/components/pages/VIPFeatures';
import Login from '@/components/pages/Login';

function App() {
return (
    <div dir="ltr" className="min-h-screen bg-background">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="carespace" element={
                <ProtectedRoute>
                  <CareSpace />
                </ProtectedRoute>
              } />
              <Route path="affirmations" element={
                <ProtectedRoute>
                  <Affirmations />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="vip-features" element={
                <ProtectedRoute requireVIP={true}>
                  <VIPFeatures />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AuthProvider>
<ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </Router>
    </div>
  );
}

export default App;