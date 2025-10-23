import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { AcademicPeriod } from '../types';

interface ViewAcademicPeriodModalProps {
  period: AcademicPeriod | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewAcademicPeriodModal = ({ period, isOpen, onClose }: ViewAcademicPeriodModalProps) => {
  if (!isOpen || !period) return null;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendar} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-white">Detalles del Periodo</h2>
                <p className="text-sm text-indigo-100">{period.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div><span className="text-gray-400 text-sm">Nombre:</span> <span className="text-white font-medium ml-2">{period.name}</span></div>
          <div><span className="text-gray-400 text-sm">Estado:</span> <span className="text-white font-medium ml-2">{getStatusText(period.status)}</span></div>
          <div><span className="text-gray-400 text-sm">Fecha Inicio:</span> <span className="text-white font-medium ml-2">{new Date(period.start_date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span></div>
          <div><span className="text-gray-400 text-sm">Fecha Fin:</span> <span className="text-white font-medium ml-2">{new Date(period.end_date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span></div>
          <div><span className="text-gray-400 text-sm">Creado:</span> <span className="text-white font-medium ml-2">{new Date(period.created_at).toLocaleString('es-ES')}</span></div>
        </div>
        <div className="p-6 border-t border-secondary-200 flex justify-end">
          <button onClick={onClose} className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
