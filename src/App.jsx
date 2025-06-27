import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Home from '@/components/pages/Home';
import Tasks from '@/components/pages/Tasks';
import CareSpace from '@/components/pages/CareSpace';
import Affirmations from '@/components/pages/Affirmations';
import Settings from '@/components/pages/Settings';

function App() {
  return (
    <div dir="ltr" className="min-h-screen bg-background">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="carespace" element={<CareSpace />} />
            <Route path="affirmations" element={<Affirmations />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
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