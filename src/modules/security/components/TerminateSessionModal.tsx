import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface TerminateSessionModalProps {
  isOpen: boolean;
  sessionId: number | null;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TerminateSessionModal = ({
  isOpen,
  sessionId,
  userName,
  onConfirm,
  onCancel,
}: TerminateSessionModalProps) => {
  if (!isOpen || !sessionId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-secondary-900 mb-2">
            Terminar Sesión
          </h3>

          <p className="text-center text-secondary-600 mb-6">
            ¿Estás seguro de que deseas cerrar la sesión de <span className="font-semibold text-secondary-900">{userName}</span>?
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Advertencia:</span> El usuario será desconectado inmediatamente y deberá iniciar sesión nuevamente.
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
              className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
            >
              Terminar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
