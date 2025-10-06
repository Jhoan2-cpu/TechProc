import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { LMSMainPage } from './modules/lms/pages/LMSMainPage';
import { TicketsPage } from './modules/tickets/pages/TicketsPage';
import {
  SecurityDashboardPage,
  SessionsPage,
  BlockedIPsPage,
  IncidentsPage,
  BackupsPage,
} from './modules/security/pages';
import { InfrastructurePage } from './modules/infrastructure/pages/InfrastructurePage';
import { WebPage } from './modules/web/pages/WebPage';
import { AnalyticsPage } from './modules/analytics/pages/AnalyticsPage';
import { UsersPage } from './modules/users/pages/UsersPage';
import { PendingRegistrationsPage } from './modules/users/pages/PendingRegistrationsPage';
import { Preloader } from './shared/components/Preloader';
import type { User } from './shared/types/auth';
import { hasAccess } from './shared/utils/auth';
import { authService } from './services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faGraduationCap,
  faTicket,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faRightFromBracket,
  faUserCircle,
  faUserClock,
  faTachometerAlt,
  faUsersViewfinder,
  faBan,
  faExclamationTriangle,
  faFileArchive,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

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

// Layout Component
function Layout({ currentUser, onLogout }: { currentUser: User; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<string[]>(['security']);

  // Redirigir automáticamente al primer módulo disponible si estamos en la raíz
  React.useEffect(() => {
    if (location.pathname === '/') {
      if (hasAccess(currentUser, 'users')) {
        navigate('/users', { replace: true });
      } else if (hasAccess(currentUser, 'lms')) {
        navigate('/lms', { replace: true });
      } else if (hasAccess(currentUser, 'tickets')) {
        navigate('/tickets', { replace: true });
      } else if (hasAccess(currentUser, 'security')) {
        navigate('/security-dashboard', { replace: true });
      } else if (hasAccess(currentUser, 'infrastructure')) {
        navigate('/infrastructure', { replace: true });
      } else if (hasAccess(currentUser, 'web')) {
        navigate('/web', { replace: true });
      } else if (hasAccess(currentUser, 'analytics')) {
        navigate('/analytics', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [location.pathname, currentUser, navigate]);

  const handleModuleChange = (module: string) => {
    navigate(`/${module}`);
  };

  const modules = [
    { id: 'users', name: 'Gestión de Usuarios', icon: faUsers },
    { id: 'pending-registrations', name: 'Solicitudes de Registro', icon: faUserClock },
    { id: 'lms', name: 'LMS', icon: faGraduationCap },
    { id: 'tickets', name: 'Tickets', icon: faTicket },
    {
      id: 'security',
      name: 'Seguridad',
      icon: faLock,
      submodules: [
        { id: 'security-dashboard', name: 'Dashboard', icon: faTachometerAlt },
        { id: 'security-sessions', name: 'Sesiones Activas', icon: faUsersViewfinder },
        { id: 'security-blocked-ips', name: 'IPs Bloqueadas', icon: faBan },
        { id: 'security-incidents', name: 'Incidentes', icon: faExclamationTriangle },
        { id: 'security-backups', name: 'Backups', icon: faFileArchive },
      ],
    },
    { id: 'infrastructure', name: 'Infraestructura', icon: faServer },
    { id: 'web', name: 'Web', icon: faGlobe },
    { id: 'analytics', name: 'Analítica', icon: faChartLine },
  ];

  const currentPath = location.pathname.split('/')[1] || '';

  return (
    <div className="min-h-screen bg-secondary-50 flex animate-fade-in">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg border-r border-secondary-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-secondary-200">
          <h1 className="text-2xl font-heading font-bold text-gradient">TechProc</h1>
          <p className="text-sm text-secondary-600 mt-1">Sistema Modular</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-secondary-900">{currentUser.name}</p>
              <p className="text-xs text-secondary-600">{currentUser.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3 px-3">
            Módulos
          </p>
          <div className="space-y-1">
            {modules.map((module: any) => {
              if (!hasAccess(currentUser, module.id)) return null;

              const isActive = currentPath === module.id;
              const isExpanded = expandedModules.includes(module.id);
              const hasSubmodules = module.submodules && module.submodules.length > 0;

              return (
                <div key={module.id}>
                  <button
                    onClick={() => {
                      if (hasSubmodules) {
                        setExpandedModules((prev) =>
                          prev.includes(module.id)
                            ? prev.filter((id) => id !== module.id)
                            : [...prev, module.id]
                        );
                      } else {
                        handleModuleChange(module.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive && !hasSubmodules
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-secondary-700 hover:bg-secondary-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={module.icon} className="text-lg" />
                    <span className="font-medium flex-1 text-left">{module.name}</span>
                    {hasSubmodules && (
                      <FontAwesomeIcon
                        icon={isExpanded ? faChevronDown : faChevronRight}
                        className="text-sm"
                      />
                    )}
                  </button>

                  {/* Submódulos */}
                  {hasSubmodules && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {module.submodules.map((submodule: any) => {
                        const isSubActive = currentPath === submodule.id;
                        return (
                          <button
                            key={submodule.id}
                            onClick={() => handleModuleChange(submodule.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isSubActive
                                ? 'bg-gradient-primary text-white shadow-md'
                                : 'text-secondary-600 hover:bg-secondary-100'
                            }`}
                          >
                            <FontAwesomeIcon icon={submodule.icon} />
                            <span className="font-medium">{submodule.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-4 border-t border-secondary-200 space-y-2">
          {/* Profile Button */}
          <button
            onClick={() => handleModuleChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentPath === 'profile'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                : 'text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
            <span className="font-medium">Mi Perfil</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={
              <div className="flex items-center justify-center h-96">
                <h2 className="text-2xl text-secondary-600">Seleccione un módulo</h2>
              </div>
            } />
            <Route path="/profile" element={<ProfilePage user={currentUser} />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/pending-registrations" element={<PendingRegistrationsPage />} />
            <Route path="/lms" element={<LMSMainPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/security-dashboard" element={<SecurityDashboardPage />} />
            <Route path="/security-sessions" element={<SessionsPage />} />
            <Route path="/security-blocked-ips" element={<BlockedIPsPage />} />
            <Route path="/security-incidents" element={<IncidentsPage />} />
            <Route path="/security-backups" element={<BackupsPage />} />
            <Route path="/infrastructure" element={<InfrastructurePage />} />
            <Route path="/web" element={<WebPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const checkSession = async () => {
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
        // Simular carga inicial
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
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
        <Route path="/login" element={
          currentUser ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          currentUser ? <Navigate to="/" replace /> : <RegisterPage onBackToLogin={() => {}} />
        } />
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
