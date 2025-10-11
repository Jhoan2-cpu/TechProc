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
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Mi Perfil
        </h1>
        <p className="text-gray-400">
          Gestiona tu información personal y configuración
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Perfil Principal */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl text-center animate-slide-up">
            {/* Avatar */}
            <div className="mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl shadow-${config.color.split('-')[1]}-500/30`}>
                <span className="text-white font-bold text-5xl">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Nombre y Rol */}
            <h2 className="text-2xl font-heading font-bold text-white mb-3">
              {user.name}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary-600/30 to-primary-700/30 rounded-full mb-6 border border-primary-500/30">
              <FontAwesomeIcon icon={config.icon} className="text-primary-400" />
              <span className="text-sm font-medium text-white">
                {config.label}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">ID de Usuario</span>
                <span className="font-semibold text-primary-400">#{user.id}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Estado</span>
                <span className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold text-green-400">Activo</span>
                </span>
              </div>
            </div>

            {/* Botón de Editar */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn bg-primary-600 hover:bg-primary-700 text-white w-full mt-6 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faEdit} />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Card de Información Detallada */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-xl font-heading font-semibold text-white">
                Información Personal
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn bg-primary-800 hover:bg-secondary-300 text-white px-4 py-2 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-primary-400" />
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
                  <p className="text-white font-medium bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 p-4 rounded-xl border border-gray-700/30">
                    {formData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
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
                  <p className="text-white font-medium bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 p-4 rounded-xl border border-gray-700/30">
                    {formData.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <FontAwesomeIcon icon={faPhone} className="text-primary-400" />
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
                  <p className="text-white font-medium bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 p-4 rounded-xl border border-gray-700/30">
                    {formData.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departamento */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <FontAwesomeIcon icon={faBriefcase} className="text-primary-400" />
                    Departamento
                  </label>
                  <p className="text-white font-medium bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 p-4 rounded-xl border border-gray-700/30">
                    {formData.department}
                  </p>
                </div>

                {/* Fecha de Ingreso */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                    Fecha de Ingreso
                  </label>
                  <p className="text-white font-medium bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 p-4 rounded-xl border border-gray-700/30">
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
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl mt-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-heading font-semibold text-white mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Inicio de sesión', time: 'Hace 2 horas', color: 'bg-green-500' },
                { action: 'Actualización de perfil', time: 'Hace 1 día', color: 'bg-blue-500' },
                { action: 'Acceso al módulo', time: 'Hace 3 días', color: 'bg-purple-500' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-secondary-600/60 to-secondary-700/60 rounded-xl border border-gray-700/30 hover:border-primary-500/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                    <span className="text-white font-medium">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
