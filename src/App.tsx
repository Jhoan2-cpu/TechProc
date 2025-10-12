import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WebsitePage } from './pages/website';
import { Preloader } from './shared/components/Preloader';
import type { User } from './shared/types/auth';
import { hasAccess } from './shared/utils/auth';
import { authService } from './services/authService';
import Layout from './layouts/MainLayout';

// Protected Route Component
function ProtectedRoute({ children, currentUser, requiredModule }: { children: React.ReactNode; currentUser: User | null; requiredModule?: string }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !hasAccess(currentUser, requiredModule)) {
    return <Navigate to="/" replace />;
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

        {/* Protected Admin Routes */}
        <Route path="/*" element={
          <ProtectedRoute currentUser={currentUser}>
            <Layout currentUser={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
