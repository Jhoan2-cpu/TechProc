import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faCode,
  faArrowRight,
  faSpinner,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faGraduationCap,
  faServer,
  faGlobe,
  faChartLine,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import type { User, UserRole } from '../shared/types/auth';
import { authService } from '../services/authService';
import { MODULE_ACCESS } from '../shared/types/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type UserCardType = {
  value: UserRole;
  label: string;
  description: string;
  color: string;
  icon: any;
  suggestedEmail: string;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [selectedProfile, setSelectedProfile] = useState<UserCardType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const userCards: UserCardType[] = [
    {
      value: 'administrador',
      label: 'Administrador',
      description: 'Acceso total al sistema',
      color: 'from-red-500 to-red-700',
      icon: faShieldHalved,
      suggestedEmail: 'admin@techproc.com',
    },
    {
      value: 'gestor_lms',
      label: 'Gestor LMS',
      description: 'Gestión del sistema de aprendizaje',
      color: 'from-blue-500 to-blue-700',
      icon: faGraduationCap,
      suggestedEmail: 'lms@techproc.com',
    },
    {
      value: 'soporte_seguridad',
      label: 'Soporte - Seguridad',
      description: 'Tickets y seguridad',
      color: 'from-purple-500 to-purple-700',
      icon: faLock,
      suggestedEmail: 'security@techproc.com',
    },
    {
      value: 'soporte_infraestructura',
      label: 'Soporte - Infraestructura',
      description: 'Tickets e infraestructura',
      color: 'from-green-500 to-green-700',
      icon: faServer,
      suggestedEmail: 'infra@techproc.com',
    },
    {
      value: 'developer_web',
      label: 'Developer Web',
      description: 'Gestión web y tickets',
      color: 'from-orange-500 to-orange-700',
      icon: faGlobe,
      suggestedEmail: 'web@techproc.com',
    },
    {
      value: 'analista_datos',
      label: 'Analista de Datos',
      description: 'Analítica y reportes',
      color: 'from-cyan-500 to-cyan-700',
      icon: faChartLine,
      suggestedEmail: 'data@techproc.com',
    },
  ];

  // Seleccionar perfil y pasar a login
  const handleSelectProfile = (profile: UserCardType) => {
    setSelectedProfile(profile);
    setEmail(profile.suggestedEmail);
    setStep('login');
    setError('');
  };

  // Volver a selección de perfil
  const handleBackToSelection = () => {
    setStep('select');
    setSelectedProfile(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingrese un email válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });

      // Guardar sesión
      authService.saveSession(response.token, response.refreshToken);

      // Notificar al componente padre
      onLogin(response.user);

      // Redirigir al primer módulo disponible según los permisos del usuario
      const userModules = MODULE_ACCESS[response.user.role];
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
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Vista de selección de perfil
  if (step === 'select') {
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
                  className="card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  onClick={() => handleSelectProfile(userType)}
                  onMouseEnter={() => setHoveredUser(userType.value)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${userType.color} flex items-center justify-center flex-shrink-0 transform transition-transform duration-300 ${
                        hoveredUser === userType.value ? 'rotate-6 scale-110' : ''
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
                    <div className="w-6 h-6 rounded-full border-2 border-secondary-300 flex items-center justify-center transition-colors">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className={`text-xs transition-all duration-300 ${
                          hoveredUser === userType.value
                            ? 'text-primary-600 translate-x-0.5'
                            : 'text-secondary-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-secondary-500 text-sm animate-fade-in">
            <p>Seleccione su tipo de usuario para continuar</p>
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
  }

  // Vista de login (formulario)
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
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

        {/* Login Form */}
        <div className="card p-8 animate-slide-up">
          {/* Selected Profile Header */}
          {selectedProfile && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedProfile.color} flex items-center justify-center flex-shrink-0`}
              >
                <FontAwesomeIcon icon={selectedProfile.icon} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-secondary-900">
                  {selectedProfile.label}
                </h3>
                <p className="text-xs text-secondary-600">{selectedProfile.description}</p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-heading font-bold text-center text-secondary-900 mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-secondary-400"
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input pl-12 w-full"
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-secondary-400"
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-12 pr-12 w-full"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn btn-primary py-3 text-lg font-semibold rounded-lg shadow-lg ${
                loading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-xl hover:scale-[1.02]'
              } inline-flex items-center justify-center gap-3 transition-all duration-200`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToSelection}
              disabled={loading}
              className="w-full btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 py-2 text-sm rounded-lg inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Cambiar perfil</span>
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold mb-2">
              📝 Credenciales de prueba para este perfil:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Email: {selectedProfile?.suggestedEmail}</p>
              <p>• Contraseña: {selectedProfile?.value === 'administrador' ? 'admin123' :
                               selectedProfile?.value === 'gestor_lms' ? 'lms123' :
                               selectedProfile?.value === 'soporte_seguridad' ? 'security123' :
                               selectedProfile?.value === 'soporte_infraestructura' ? 'infra123' :
                               selectedProfile?.value === 'developer_web' ? 'web123' : 'data123'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-secondary-500 text-sm animate-fade-in">
          <p>¿No tienes cuenta?</p>
          <button
            onClick={handleRegisterClick}
            className="mt-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
            disabled={loading}
          >
            Solicita tu registro aquí
          </button>
        </div>
      </div>
    </div>
  );
};
