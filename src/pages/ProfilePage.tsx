import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faBriefcase,
  faCalendar,
  faEdit,
  faSave,
  faTimes,
  faShieldHalved,
  faGraduationCap,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import type { User, UserRole } from '../shared/types/auth';

interface ProfilePageProps {
  user: User;
}

const roleConfig: Record<UserRole, { color: string; icon: any; label: string }> = {
  administrador: { color: 'from-red-500 to-red-700', icon: faShieldHalved, label: 'Administrador' },
  gestor_lms: { color: 'from-blue-500 to-blue-700', icon: faGraduationCap, label: 'Gestor LMS' },
  soporte_tecnico: { color: 'from-yellow-500 to-yellow-700', icon: faBriefcase, label: 'Soporte Técnico' },
  soporte_seguridad: { color: 'from-purple-500 to-purple-700', icon: faLock, label: 'Soporte - Seguridad' },
  soporte_infraestructura: { color: 'from-green-500 to-green-700', icon: faServer, label: 'Soporte - Infraestructura' },
  developer_web: { color: 'from-orange-500 to-orange-700', icon: faGlobe, label: 'Developer Web' },
  analista_datos: { color: 'from-cyan-500 to-cyan-700', icon: faChartLine, label: 'Analista de Datos' },
};

export const ProfilePage = ({ user }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.username + '@techproc.com',
    phone: '+51 999 999 999',
    department: roleConfig[user.role].label,
    joinDate: '2024-01-15',
  });

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.username + '@techproc.com',
      phone: '+51 999 999 999',
      department: roleConfig[user.role].label,
      joinDate: '2024-01-15',
    });
    setIsEditing(false);
  };

  const config = roleConfig[user.role];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">
          Mi Perfil
        </h1>
        <p className="text-secondary-600">
          Gestiona tu información personal y configuración
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Perfil Principal */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center animate-slide-up">
            {/* Avatar */}
            <div className="mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl`}>
                <span className="text-white font-bold text-5xl">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Nombre y Rol */}
            <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
              {user.name}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full mb-6">
              <FontAwesomeIcon icon={config.icon} className="text-primary-600" />
              <span className="text-sm font-medium text-secondary-700">
                {config.label}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <span className="text-sm text-secondary-600">ID de Usuario</span>
                <span className="font-semibold text-primary-700">#{user.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                <span className="text-sm text-secondary-600">Estado</span>
                <span className="inline-flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-green-700">Activo</span>
                </span>
              </div>
            </div>

            {/* Botón de Editar */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary w-full mt-6"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Card de Información Detallada */}
        <div className="lg:col-span-2">
          <div className="card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-semibold text-secondary-900">
                Información Personal
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary px-4 py-2"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn bg-secondary-200 text-secondary-700 hover:bg-secondary-300 px-4 py-2"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-primary-600" />
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-secondary-900 font-medium bg-secondary-50 p-3 rounded-lg">
                    {formData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-600" />
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-secondary-900 font-medium bg-secondary-50 p-3 rounded-lg">
                    {formData.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                  <FontAwesomeIcon icon={faPhone} className="text-primary-600" />
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-secondary-900 font-medium bg-secondary-50 p-3 rounded-lg">
                    {formData.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departamento */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                    <FontAwesomeIcon icon={faBriefcase} className="text-primary-600" />
                    Departamento
                  </label>
                  <p className="text-secondary-900 font-medium bg-secondary-50 p-3 rounded-lg">
                    {formData.department}
                  </p>
                </div>

                {/* Fecha de Ingreso */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
                    Fecha de Ingreso
                  </label>
                  <p className="text-secondary-900 font-medium bg-secondary-50 p-3 rounded-lg">
                    {new Date(formData.joinDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Actividad Reciente */}
          <div className="card p-6 mt-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-heading font-semibold text-secondary-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Inicio de sesión', time: 'Hace 2 horas', color: 'bg-green-100 text-green-700' },
                { action: 'Actualización de perfil', time: 'Hace 1 día', color: 'bg-blue-100 text-blue-700' },
                { action: 'Acceso al módulo', time: 'Hace 3 días', color: 'bg-purple-100 text-purple-700' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0].replace('100', '500')}`}></div>
                    <span className="text-secondary-900 font-medium">{activity.action}</span>
                  </div>
                  <span className="text-sm text-secondary-600">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
