import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faBuilding,
  faIdCard,
  faShieldHalved,
  faServer,
  faChartLine,
  faGraduationCap,
  faGlobe,
  faArrowLeft,
  faCheckCircle,
  faSpinner,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/authService';
import type { UserRole } from '../shared/types/auth';

interface RegisterPageProps {
  onBackToLogin: () => void;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
  reason: string;
}

export const RegisterPage = ({}: RegisterPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const roles: Array<{ value: UserRole; label: string; icon: any; color: string }> = [
    {
      value: 'administrador',
      label: 'Administrador',
      icon: faShieldHalved,
      color: 'text-red-600',
    },
    {
      value: 'gestor_lms',
      label: 'Gestor LMS',
      icon: faGraduationCap,
      color: 'text-blue-600',
    },
    {
      value: 'soporte_tecnico',
      label: 'Soporte Técnico',
      icon: faTicket,
      color: 'text-yellow-600',
    },
    {
      value: 'soporte_seguridad',
      label: 'Soporte - Seguridad',
      icon: faLock,
      color: 'text-purple-600',
    },
    {
      value: 'soporte_infraestructura',
      label: 'Soporte - Infraestructura',
      icon: faServer,
      color: 'text-green-600',
    },
    {
      value: 'developer_web',
      label: 'Developer Web',
      icon: faGlobe,
      color: 'text-orange-600',
    },
    {
      value: 'analista_datos',
      label: 'Analista de Datos',
      icon: faChartLine,
      color: 'text-cyan-600',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 4) {
      newErrors.username = 'El usuario debe tener al menos 4 caracteres';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.role) {
      newErrors.role = 'Debe seleccionar un rol';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Debe indicar el motivo de registro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      try {
        setLoading(true);

        // Llamar al servicio de registro según especificación
        const response = await authService.register({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role as UserRole,
        });

        // Guardar sesión automáticamente
        authService.saveSession(response.token, response.refreshToken);

        // Mostrar mensaje de éxito
        setSubmitted(true);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error: any) {
        setApiError(error.message || 'Error al procesar el registro');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validación en tiempo real
    validateField(field, value);
  };

  const validateField = (field: keyof RegisterFormData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'El nombre es requerido';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        } else if (value.trim().length > 50) {
          newErrors.firstName = 'El nombre no puede tener más de 50 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
          newErrors.firstName = 'Solo se permiten letras y espacios';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'El apellido es requerido';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        } else if (value.trim().length > 50) {
          newErrors.lastName = 'El apellido no puede tener más de 50 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
          newErrors.lastName = 'Solo se permiten letras y espacios';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Email inválido. Solo letras, números, puntos, guiones y guiones bajos';
        } else if (value.length > 100) {
          newErrors.email = 'El email no puede tener más de 100 caracteres';
        } else {
          delete newErrors.email;
        }
        break;

      case 'username':
        if (!value.trim()) {
          newErrors.username = 'El nombre de usuario es requerido';
        } else if (value.length < 4) {
          newErrors.username = 'El usuario debe tener al menos 4 caracteres';
        } else if (value.length > 20) {
          newErrors.username = 'El usuario no puede tener más de 20 caracteres';
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          newErrors.username = 'Solo se permiten letras, números, puntos, guiones y guiones bajos';
        } else {
          delete newErrors.username;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else if (value.length > 50) {
          newErrors.password = 'La contraseña no puede tener más de 50 caracteres';
        } else {
          delete newErrors.password;
        }
        // Revalidar confirmPassword si existe
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Debe confirmar la contraseña';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'role':
        if (!value) {
          newErrors.role = 'Debe seleccionar un rol';
        } else {
          delete newErrors.role;
        }
        break;

      case 'reason':
        if (!value.trim()) {
          newErrors.reason = 'Debe indicar el motivo de registro';
        } else if (value.trim().length < 10) {
          newErrors.reason = 'El motivo debe tener al menos 10 caracteres';
        } else if (value.trim().length > 500) {
          newErrors.reason = 'El motivo no puede exceder 500 caracteres';
        } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:()\-¿?¡!]+$/.test(value)) {
          newErrors.reason = 'Solo se permiten letras, números, espacios y signos de puntuación básicos';
        } else {
          delete newErrors.reason;
        }
        break;

      case 'phone':
        // Validación estricta: solo formato +51980490696 (sin espacios, guiones ni paréntesis)
        if (value.trim()) {
          // Formato: +[código país][número] sin espacios
          if (!/^\+\d{1,3}\d{7,12}$/.test(value)) {
            newErrors.phone = 'Formato inválido. Use +[código país][número]. Ej: +51980490696';
          } else if (value.length > 16) {
            newErrors.phone = 'El teléfono no puede tener más de 16 caracteres';
          } else {
            delete newErrors.phone;
          }
        } else {
          // Si está vacío, eliminar error (campo opcional)
          delete newErrors.phone;
        }
        break;

      case 'department':
        // Validación para departamento (opcional pero sin caracteres especiales)
        if (value.trim()) {
          if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
            newErrors.department = 'Solo se permiten letras, números y espacios';
          } else if (value.trim().length > 50) {
            newErrors.department = 'El departamento no puede tener más de 50 caracteres';
          } else {
            delete newErrors.department;
          }
        } else {
          delete newErrors.department;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-500/30 to-smoky-500/30 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/50">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-4xl" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              ¡Solicitud Enviada!
            </h2>
            <p className="text-gray-300 mb-6">
              Tu solicitud de registro ha sido enviada exitosamente. El administrador la revisará y te
              contactará pronto.
            </p>
            <button
              onClick={handleBackToLogin}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-500/30 to-smoky-500/30 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-5xl font-heading font-bold text-gradient mb-3">
            INCADEV
          </h1>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            Instituto de Capacitación<br />y Desarrollo Virtual
          </p>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Registro de Usuario
          </h2>
          <p className="text-gray-400">
            Complete el formulario para solicitar acceso al sistema
          </p>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-2xl border border-gray-700/50 p-8 animate-slide-up">
          {/* Error API */}
          {apiError && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/50 rounded-lg animate-shake">
              <p className="text-danger text-sm font-semibold">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-primary-400" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.firstName ? 'border-danger' : ''}`}
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Juan"
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="text-danger text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.lastName ? 'border-danger' : ''}`}
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Pérez"
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="text-danger text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      className={`input pl-12 ${errors.email ? 'border-danger' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="juan.perez@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      className={`input pl-12 ${errors.phone ? 'border-danger' : ''}`}
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+51980490696"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Información de Cuenta */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-primary-400" />
                Información de Cuenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.username ? 'border-danger' : ''}`}
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="juan.perez"
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="text-danger text-xs mt-1">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Departamento
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      className={`input pl-12 ${errors.department ? 'border-danger' : ''}`}
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder="Tecnología"
                      disabled={loading}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-danger text-xs mt-1">{errors.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      className={`input pl-12 ${errors.password ? 'border-danger' : ''}`}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      className={`input pl-12 ${errors.confirmPassword ? 'border-danger' : ''}`}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Selección de Rol */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Rol Solicitado *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => !loading && handleChange('role', role.value)}
                    className={`bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border p-4 ${
                      loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer transform hover:scale-105'
                    } ${
                      formData.role === role.value
                        ? 'ring-2 ring-primary-500 border-primary-500 shadow-primary-500/20'
                        : 'border-gray-700/50 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={role.icon} className={`text-2xl ${role.color}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-white">{role.label}</p>
                      </div>
                      {formData.role === role.value && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                          <svg
                            className="w-3 h-3 text-white"
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
              {errors.role && <p className="text-danger text-sm mt-2">{errors.role}</p>}
            </div>

            {/* Motivo de Registro */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Motivo de Registro *
              </label>
              <textarea
                className={`input min-h-[100px] ${errors.reason ? 'border-danger' : ''}`}
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Explique brevemente por qué necesita acceso al sistema y cómo lo utilizará..."
                rows={4}
                disabled={loading}
              />
              {errors.reason && <p className="text-danger text-xs mt-1">{errors.reason}</p>}
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between pt-4 border-t border-primary-500/20">
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={loading}
                className={`btn bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white border border-gray-700/50 hover:border-primary-500/50 flex items-center gap-2 transition-all duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Volver al Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary flex items-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Su solicitud será revisada por un administrador</p>
        </div>
      </div>
    </div>
  );
};
