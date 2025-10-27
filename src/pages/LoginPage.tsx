import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
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
  faTicket,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import type { User, UserRole } from '../shared/types/auth';
import { authService } from '../services/authService';
import { Preloader } from '../shared/components/Preloader';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type UserCardType = {
  value: UserRole;
  label: string;
  description: string;
  color: string;
  icon: IconDefinition;
  suggestedEmail: string;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [step, setStep] = useState<'select' | 'loading' | 'login'>('select');
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
      value: 'admin',
      label: 'Administrador',
      description: 'Acceso total al sistema',
      color: 'from-red-500 to-red-700',
      icon: faShieldHalved,
      suggestedEmail: 'admin@techproc.com',
    },
    {
      value: 'lms',
      label: 'Gestor LMS',
      description: 'Gestión del sistema de aprendizaje',
      color: 'from-blue-500 to-blue-700',
      icon: faGraduationCap,
      suggestedEmail: 'lms@techproc.com',
    },
    {
      value: 'support',
      label: 'Soporte Técnico',
      description: 'Gestión de tickets de soporte',
      color: 'from-yellow-500 to-yellow-700',
      icon: faTicket,
      suggestedEmail: 'soporte@techproc.com',
    },
    {
      value: 'seg',
      label: 'Soporte - Seguridad',
      description: 'Seguridad del sistema',
      color: 'from-purple-500 to-purple-700',
      icon: faLock,
      suggestedEmail: 'security@techproc.com',
    },
    {
      value: 'infra',
      label: 'Soporte - Infraestructura',
      description: 'Gestión de infraestructura',
      color: 'from-green-500 to-green-700',
      icon: faServer,
      suggestedEmail: 'infra@techproc.com',
    },
    {
      value: 'web',
      label: 'Developer Web',
      description: 'Desarrollo y gestión web',
      color: 'from-orange-500 to-orange-700',
      icon: faGlobe,
      suggestedEmail: 'web@techproc.com',
    },
    {
      value: 'data',
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
    setStep('loading');
    setError('');

    // Tiempo mínimo de 500ms para el preloader
    setTimeout(() => {
      setStep('login');
    }, 500);
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

      // La respuesta ahora tiene la estructura: { success: true, data: { user, session, employee } }
      if (response.success && response.data) {
        const { user, session, employee } = response.data;

        // Guardar sesión con el nuevo formato (incluyendo employee)
        authService.saveSession(user, session.token, session.session_id, employee);

        // Notificar al componente padre
        onLogin(user);

        // Recargar la página para asegurar que todos los módulos se inicialicen correctamente
        window.location.href = '/procesostecnologicos/web/profile';
      } else {
        setError('Error al iniciar sesión: Respuesta inválida del servidor');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al iniciar sesión');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Vista de carga (Preloader)
  if (step === 'loading') {
    return <Preloader />;
  }

  // Vista de selección de perfil
  if (step === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-500/30 to-smoky-500/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative z-10 w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-down">
            <h1 className="relative inline-block group text-6xl font-heading font-bold text-gradient mb-4">
              INCADEV
              <span className="absolute left-1/2 bottom-[-10px] w-1 h-[4px] bg-blue-500 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
            </h1>
            <p className="text-gray-300 text-lg font-medium leading-relaxed">
              Instituto de Capacitación<br />y Desarrollo Virtual
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-6 rounded-full shadow-lg shadow-primary-500/20"></div>
          </div>

          {/* User Selection Cards */}
          <div className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-heading font-semibold text-center text-white mb-6">
              Seleccione su perfil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCards.map((userType, index) => (
                <div
                  key={userType.value}
                  className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 border border-gray-700/50 hover:-translate-y-1 p-6 cursor-pointer transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  onClick={() => handleSelectProfile(userType)}
                  onMouseEnter={() => setHoveredUser(userType.value)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${userType.color} flex items-center justify-center flex-shrink-0 transform transition-transform duration-300 shadow-lg ${
                        hoveredUser === userType.value ? 'rotate-6 scale-110 shadow-xl' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon={userType.icon} className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg text-white mb-1">
                        {userType.label}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {userType.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary-500/50 flex items-center justify-center transition-colors hover:border-primary-500 hover:bg-primary-500/20">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className={`text-xs transition-all duration-300 ${
                          hoveredUser === userType.value
                            ? 'text-primary-400 translate-x-0.5'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-gray-400 text-sm animate-fade-in space-y-4">
            <p>Seleccione su tipo de usuario para continuar</p>
            <div>
              <span className="text-gray-400">¿No tienes cuenta? </span>
              <button
                onClick={handleRegisterClick}
                className="text-primary-400 hover:text-primary-300 font-semibold hover:underline transition-colors duration-200"
              >
                Solicita tu registro aquí
              </button>
            </div>
            <div>
              <Link
                to="/website"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold hover:underline transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faGlobe} />
                Visitar nuestro sitio web
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de login (formulario)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-500/30 to-smoky-500/30 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-white/5"></div>
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
            <h1 className="relative inline-block group text-5xl font-heading font-bold text-gradient mb-4">
              INCADEV
              <span className="absolute left-1/2 bottom-[-10px] w-1 h-[4px] bg-blue-500 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
            </h1>
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            Instituto de Capacitación<br />y Desarrollo Virtual
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-4 rounded-full shadow-lg shadow-primary-500/20"></div>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-2xl border border-gray-700/50 p-8 animate-slide-up">
          {/* Selected Profile Header */}
          {selectedProfile && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-gradient-to-br from-primary-600/20 to-primary-700/20 backdrop-blur-sm rounded-xl border border-primary-500/30">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedProfile.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <FontAwesomeIcon icon={selectedProfile.icon} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-white">
                  {selectedProfile.label}
                </h3>
                <p className="text-xs text-gray-300">{selectedProfile.description}</p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-heading font-bold text-center text-white mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-danger/20 to-danger/30 border border-danger/50 rounded-xl animate-shake">
              <p className="text-danger text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-gray-400"
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
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-gray-400"
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
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-400 transition-colors"
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
              className={`w-full btn btn-primary py-3 text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/20 ${
                loading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-xl hover:shadow-primary-500/15 hover:scale-[1.01]'
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
              className="w-full btn bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white py-2 text-sm rounded-xl inline-flex items-center justify-center gap-2 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Cambiar perfil</span>
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-600/20 to-primary-700/20 backdrop-blur-sm border border-primary-500/30 rounded-xl">
            <p className="text-xs text-primary-300 font-semibold mb-2">
              📝 Credenciales de prueba para este perfil:
            </p>
            <div className="text-xs text-gray-300 space-y-1">
              <p>• Email: {selectedProfile?.suggestedEmail}</p>
              <p>• Contraseña: {selectedProfile?.value === 'admin' ? 'admin123' :
                               selectedProfile?.value === 'lms' ? 'lms123' :
                               selectedProfile?.value === 'seg' ? 'security123' :
                               selectedProfile?.value === 'infra' ? 'infra123' :
                               selectedProfile?.value === 'web' ? 'web123' : 'data123'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm animate-fade-in space-y-3">
          <div>
            <p>¿No tienes cuenta?</p>
            <button
              onClick={handleRegisterClick}
              className="mt-2 text-primary-400 hover:text-primary-300 font-semibold hover:underline transition-colors duration-200"
              disabled={loading}
            >
              Solicita tu registro aquí
            </button>
          </div>
          <div>
            <Link
              to="/website"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold hover:underline transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faGlobe} />
              Visitar nuestro sitio web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
