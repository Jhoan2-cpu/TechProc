import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface UnblockIPModalProps {
  isOpen: boolean;
  ipAddress: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnblockIPModal = ({
  isOpen,
  ipAddress,
  onConfirm,
  onCancel,
}: UnblockIPModalProps) => {
  if (!isOpen || !ipAddress) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success/20 rounded-full mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-white mb-2">
            Desbloquear Dirección IP
          </h3>

          <p className="text-center text-gray-400 mb-6">
            ¿Estás seguro de que deseas desbloquear la IP <span className="font-mono font-semibold text-white">{ipAddress}</span>?
          </p>

          <div className="bg-primary-900/20 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-primary-400">
              <span className="font-semibold">Información:</span> Esta IP podrá acceder nuevamente al sistema una vez desbloqueada.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 btn bg-green-600 hover:bg-green-700 text-white"
            >
              Desbloquear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
