import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WebsitePage } from './pages/website';
import { NotFoundPage } from './pages/NotFoundPage';
import { Preloader } from './shared/components/Preloader';
import type { User } from './shared/types/auth';
import { hasAccess } from './shared/utils/auth';
import { authService } from './services/authService';
import Layout from './layouts/MainLayout';

// Protected Route Component
function ProtectedRoute({ children, currentUser, requiredModule }: { children: React.ReactNode; currentUser: User | null; requiredModule?: string }) {
  if (!currentUser) {
    return <Navigate to="/website" replace />;
  }

  if (requiredModule && !hasAccess(currentUser, requiredModule)) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const checkSession = async () => {
      const startTime = Date.now();

      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        authService.clearSession();
      } finally {
        // Asegurar un tiempo mínimo de 500ms para el preloader
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(500 - elapsedTime, 0);

        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.clearSession();
    setCurrentUser(null);
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Route */}
        <Route path="/website" element={<WebsitePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={
          currentUser ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          currentUser ? <Navigate to="/" replace /> : <RegisterPage onBackToLogin={() => {}} />
        } />

        {/* Protected Routes with Layout */}
        <Route path="/profile" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/pending-registrations" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/lms-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/lms-courses" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/lms-students" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/lms-instructors" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/tickets-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/tickets-my-tickets" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/tickets-available" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/tickets-escalations" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-sessions" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-blocked-ips" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-blocked-users" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-incidents" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/security-backups" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/infrastructure-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/infrastructure-servers" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/infrastructure-licenses" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/infrastructure-storage" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/infrastructure-software" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-news" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-alerts" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-announcements" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-contacts" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/web-chatbot" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-attendance" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-progress" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-performance" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-dropout" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/analytics-reports" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Root redirect */}
        <Route path="/" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* 404 - Not Found (debe ser la última ruta) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
