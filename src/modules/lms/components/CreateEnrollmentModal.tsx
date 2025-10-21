import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface CreateEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEnrollmentModal = ({ isOpen, onClose }: CreateEnrollmentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-500 to-primary-600 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-white">
              Matricular Estudiante
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">
              Formulario de matrícula - Próximamente
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end p-6 pt-4 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
          >
            Cancelar
          </button>
          <button
            disabled
            className="btn btn-primary opacity-50 cursor-not-allowed"
          >
            Matricular
          </button>
        </div>
      </div>
    </div>
  );
};
