import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faCalendar,
  faNetworkWired,
  faBan,
  faCheckCircle,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import type { SecurityAlert } from '../types/security';

interface SecurityAlertCardProps {
  alert: SecurityAlert;
  index: number;
}

export const SecurityAlertCard = ({ alert, index }: SecurityAlertCardProps) => {
  const getSeverityInfo = (severity: string) => {
    const severities = {
      'low': { 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/20', 
        border: 'border-blue-500/30',
        label: 'Baja'
      },
      'medium': { 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/20', 
        border: 'border-yellow-500/30',
        label: 'Media'
      },
      'high': { 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/20', 
        border: 'border-orange-500/30',
        label: 'Alta'
      },
      'critical': { 
        color: 'text-red-400', 
        bg: 'bg-red-500/20', 
        border: 'border-red-500/30',
        label: 'Crítica'
      }
    };
    return severities[severity as keyof typeof severities] || severities.low;
  };

  const getStatusInfo = (status: string) => {
    const statuses = {
      'open': { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: 'Abierto' },
      'investigating': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', label: 'Investigando' },
      'resolved': { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', label: 'Resuelto' }
    };
    return statuses[status as keyof typeof statuses] || statuses.open;
  };

  const severityInfo = getSeverityInfo(alert.severity);
  const statusInfo = getStatusInfo(alert.status);

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 ${severityInfo.bg} rounded-lg border ${severityInfo.border}`}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={`${severityInfo.color} text-2xl`} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {alert.threat_type}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs border ${severityInfo.bg} ${severityInfo.color} ${severityInfo.border}`}>
                  {severityInfo.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">ID Alerta</p>
          <p className="text-sm font-mono text-primary-400">{alert.id_security_alert}</p>
        </div>
      </div>

      {/* Información de IP bloqueada */}
      <div className={`p-4 rounded-lg border mb-4 ${alert.blocked_ip.active ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faNetworkWired} className={alert.blocked_ip.active ? 'text-red-400' : 'text-gray-400'} />
            <span className="font-mono text-white font-medium">{alert.blocked_ip.ip_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={alert.blocked_ip.active ? faBan : faCheckCircle} className={alert.blocked_ip.active ? 'text-red-400' : 'text-green-400'} />
            <span className={`text-sm font-medium ${alert.blocked_ip.active ? 'text-red-400' : 'text-green-400'}`}>
              {alert.blocked_ip.active ? 'Bloqueada' : 'Desbloqueada'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-300">{alert.blocked_ip.reason}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          <FontAwesomeIcon icon={faCalendar} />
          <span>Bloqueada el: {new Date(alert.blocked_ip.block_date).toLocaleDateString('es-PE')}</span>
        </div>
      </div>

      {/* Fecha de detección */}
      <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
        <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
        <span>Detectada el:</span>
        <span className="font-medium">
          {new Date(alert.detection_date).toLocaleString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Incidentes relacionados */}
      {alert.incidents.length > 0 && (
        <div className="border-t border-gray-700 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-primary-400" />
            <span className="text-sm font-medium text-white">
              Incidentes Relacionados ({alert.incidents.length})
            </span>
          </div>
          <div className="space-y-2">
            {alert.incidents.map((incident) => (
              <div key={incident.id} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{incident.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {incident.id_incident} • Estado: <span className="capitalize">{incident.status}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(incident.report_date).toLocaleDateString('es-PE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};