import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface UnblockUserModalProps {
  isOpen: boolean;
  userName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnblockUserModal = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: UnblockUserModalProps) => {
  if (!isOpen || !userName) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-secondary-900 mb-2">
            Desbloquear Usuario
          </h3>

          <p className="text-center text-secondary-600 mb-6">
            ¿Estás seguro de que deseas desbloquear al usuario <span className="font-semibold text-secondary-900">{userName}</span>?
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Información:</span> Este usuario podrá acceder nuevamente al sistema una vez desbloqueado.
            </p>
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
