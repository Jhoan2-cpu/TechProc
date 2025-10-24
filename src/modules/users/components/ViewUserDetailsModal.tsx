import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faMapMarkerAlt, faBirthdayCake, faVenusMars, faGlobe, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../types';

interface ViewUserDetailsModalProps {
  user: User;
  onClose: () => void;
}

export const ViewUserDetailsModal = ({ user, onClose }: ViewUserDetailsModalProps) => {
  const primaryRole = user.role && user.role.length > 0 ? user.role[0] : 'student';
  const roleLabels: Record<string, string> = {
    'admin': 'Administrador',
    'instructor': 'Instructor',
    'student': 'Estudiante',
    'lms': 'Gestor LMS',
    'seg': 'Seguridad',
    'infra': 'Infraestructura',
    'web': 'Desarrollo Web',
    'data': 'Analista Datos',
  };

  const genderLabels: Record<string, string> = {
    'male': 'Masculino',
    'female': 'Femenino',
    'other': 'Otro',
  };

  const statusLabels: Record<string, string> = {
    'active': 'Activo',
    'inactive': 'Inactivo',
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-gradient">Detalles del Usuario</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Avatar y info principal */}
          <div className="flex items-center gap-6 mb-6 p-6 bg-secondary-700/50 rounded-lg border border-gray-700/50">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500/30 to-primary-600/30 rounded-full flex items-center justify-center border-2 border-primary-500/50">
              <span className="text-primary-400 font-bold text-3xl">
                {user.full_name?.charAt(0) || user.first_name?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">
                {user.full_name || `${user.first_name} ${user.last_name}`}
              </h3>
              <p className="text-gray-400 mb-2">{user.email}</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  user.status === 'active'
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-danger/20 text-danger border border-danger/30'
                }`}>
                  {statusLabels[user.status] || user.status}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  {roleLabels[primaryRole] || primaryRole}
                </span>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Información Personal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">DNI</div>
                <div className="text-sm text-white font-medium">{user.dni || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Documento</div>
                <div className="text-sm text-white font-medium">{user.document || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBirthdayCake} className="text-xs" />
                  Fecha de Nacimiento
                </div>
                <div className="text-sm text-white font-medium">{formatDate(user.birth_date)}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faVenusMars} className="text-xs" />
                  Género
                </div>
                <div className="text-sm text-white font-medium">
                  {user.gender ? genderLabels[user.gender] || user.gender : 'No especificado'}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} />
              Información de Contacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                  Email
                </div>
                <div className="text-sm text-white font-medium break-all">{user.email}</div>
                {user.email_verified_at && (
                  <div className="text-xs text-success mt-1">✓ Verificado el {formatDate(user.email_verified_at)}</div>
                )}
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-xs" />
                  Teléfono
                </div>
                <div className="text-sm text-white font-medium">{user.phone_number || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30 md:col-span-2">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                  Dirección
                </div>
                <div className="text-sm text-white font-medium">{user.address || 'No disponible'}</div>
              </div>
            </div>
          </div>

          {/* Información de Ubicación */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} />
              Ubicación y Zona Horaria
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">País</div>
                <div className="text-sm text-white font-medium">{user.country || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Ciudad</div>
                <div className="text-sm text-white font-medium">{user.country_location || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-xs" />
                  Zona Horaria
                </div>
                <div className="text-sm text-white font-medium">{user.timezone || 'No disponible'}</div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div>
            <h4 className="text-lg font-semibold text-primary-400 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} />
              Información del Sistema
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Fecha de Creación</div>
                <div className="text-sm text-white font-medium">{formatDateTime(user.created_at)}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Última Actualización</div>
                <div className="text-sm text-white font-medium">{formatDateTime(user.updated_at)}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Último Acceso</div>
                <div className="text-sm text-white font-medium">{formatDateTime(user.last_access)}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">IP del Último Acceso</div>
                <div className="text-sm text-white font-medium">{user.last_access_ip || 'No disponible'}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">ID de Usuario</div>
                <div className="text-sm text-white font-medium">#{user.id}</div>
              </div>
              <div className="p-4 bg-secondary-700/30 rounded-lg border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-1">Sincronizado</div>
                <div className="text-sm text-white font-medium">
                  {user.synchronized ? (
                    <span className="text-success">✓ Sí</span>
                  ) : (
                    <span className="text-warning">✗ No</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
