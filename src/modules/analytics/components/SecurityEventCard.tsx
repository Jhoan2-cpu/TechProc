import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendar, 
  faNetworkWired, 
  faShieldAlt,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import type { SecurityEvent } from '../types/security';

interface SecurityEventCardProps {
  event: SecurityEvent;
  index: number;
}

export const SecurityEventCard = ({ event, index }: SecurityEventCardProps) => {
  const getEventTypeInfo = (eventType: string) => {
    const types = {
      'login_success': { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: faCheckCircle },
      'login_failed': { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: faTimesCircle },
      'session_timeout': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: faExclamationTriangle },
      'access_denied': { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', icon: faShieldAlt },
      'password_change': { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: faShieldAlt },
      'profile_update': { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: faUser }
    };
    return types[eventType as keyof typeof types] || types.access_denied;
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels = {
      'login_success': 'Login Exitoso',
      'login_failed': 'Login Fallido',
      'session_timeout': 'Sesión Expirada',
      'access_denied': 'Acceso Denegado',
      'password_change': 'Cambio de Contraseña',
      'profile_update': 'Actualización de Perfil'
    };
    return labels[eventType as keyof typeof labels] || eventType;
  };

  const eventInfo = getEventTypeInfo(event.event_type);

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${eventInfo.bg} rounded-lg border ${eventInfo.border}`}>
              <FontAwesomeIcon icon={eventInfo.icon} className={`${eventInfo.color} text-xl`} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {getEventTypeLabel(event.event_type)}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs border ${eventInfo.bg} ${eventInfo.color} ${eventInfo.border}`}>
                ID: {event.id_security_log}
              </span>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">{event.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faUser} className="w-4 text-primary-400" />
              <span className="font-medium">{event.user.full_name}</span>
              <span className="text-gray-500">•</span>
              <span>{event.user.email}</span>
              <span className="text-gray-500">•</span>
              <span>DNI: {event.user.dni}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faNetworkWired} className="w-4 text-primary-400" />
              <span>IP de Origen: <span className="font-mono font-medium">{event.source_ip}</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendar} className="w-4 text-primary-400" />
              <span>
                {new Date(event.event_date).toLocaleString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-1">Estado</p>
            <p className="text-white font-medium">{event.user.status}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Rol</p>
            <p className="text-white font-medium">{event.user.role.join(', ')}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">País</p>
            <p className="text-white font-medium">{event.user.country}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Género</p>
            <p className="text-white font-medium capitalize">{event.user.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};