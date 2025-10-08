import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Alert } from '../types';

interface DeleteAlertModalProps {
  isOpen: boolean;
  alert: Alert | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteAlertModal = ({ isOpen, alert, onConfirm, onCancel }: DeleteAlertModalProps) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Eliminar Alerta</h3>
            <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-secondary-700">
            ¿Estás seguro de que deseas eliminar la siguiente alerta?
          </p>

          <div className="bg-secondary-50 rounded-lg p-4 border-2 border-secondary-200">
            <p className="text-sm text-secondary-900 mb-2">{alert.message}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">{alert.type}</span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-700">{alert.status}</span>
              <span className="text-secondary-500">Prioridad: {alert.priority}</span>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-800 font-semibold">
              Esta alerta será eliminada permanentemente del sistema.
            </p>
          </div>
        </div>

        <div className="bg-secondary-50 p-6 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Eliminar Alerta
          </button>
        </div>
      </div>
    </div>
  );
};
