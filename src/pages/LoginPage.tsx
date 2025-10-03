import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faShieldHalved,
  faServer,
  faChartLine,
  faCode,
  faGraduationCap,
  faGlobe,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../shared/types/auth';
import { MOCK_USERS, MODULE_ACCESS } from '../shared/types/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegisterClick?: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user) {
      onLogin(user);
      // Redirigir al primer módulo disponible según los permisos del usuario
      const userModules = MODULE_ACCESS[user.role];
      if (userModules.includes('users')) {
        navigate('/users');
      } else if (userModules.includes('lms')) {
        navigate('/lms');
      } else if (userModules.includes('tickets')) {
        navigate('/tickets');
      } else if (userModules.includes('security')) {
        navigate('/security');
      } else if (userModules.includes('infrastructure')) {
        navigate('/infrastructure');
      } else if (userModules.includes('web')) {
        navigate('/web');
      } else if (userModules.includes('analytics')) {
        navigate('/analytics');
      } else {
        navigate('/profile');
      }
    } else {
      alert('Usuario no encontrado');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const userCards = [
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Acceso total al sistema',
      color: 'from-red-500 to-red-700',
      icon: faShieldHalved,
    },
    {
      value: 'lms',
      label: 'Gestor LMS',
      description: 'Gestión del sistema de aprendizaje',
      color: 'from-blue-500 to-blue-700',
      icon: faGraduationCap,
    },
    {
      value: 'seg',
      label: 'Soporte - Seguridad',
      description: 'Tickets y seguridad',
      color: 'from-purple-500 to-purple-700',
      icon: faLock,
    },
    {
      value: 'infra',
      label: 'Soporte - Infraestructura',
      description: 'Tickets e infraestructura',
      color: 'from-green-500 to-green-700',
      icon: faServer,
    },
    {
      value: 'web',
      label: 'Developer Web',
      description: 'Gestión web y tickets',
      color: 'from-orange-500 to-orange-700',
      icon: faGlobe,
    },
    {
      value: 'data',
      label: 'Analista de Datos',
      description: 'Analítica y reportes',
      color: 'from-cyan-500 to-cyan-700',
      icon: faChartLine,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <div className="inline-block p-4 bg-gradient-primary rounded-2xl shadow-lg mb-6">
            <FontAwesomeIcon icon={faCode} className="text-white text-5xl" />
          </div>
          <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
            TechProc
          </h1>
          <p className="text-secondary-600 text-lg font-medium">
            Sistema de Gestión Modular
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* User Selection Cards */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-heading font-semibold text-center text-secondary-800 mb-6">
            Seleccione su perfil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCards.map((userType, index) => (
              <div
                key={userType.value}
                className={`card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  username === userType.value
                    ? 'ring-4 ring-primary-500 shadow-2xl'
                    : 'hover:shadow-2xl'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => setUsername(userType.value)}
                onMouseEnter={() => setHoveredUser(userType.value)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${userType.color} flex items-center justify-center flex-shrink-0 transform transition-transform duration-300 ${
                      hoveredUser === userType.value || username === userType.value
                        ? 'rotate-6 scale-110'
                        : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={userType.icon} className="text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg text-secondary-900 mb-1">
                      {userType.label}
                    </h3>
                    <p className="text-secondary-600 text-sm">
                      {userType.description}
                    </p>
                  </div>
                  {username === userType.value && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center animate-scale-in">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Button */}
        <div className="text-center animate-slide-up">
          <button
            onClick={handleLogin}
            disabled={!username}
            className={`btn btn-primary px-12 py-4 text-lg font-semibold rounded-full shadow-xl ${
              !username
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-2xl hover:scale-105'
            } inline-flex items-center gap-3`}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Iniciar Sesión</span>
            <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-secondary-500 text-sm animate-fade-in">
          <p>Seleccione su tipo de usuario para acceder al sistema</p>
          <div className="mt-4">
            <span className="text-secondary-600">¿No tienes cuenta? </span>
            <button
              onClick={handleRegisterClick}
              className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
            >
              Solicita tu registro aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
