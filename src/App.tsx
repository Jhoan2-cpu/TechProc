import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WebsitePage } from "./pages/website";
import { Preloader } from "./shared/components/Preloader";
import type { User } from "./shared/types/auth";
import { hasAccess } from "./shared/utils/auth";
import { authService } from "./services/authService";
import Layout from "./layouts/MainLayout";

// Protected Route Component
function ProtectedRoute({
  children,
  currentUser,
  requiredModule,
}: {
  children: React.ReactNode;
  currentUser: User | null;
  requiredModule?: string;
}) {
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
    const checkSession = () => {
      const token = sessionStorage.getItem("auth_token");
      const userStr = sessionStorage.getItem("user");
      if (token && userStr) {
        try {
          const user: User = JSON.parse(userStr);
          setCurrentUser(user);
          console.log("Sesión restaurada para el usuario:", user);
        } catch {
          authService.clearSession();
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      // Llamar a la API de logout
      await authService.logout();
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error al hacer logout:', error);
      // Continuar con el logout local incluso si falla la API
    } finally {
      // Limpiar sesión local y actualizar estado
      authService.clearSession();
      setCurrentUser(null);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter basename="/procesostecnologicos/web">
      <Routes>
        {/* Public Website Route */}

        <Route path="/website" element={<WebsitePage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/profile" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage onBackToLogin={() => {}} />
            )
          }
        />

        {/* Protected Routes - All app routes go through Layout */}
        <Route
          path="*"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Layout currentUser={currentUser!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
