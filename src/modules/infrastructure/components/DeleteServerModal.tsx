import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Server } from '../types';

interface DeleteServerModalProps {
  isOpen: boolean;
  server: Server | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteServerModal = ({ isOpen, server, onConfirm, onCancel }: DeleteServerModalProps) => {
  if (!isOpen || !server) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-secondary-900 mb-2">
            Eliminar Servidor
          </h3>

          <p className="text-center text-secondary-600 mb-4">
            ¿Estás seguro de que deseas eliminar el servidor <span className="font-bold text-secondary-900">{server.server_name}</span>?
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Advertencia:</span> Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a este servidor.
            </p>
          </div>

          <div className="space-y-2 text-sm text-secondary-600 mb-6">
            <p><span className="font-semibold">IP:</span> {server.ip_address}</p>
            <p><span className="font-semibold">Sistema Operativo:</span> {server.operating_system}</p>
            <p><span className="font-semibold">Ubicación:</span> {server.location}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
