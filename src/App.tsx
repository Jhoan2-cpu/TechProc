import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { LMSMainPage } from './modules/lms/pages/LMSMainPage';
import { TicketsPage } from './modules/tickets/pages/TicketsPage';
import { TicketsMainPage } from './modules/tickets/pages/TicketsMainPage';
import {
  SecurityDashboardPage,
  SessionsPage,
  BlockedIPsPage,
  IncidentsPage,
  BackupsPage,
} from './modules/security/pages';
import { InfrastructurePage } from './modules/infrastructure/pages/InfrastructurePage';
import { InfrastructureMainPage } from './modules/infrastructure/pages/InfrastructureMainPage';
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
  faBars,
  faTimes,
  faKey,
  faHdd,
  faCog,
  faLaptop,
  faClipboardList,
  faInbox,
  faExchangeAlt,
  faUserCheck,
  faTasks,
  faTrophy,
  faFileAlt,
  faNewspaper,
  faBell,
  faBullhorn,
  faEnvelope,
  faRobot,
  faBookOpen,
  faUserGraduate,
  faChalkboardTeacher,
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
  const [expandedModules, setExpandedModules] = useState<string[]>(['lms', 'support', 'security', 'infrastructure', 'web', 'analytics']);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Redirigir automáticamente al primer módulo disponible si estamos en la raíz
  React.useEffect(() => {
    if (location.pathname === '/') {
      if (hasAccess(currentUser, 'users')) {
        navigate('/users', { replace: true });
      } else if (hasAccess(currentUser, 'lms')) {
        navigate('/lms-dashboard', { replace: true });
      } else if (hasAccess(currentUser, 'support')) {
        navigate('/tickets-dashboard', { replace: true});
      } else if (hasAccess(currentUser, 'security')) {
        navigate('/security-dashboard', { replace: true });
      } else if (hasAccess(currentUser, 'infrastructure')) {
        navigate('/infrastructure-dashboard', { replace: true });
      } else if (hasAccess(currentUser, 'web')) {
        navigate('/web-dashboard', { replace: true });
      } else if (hasAccess(currentUser, 'analytics')) {
        navigate('/analytics-dashboard', { replace: true });
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
    {
      id: 'lms',
      name: 'LMS',
      icon: faGraduationCap,
      submodules: [
        { id: 'lms-dashboard', name: 'Dashboard', icon: faTachometerAlt },
        { id: 'lms-courses', name: 'Cursos', icon: faBookOpen },
        { id: 'lms-students', name: 'Estudiantes', icon: faUserGraduate },
        { id: 'lms-instructors', name: 'Instructores', icon: faChalkboardTeacher },
      ],
    },
    {
      id: 'support',
      name: 'Soporte',
      icon: faTicket,
      submodules: [
        { id: 'tickets-dashboard', name: 'Dashboard', icon: faTachometerAlt },
        { id: 'tickets-my-tickets', name: 'Mis Tickets', icon: faClipboardList },
        { id: 'tickets-available', name: 'Disponibles', icon: faInbox },
        { id: 'tickets-escalations', name: 'Escalaciones', icon: faExchangeAlt },
      ],
    },
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
    {
      id: 'infrastructure',
      name: 'Infraestructura',
      icon: faServer,
      submodules: [
        { id: 'infrastructure-dashboard', name: 'Dashboard', icon: faTachometerAlt },
        { id: 'infrastructure-servers', name: 'Servidores', icon: faServer },
        { id: 'infrastructure-licenses', name: 'Licencias', icon: faKey },
        { id: 'infrastructure-storage', name: 'Almacenamiento', icon: faHdd },
        { id: 'infrastructure-software', name: 'Software', icon: faCog },
        { id: 'infrastructure-resources', name: 'Recursos', icon: faLaptop },
      ],
    },
    {
      id: 'web',
      name: 'Web',
      icon: faGlobe,
      submodules: [
        { id: 'web-dashboard', name: 'Dashboard', icon: faTachometerAlt },
        { id: 'web-news', name: 'Noticias', icon: faNewspaper },
        { id: 'web-alerts', name: 'Alertas', icon: faBell },
        { id: 'web-announcements', name: 'Anuncios', icon: faBullhorn },
        { id: 'web-contacts', name: 'Consultas', icon: faEnvelope },
        { id: 'web-chatbot', name: 'Chatbot', icon: faRobot },
      ],
    },
    {
      id: 'analytics',
      name: 'Analítica',
      icon: faChartLine,
      submodules: [
        { id: 'analytics-dashboard', name: 'Dashboard', icon: faChartLine },
        { id: 'analytics-attendance', name: 'Asistencia', icon: faUserCheck },
        { id: 'analytics-progress', name: 'Progreso', icon: faTasks },
        { id: 'analytics-performance', name: 'Rendimiento', icon: faTrophy },
        { id: 'analytics-dropout', name: 'Riesgo Deserción', icon: faExclamationTriangle },
        { id: 'analytics-reports', name: 'Reportes', icon: faFileAlt },
      ],
    },
  ];

  const currentPath = location.pathname.split('/')[1] || '';

  return (
    <div className="min-h-screen bg-secondary-50 flex animate-fade-in">
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 bg-primary-600 text-white p-3 rounded-r-[50%] shadow-lg hover:bg-primary-700 transition-all duration-300 ${
          isSidebarOpen ? 'left-[276px]' : 'left-4'
        }`}
        aria-label={isSidebarOpen ? 'Ocultar sidebar' : 'Mostrar sidebar'}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="text-lg" />
      </button>

      {/* Sidebar */}
      <aside className={`bg-white shadow-lg border-r border-secondary-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        isSidebarOpen ? 'w-72' : 'w-0 -translate-x-full'
      }`}>
        <div className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 flex flex-col h-full`}>
          {/* Logo */}
          <div className="p-6 border-b border-secondary-200 flex-shrink-0">
            <h1 className="text-2xl font-heading font-bold text-gradient">TechProc</h1>
            <p className="text-sm text-secondary-600 mt-1">Sistema Modular</p>
          </div>

        {/* User Info */}
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-br from-primary-50 to-accent-50 flex-shrink-0">
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
        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
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
                        // Navegar al dashboard del módulo
                        const dashboardSubmodule = module.submodules.find((sub: any) => sub.name === 'Dashboard');
                        if (dashboardSubmodule) {
                          handleModuleChange(dashboardSubmodule.id);
                        }
                        // Expandir/contraer el módulo
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
        <div className="p-4 border-t border-secondary-200 space-y-2 flex-shrink-0">
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen">
        <div className="p-14">
          <Routes>
            <Route path="/" element={
              <div className="flex items-center justify-center h-96">
                <h2 className="text-2xl text-secondary-600">Seleccione un módulo</h2>
              </div>
            } />
            <Route path="/profile" element={<ProfilePage user={currentUser} />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/pending-registrations" element={<PendingRegistrationsPage />} />
            <Route path="/lms-dashboard" element={<LMSMainPage />} />
            <Route path="/lms-courses" element={<LMSMainPage />} />
            <Route path="/lms-students" element={<LMSMainPage />} />
            <Route path="/lms-instructors" element={<LMSMainPage />} />
            <Route path="/tickets-dashboard" element={<TicketsMainPage />} />
            <Route path="/tickets-my-tickets" element={<TicketsMainPage />} />
            <Route path="/tickets-available" element={<TicketsMainPage />} />
            <Route path="/tickets-escalations" element={<TicketsMainPage />} />
            <Route path="/security-dashboard" element={<SecurityDashboardPage />} />
            <Route path="/security-sessions" element={<SessionsPage />} />
            <Route path="/security-blocked-ips" element={<BlockedIPsPage />} />
            <Route path="/security-incidents" element={<IncidentsPage />} />
            <Route path="/security-backups" element={<BackupsPage />} />
            <Route path="/infrastructure-dashboard" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-servers" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-licenses" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-storage" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-software" element={<InfrastructureMainPage />} />
            <Route path="/infrastructure-resources" element={<InfrastructureMainPage />} />
            <Route path="/web-dashboard" element={<WebPage />} />
            <Route path="/web-news" element={<WebPage />} />
            <Route path="/web-alerts" element={<WebPage />} />
            <Route path="/web-announcements" element={<WebPage />} />
            <Route path="/web-contacts" element={<WebPage />} />
            <Route path="/web-chatbot" element={<WebPage />} />
            <Route path="/analytics-dashboard" element={<AnalyticsPage />} />
            <Route path="/analytics-attendance" element={<AnalyticsPage />} />
            <Route path="/analytics-progress" element={<AnalyticsPage />} />
            <Route path="/analytics-performance" element={<AnalyticsPage />} />
            <Route path="/analytics-dropout" element={<AnalyticsPage />} />
            <Route path="/analytics-reports" element={<AnalyticsPage />} />
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
