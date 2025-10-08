import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Storage } from '../types';

interface DeleteStorageModalProps {
  isOpen: boolean;
  storage: Storage | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteStorageModal = ({ isOpen, storage, onConfirm, onCancel }: DeleteStorageModalProps) => {
  if (!isOpen || !storage) return null;

  const usagePercent = (storage.used_gb / storage.capacity_gb) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-secondary-900 mb-2">
            Eliminar Almacenamiento
          </h3>

          <p className="text-center text-secondary-600 mb-4">
            ¿Estás seguro de que deseas eliminar el almacenamiento <span className="font-bold text-secondary-900">{storage.storage_name}</span>?
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-800 mb-2">
              <span className="font-semibold">Advertencia:</span> Esta acción no se puede deshacer.
            </p>
            {storage.used_gb > 0 && (
              <p className="text-sm text-red-800">
                Este almacenamiento contiene <span className="font-bold">{storage.used_gb} GB</span> de datos que podrían perderse.
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm text-secondary-600 mb-6">
            <p><span className="font-semibold">Tipo:</span> {storage.storage_type.toUpperCase()}</p>
            <p><span className="font-semibold">Ubicación:</span> {storage.location}</p>
            <p><span className="font-semibold">Capacidad:</span> {storage.capacity_gb} GB</p>
            <p><span className="font-semibold">Uso:</span> {storage.used_gb} GB ({usagePercent.toFixed(1)}%)</p>
            {storage.backup_enabled && (
              <p><span className="font-semibold">Backup:</span> Habilitado</p>
            )}
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
