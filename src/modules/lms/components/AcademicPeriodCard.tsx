import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faCalendar, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import type { AcademicPeriod } from '../types';

interface AcademicPeriodCardProps {
  period: AcademicPeriod;
  index: number;
  onView: (period: AcademicPeriod) => void;
  onDelete: (period: AcademicPeriod) => void;
}

export const AcademicPeriodCard = ({ period, index, onView, onDelete }: AcademicPeriodCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success/20 text-green-700';
      case 'completed': return 'bg-blue-500/20 text-blue-700';
      case 'cancelled': return 'bg-danger/20 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faCalendar} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-white">{period.name}</h3>
            <p className="text-xs text-gray-400">ID: {period.id}</p>
          </div>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(period.status)}`}>
          {getStatusText(period.status)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-sm w-4" />
          <span className="text-sm text-gray-300">Inicio: {new Date(period.start_date).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-400 text-sm w-4" />
          <span className="text-sm text-gray-300">Fin: {new Date(period.end_date).toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
        <span className="text-xs text-gray-400">Creado: {new Date(period.created_at).toLocaleDateString('es-ES')}</span>
        <div className="flex gap-2">
          <button onClick={() => onView(period)} className="text-blue-600 hover:bg-primary-900/20 p-2 rounded-lg transition-colors" title="Ver detalles">
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button onClick={() => onDelete(period)} className="text-red-600 hover:bg-danger/20 p-2 rounded-lg transition-colors" title="Eliminar">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
