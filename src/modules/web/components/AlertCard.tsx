import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes, faLink } from '@fortawesome/free-solid-svg-icons';
import type { Alert } from '../types';

interface AlertCardProps {
  alert: Alert;
  index: number;
  formatDate: (dateString: string | null) => string;
  getStatusColor: (status: string) => string;
  getAlertTypeColor: (type: string) => string;
  onEdit: (alert: Alert) => void;
  onDelete: (alert: Alert) => void;
  onToggleStatus: (alert: Alert) => void;
}

export const AlertCard = ({ 
  alert, 
  index, 
  formatDate, 
  getStatusColor, 
  getAlertTypeColor, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: AlertCardProps) => {
  return (
    <div
      className={`card p-6 border-2 hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in ${getAlertTypeColor(alert.type)}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-gray-400">ID: {alert.id_alert}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAlertTypeColor(alert.type)}`}>
                  {alert.type === 'success' ? 'Éxito' : 
                   alert.type === 'warning' ? 'Advertencia' : 
                   alert.type === 'error' ? 'Error' : 
                   alert.type === 'info' ? 'Información' : 
                   alert.type === 'maintenance' ? 'Mantenimiento' : alert.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                  {alert.status === 'active' ? 'Activa' : 
                   alert.status === 'inactive' ? 'Inactiva' : 
                   alert.status === 'expired' ? 'Expirada' : alert.status}
                </span>
                <span className="px-2 py-1 bg-secondary-100/90 text-primary-800 rounded text-xs">
                  Prioridad: {alert.priority}
                </span>
              </div>
              <p className="text-lg text-white font-medium mb-2">{alert.message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-400 text-xs">Fecha Inicio</p>
              <p className="font-semibold text-white">{formatDate(alert.start_date)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Fecha Fin</p>
              <p className="font-semibold text-white">{formatDate(alert.end_date)}</p>
            </div>
            {alert.link_url && (
              <>
                <div>
                  <p className="text-gray-400 text-xs">Enlace</p>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faLink} className="text-blue-400 text-xs" />
                    <p className="font-mono text-xs text-blue-300 truncate" title={alert.link_url}>
                      {alert.link_url}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Texto del botón</p>
                  <p className="font-semibold text-white">{alert.link_text || 'Sin texto'}</p>
                </div>
              </>
            )}
          </div>
          
          {alert.creator && (
            <div className="mt-3 pt-3 border-t border-secondary-200">
              <p className="text-xs text-gray-400">
                Creado por: <span className="text-white font-medium">{alert.creator.full_name}</span>
                {' • '}
                {formatDate(alert.created_date)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(alert)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
            title="Editar alerta"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          
          {alert.status === 'inactive' ? (
            <button
              onClick={() => onToggleStatus(alert)}
              className="btn bg-green-600 hover:bg-green-700 text-white"
              title="Activar alerta"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(alert)}
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white"
              title="Desactivar alerta"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          
          <button
            onClick={() => onDelete(alert)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
            title="Eliminar alerta"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};