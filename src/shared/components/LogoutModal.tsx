import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface LogoutModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ show, onClose, onConfirm }: LogoutModalProps) => {
  if (!show) return null; // No renderiza nada si el modal está oculto

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50 animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-danger/20 to-danger/30 flex items-center justify-center border-2 border-danger/50">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-danger text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">Cerrar Sesión</h3>
              <p className="text-sm text-gray-400">Confirma tu decisión</p>
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            ¿Estás seguro que deseas cerrar sesión? Deberás ingresar tus credenciales nuevamente para acceder al sistema.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary-700 to-secondary-800 text-gray-300 rounded-xl font-semibold hover:from-secondary-600 hover:to-secondary-700 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-primary-500/50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="flex-1 px-4 py-3 bg-danger-500 hover:bg-danger-400 text-white rounded-xl font-semibold hover:from-danger-90 hover:to-danger-70 transition-all duration-300 shadow-lg shadow-danger/20 hover:shadow-xl hover:shadow-danger/30"
            >
              Sí, cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};