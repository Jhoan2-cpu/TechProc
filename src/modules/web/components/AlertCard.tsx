import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
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

export const AlertCard = ({ alert, index, formatDate, getStatusColor, getAlertTypeColor, onEdit, onDelete, onToggleStatus }: AlertCardProps) => {
  return (
    <div
      className={`card p-6 border-2 animate-fade-in ${getAlertTypeColor(alert.type)}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAlertTypeColor(alert.type)}`}>
                  {alert.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                  {alert.status}
                </span>
                <span className="text-xs text-gray-400">Prioridad: {alert.priority}</span>
              </div>
              <p className="text-lg text-white font-medium">{alert.message}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Inicio</p>
              <p className="font-semibold">{formatDate(alert.start_date)}</p>
            </div>
            <div>
              <p className="text-gray-400">Fin</p>
              <p className="font-semibold">{formatDate(alert.end_date)}</p>
            </div>
            {alert.link_url && (
              <>
                <div>
                  <p className="text-gray-400">Enlace</p>
                  <p className="font-mono text-xs">{alert.link_url}</p>
                </div>
                <div>
                  <p className="text-gray-400">Texto del botón</p>
                  <p className="font-semibold">{alert.link_text}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
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
