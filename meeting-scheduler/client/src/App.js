import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import SpacesPage from './pages/SpacesPage';
import SpaceDetailPage from './pages/SpaceDetailPage';
import CalendarPage from './pages/CalendarPage';
import NotFoundPage from './pages/NotFoundPage';
import Sidebar from './components/Sidebar';
import GlobalNotificationWatcher from './components/GlobalNotificationWatcher';

// A simple guard: if there's no logged-in user, bounce back to login.
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  const isLoginPage = location.pathname === '/';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* This watches for upcoming meetings on EVERY page, not just Calendar */}
      <GlobalNotificationWatcher />

      {/* Sidebar only shows once logged in */}
      {!isLoginPage && user && <Sidebar />}

      <div style={{ flex: 1, overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/spaces" element={<ProtectedRoute><SpacesPage /></ProtectedRoute>} />
            <Route path="/spaces/:spaceId" element={<ProtectedRoute><SpaceDetailPage /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
