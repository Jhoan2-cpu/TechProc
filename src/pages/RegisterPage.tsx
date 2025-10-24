import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faShieldHalved,
  faServer,
  faChartLine,
  faGraduationCap,
  faGlobe,
  faArrowLeft,
  faCheckCircle,
  faSpinner,
  faBirthdayCake,
  faVenusMars,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  country: string;
  role: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    dni: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    address: '',
    birth_date: '',
    gender: 'other',
    country: 'Peru',
    role: '',
  });

  const [document, setDocument] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const roles: Array<{ value: string; label: string; icon: any; color: string }> = [
    {
      value: 'admin',
      label: 'Administrador',
      icon: faShieldHalved,
      color: 'text-red-600',
    },
    {
      value: 'instructor',
      label: 'Instructor',
      icon: faGraduationCap,
      color: 'text-blue-600',
    },
    {
      value: 'student',
      label: 'Estudiante',
      icon: faUser,
      color: 'text-green-600',
    },
    {
      value: 'lms',
      label: 'Gestor LMS',
      icon: faGraduationCap,
      color: 'text-purple-600',
    },
    {
      value: 'support',
      label: 'Soporte Técnico',
      icon: faTicket,
      color: 'text-yellow-600',
    },
    {
      value: 'seg',
      label: 'Seguridad',
      icon: faShieldHalved,
      color: 'text-pink-600',
    },
    {
      value: 'infra',
      label: 'Infraestructura',
      icon: faServer,
      color: 'text-indigo-600',
    },
    {
      value: 'web',
      label: 'Desarrollo Web',
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

  // Generar document automáticamente cuando cambie role o dni
  useEffect(() => {
    if (formData.role && formData.dni) {
      let prefix = '';
      if (formData.role === 'admin') {
        prefix = 'AD';
      } else if (['lms', 'support', 'web', 'data', 'infra', 'seg'].includes(formData.role)) {
        prefix = 'EMP';
      } else {
        prefix = 'DOC'; // Para instructor y student
      }
      setDocument(`${prefix}${formData.dni}`);
    } else {
      setDocument('');
    }
  }, [formData.role, formData.dni]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'El nombre es requerido';
    if (!formData.last_name.trim()) newErrors.last_name = 'El apellido es requerido';
    if (!formData.dni.trim()) newErrors.dni = 'El DNI es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.role) newErrors.role = 'Debe seleccionar un rol';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'El teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      try {
        setLoading(true);

        const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            phone_number: formData.phone_number,
            address: formData.address || undefined,
            birth_date: formData.birth_date || undefined,
            gender: formData.gender,
            country: formData.country,
            dni: formData.dni,
            document: document,
            role: formData.role,
            status: 'inactive',
          }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          setUserId(data.data.user_id);
          setUserEmail(data.data.email);
          setSubmitted(true);
        } else {
          setApiError(data.message || 'Error al procesar el registro');
        }
      } catch (error: any) {
        setApiError(error.message || 'Error al procesar el registro');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string | any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
              ¡Solicitud Enviada Exitosamente!
            </h2>
            <p className="text-gray-300 mb-2">
              Tu solicitud de registro ha sido enviada.
            </p>
            {userId && (
              <div className="bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-lg p-4 mb-4 border border-primary-500/30">
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-semibold text-primary-400">ID de Usuario:</span> #{userId}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-primary-400">Email:</span> {userEmail}
                </p>
              </div>
            )}
            <p className="text-gray-400 text-sm mb-6">
              Un administrador revisará tu solicitud y te notificará cuando tu cuenta sea aprobada.
              Recibirás un correo electrónico con las instrucciones para acceder al sistema.
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
                    className={`input ${errors.first_name ? 'border-danger' : ''}`}
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="Juan"
                    disabled={loading}
                  />
                  {errors.first_name && (
                    <p className="text-danger text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.last_name ? 'border-danger' : ''}`}
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Pérez"
                    disabled={loading}
                  />
                  {errors.last_name && (
                    <p className="text-danger text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    DNI *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      className={`input pl-12 ${errors.dni ? 'border-danger' : ''}`}
                      value={formData.dni}
                      onChange={(e) => handleChange('dni', e.target.value)}
                      placeholder="12345678"
                      disabled={loading}
                    />
                  </div>
                  {errors.dni && <p className="text-danger text-xs mt-1">{errors.dni}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Documento (Generado automáticamente)
                  </label>
                  <input
                    type="text"
                    className="input bg-secondary-700/50 cursor-not-allowed"
                    value={document}
                    disabled
                    placeholder="Seleccione rol y DNI"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.role === 'admin' ? 'Admin: AD + DNI' :
                     ['lms', 'support', 'web', 'data', 'infra', 'seg'].includes(formData.role) ? 'Empleado: EMP + DNI' :
                     formData.role ? 'Documento: DOC + DNI' : 'Seleccione un rol primero'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      className={`input pl-12 ${errors.birth_date ? 'border-danger' : ''}`}
                      value={formData.birth_date}
                      onChange={(e) => handleChange('birth_date', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {errors.birth_date && <p className="text-danger text-xs mt-1">{errors.birth_date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Género
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <select
                      className={`input pl-12 ${errors.gender ? 'border-danger' : ''}`}
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value as any)}
                      disabled={loading}
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Teléfono *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      className={`input pl-12 ${errors.phone_number ? 'border-danger' : ''}`}
                      value={formData.phone_number}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                      placeholder="+51 987654321"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone_number && <p className="text-danger text-xs mt-1">{errors.phone_number}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Dirección
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      className={`input pl-12 ${errors.address ? 'border-danger' : ''}`}
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Av. Principal 123"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    className={`input ${errors.country ? 'border-danger' : ''}`}
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Peru"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Información de Cuenta */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-primary-400" />
                Información de Cuenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`input pl-12 ${errors.password_confirmation ? 'border-danger' : ''}`}
                      value={formData.password_confirmation}
                      onChange={(e) => handleChange('password_confirmation', e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-danger text-xs mt-1">{errors.password_confirmation}</p>
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
                    Enviando...
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
