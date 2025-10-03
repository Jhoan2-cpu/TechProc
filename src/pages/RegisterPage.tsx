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
} from '@fortawesome/free-solid-svg-icons';

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
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const roles = [
    {
      value: 'admin',
      label: 'Administrador',
      icon: faShieldHalved,
      color: 'text-red-600',
    },
    {
      value: 'lms',
      label: 'Gestor LMS',
      icon: faGraduationCap,
      color: 'text-blue-600',
    },
    {
      value: 'seg',
      label: 'Soporte - Seguridad',
      icon: faLock,
      color: 'text-purple-600',
    },
    {
      value: 'infra',
      label: 'Soporte - Infraestructura',
      icon: faServer,
      color: 'text-green-600',
    },
    {
      value: 'web',
      label: 'Developer Web',
      icon: faGlobe,
      color: 'text-orange-600',
    },
    {
      value: 'data',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí se enviaría al backend
      console.log('Registro enviado:', formData);
      setSubmitted(true);

      // Simular guardado
      setTimeout(() => {
        alert('Solicitud de registro enviada. El administrador la revisará pronto.');
      }, 500);
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-4">
            ¡Solicitud Enviada!
          </h2>
          <p className="text-secondary-600 mb-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block p-4 bg-gradient-primary rounded-2xl shadow-lg mb-4">
            <FontAwesomeIcon icon={faUserPlus} className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
            Registro de Usuario
          </h1>
          <p className="text-secondary-600">
            Complete el formulario para solicitar acceso al sistema
          </p>
        </div>

        {/* Form */}
        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-primary-600" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Juan"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Pérez"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="email"
                      className={`input pl-12 ${errors.email ? 'border-red-500' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="juan.perez@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="tel"
                      className="input pl-12"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Cuenta */}
            <div>
              <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-primary-600" />
                Información de Cuenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.username ? 'border-red-500' : ''}`}
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="juan.perez"
                  />
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Departamento
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="text"
                      className="input pl-12"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder="Tecnología"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="password"
                      className={`input pl-12 ${errors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="password"
                      className={`input pl-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Selección de Rol */}
            <div>
              <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
                Rol Solicitado *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => handleChange('role', role.value)}
                    className={`card p-4 cursor-pointer transition-all duration-300 ${
                      formData.role === role.value
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={role.icon} className={`text-2xl ${role.color}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-secondary-900">{role.label}</p>
                      </div>
                      {formData.role === role.value && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
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
              {errors.role && <p className="text-red-600 text-sm mt-2">{errors.role}</p>}
            </div>

            {/* Motivo de Registro */}
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Motivo de Registro *
              </label>
              <textarea
                className={`input min-h-[100px] ${errors.reason ? 'border-red-500' : ''}`}
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Explique brevemente por qué necesita acceso al sistema y cómo lo utilizará..."
                rows={4}
              />
              {errors.reason && <p className="text-red-600 text-xs mt-1">{errors.reason}</p>}
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="btn btn-outline flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Volver al Login
              </button>
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <FontAwesomeIcon icon={faUserPlus} />
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-secondary-500 text-sm">
          <p>Su solicitud será revisada por un administrador</p>
        </div>
      </div>
    </div>
  );
};
