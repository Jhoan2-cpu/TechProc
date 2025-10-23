import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { License } from '../types';

interface DeleteLicenseModalProps {
  isOpen: boolean;
  license: License | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteLicenseModal = ({ isOpen, license, onConfirm, onCancel }: DeleteLicenseModalProps) => {
  if (!isOpen || !license) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger/20 rounded-full mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-white mb-2">
            Eliminar Licencia
          </h3>

          <p className="text-center text-gray-400 mb-4">
            ¿Estás seguro de que deseas eliminar la licencia de <span className="font-bold text-white">{license.software_name}</span>?
          </p>

          <div className="bg-danger/20 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-danger">
              <span className="font-semibold">Advertencia:</span> Esta acción no se puede deshacer. Se perderá toda la información asociada a esta licencia.
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-400 mb-6">
            <p><span className="font-semibold">Proveedor:</span> {license.provider}</p>
            <p><span className="font-semibold">Tipo:</span> {license.license_type}</p>
            <p><span className="font-semibold">Licencias:</span> {license.seats_used}/{license.seats_total}</p>
            <p><span className="font-semibold">Costo Anual:</span> S/ {(license.cost_annual || 0).toLocaleString()}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
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
