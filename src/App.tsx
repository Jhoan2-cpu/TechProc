import { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { LMSMainPage } from './modules/lms/pages/LMSMainPage';
import { TicketsPage } from './modules/tickets/pages/TicketsPage';
import { SecurityPage } from './modules/security/pages/SecurityPage';
import { InfrastructurePage } from './modules/infrastructure/pages/InfrastructurePage';
import { WebPage } from './modules/web/pages/WebPage';
import { AnalyticsPage } from './modules/analytics/pages/AnalyticsPage';
import { UsersPage } from './modules/users/pages/UsersPage';
import { Preloader } from './shared/components/Preloader';
import type { User } from './shared/types/auth';
import { hasAccess } from './shared/utils/auth';
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
} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<string>('');

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Determinar el primer módulo disponible
    if (hasAccess(user, 'users')) setCurrentModule('users');
    else if (hasAccess(user, 'lms')) setCurrentModule('lms');
    else if (hasAccess(user, 'tickets')) setCurrentModule('tickets');
    else if (hasAccess(user, 'security')) setCurrentModule('security');
    else if (hasAccess(user, 'infrastructure')) setCurrentModule('infrastructure');
    else if (hasAccess(user, 'web')) setCurrentModule('web');
    else if (hasAccess(user, 'analytics')) setCurrentModule('analytics');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentModule('');
  };

  const handleModuleChange = (module: string) => {
    // El perfil está disponible para todos
    if (module === 'profile') {
      setCurrentModule(module);
    } else if (currentUser && hasAccess(currentUser, module)) {
      setCurrentModule(module);
    }
  };

  const renderModule = () => {
    if (!currentUser) return null;

    switch (currentModule) {
      case 'profile': return <ProfilePage user={currentUser} />;
      case 'users': return <UsersPage />;
      case 'lms': return <LMSMainPage />;
      case 'tickets': return <TicketsPage />;
      case 'security': return <SecurityPage />;
      case 'infrastructure': return <InfrastructurePage />;
      case 'web': return <WebPage />;
      case 'analytics': return <AnalyticsPage />;
      default: return (
        <div className="flex items-center justify-center h-96">
          <h2 className="text-2xl text-secondary-600">Seleccione un módulo</h2>
        </div>
      );
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  // Si no hay usuario logueado, mostrar página de login
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const modules = [
    { id: 'users', name: 'Gestión de Usuarios', icon: faUsers },
    { id: 'lms', name: 'LMS', icon: faGraduationCap },
    { id: 'tickets', name: 'Tickets', icon: faTicket },
    { id: 'security', name: 'Seguridad', icon: faLock },
    { id: 'infrastructure', name: 'Infraestructura', icon: faServer },
    { id: 'web', name: 'Web', icon: faGlobe },
    { id: 'analytics', name: 'Analítica', icon: faChartLine },
  ];

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
            {modules.map((module) => {
              if (!hasAccess(currentUser, module.id)) return null;

              const isActive = currentModule === module.id;

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  }`}
                >
                  <FontAwesomeIcon icon={module.icon} className="text-lg" />
                  <span className="font-medium">{module.name}</span>
                </button>
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
              currentModule === 'profile'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                : 'text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
            <span className="font-medium">Mi Perfil</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
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
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

export default App;
