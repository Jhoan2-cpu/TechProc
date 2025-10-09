import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';

interface DeleteSoftwareModalProps {
  isOpen: boolean;
  software: Software | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteSoftwareModal = ({ isOpen, software, onConfirm, onCancel }: DeleteSoftwareModalProps) => {
  if (!isOpen || !software) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Confirmar Eliminación</h3>
            <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar el siguiente software?
          </p>

          <div className="bg-secondary-600/50 rounded-lg p-4 border-2 border-secondary-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Nombre:</span>
                <span className="font-bold text-white">{software.software_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Versión:</span>
                <span className="font-medium text-white">{software.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Categoría:</span>
                <span className="font-medium text-white">{software.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Proveedor:</span>
                <span className="font-medium text-white">{software.vendor}</span>
              </div>
              {software.server_ids.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Servidores instalados:</span>
                  <span className="font-bold text-white">{software.server_ids.length}</span>
                </div>
              )}
            </div>
          </div>

          {software.server_ids.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Advertencia:</span> Este software está instalado en {software.server_ids.length} servidor(es).
                Eliminar este registro no desinstalará el software de los servidores.
              </p>
            </div>
          )}

          {software.license_id && (
            <div className="bg-purple-900/20 border-l-4 border-purple-400 p-4">
              <p className="text-sm text-purple-400">
                <span className="font-semibold">Nota:</span> Este software está vinculado a la licencia #{software.license_id}.
                La licencia no se eliminará.
              </p>
            </div>
          )}

          <div className="bg-danger/20 border-l-4 border-red-400 p-4">
            <p className="text-sm text-danger font-semibold">
              Esta acción eliminará permanentemente el registro de este software del sistema.
            </p>
          </div>
        </div>

        <div className="bg-secondary-600/50 p-6 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Eliminar Software
          </button>
        </div>
      </div>
    </div>
  );
};
