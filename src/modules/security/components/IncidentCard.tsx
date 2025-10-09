import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faCalendar,
  faUser,
  faCheckCircle,
  faTimesCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { Incident } from '../types';

interface IncidentCardProps {
  incident: Incident & {
    description?: string;
    severity?: string;
    assigned_to?: string;
    resolved_date?: string;
  };
  formatDate: (dateString: string) => string;
  onManage?: (incidentId: number) => void;
  onChangeStatus?: (incident: Incident & { description?: string; severity?: string; assigned_to?: string }) => void;
  onEdit?: (incident: Incident & { description?: string; severity?: string; assigned_to?: string }) => void;
  compact?: boolean; // Para vista de críticos en dashboard
}

export const IncidentCard = ({
  incident,
  formatDate,
  onManage,
  onChangeStatus,
  onEdit,
  compact = false,
}: IncidentCardProps) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger/20 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-900/20 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-primary-900/20 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-primary-900/20 text-blue-700';
      case 'investigating':
        return 'bg-warning/20 text-yellow-700';
      case 'resolved':
        return 'bg-success/20 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityText = (severity?: string) => {
    const texts: Record<string, string> = {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
    };
    return severity ? (texts[severity] || severity) : '';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      open: 'Abierto',
      investigating: 'Investigando',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return faCheckCircle;
      case 'closed':
        return faTimesCircle;
      case 'investigating':
        return faClock;
      default:
        return faExclamationTriangle;
    }
  };

  if (compact) {
    // Vista compacta para incidentes críticos en dashboard
    return (
      <div className="bg-white border border-red-300 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading font-bold text-white mb-1">
              #{incident.id_incident} - {incident.title}
            </h3>
            <p className="text-sm text-gray-300 mb-2">{incident.description}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{formatDate(incident.report_date)}</span>
              {incident.assigned_to && <span>Asignado a: {incident.assigned_to}</span>}
            </div>
          </div>
          {onManage && (
            <button
              onClick={() => onManage(incident.id_incident)}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Gestionar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Vista completa
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              #{incident.id_incident} - {incident.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{incident.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(
              incident.severity
            )}`}
          >
            {getSeverityText(incident.severity)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(incident.status)}`}>
            <FontAwesomeIcon icon={getStatusIcon(incident.status)} className="mr-1" />
            {getStatusText(incident.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-300 text-xs mb-1">Fecha de Reporte</p>
          <p className="text-white font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
            {formatDate(incident.report_date)}
          </p>
        </div>
        {incident.assigned_to && (
          <div>
            <p className="text-gray-300 text-xs mb-1">Asignado a</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faUser} className="text-primary-600" />
              {incident.assigned_to}
            </p>
          </div>
        )}
        {incident.resolved_date && (
          <div>
            <p className="text-gray-300 text-xs mb-1">Fecha de Resolución</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              {formatDate(incident.resolved_date)}
            </p>
          </div>
        )}
      </div>

      {(onManage || onChangeStatus || onEdit) && (
        <div className="pt-4 border-t border-secondary-200 flex gap-2">
          {onChangeStatus && (
            <button
              onClick={() => onChangeStatus(incident)}
              className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faClock} />
              Cambiar Estado
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(incident)}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex items-center gap-2"
            >
              Editar
            </button>
          )}
          {onManage && incident.status !== 'resolved' && incident.status !== 'closed' && (
            <button
              onClick={() => onManage(incident.id_incident)}
              className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Gestionar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
