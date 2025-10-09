import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../types';

interface DeleteFAQModalProps {
  isOpen: boolean;
  faq: ChatbotFAQ | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteFAQModal = ({ isOpen, faq, onConfirm, onCancel }: DeleteFAQModalProps) => {
  if (!isOpen || !faq) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Eliminar FAQ</h3>
            <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar la siguiente pregunta frecuente?
          </p>

          <div className="bg-secondary-600/50 rounded-lg p-4 border-2 border-secondary-200">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Pregunta</p>
                <p className="font-bold text-white">{faq.question}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Respuesta</p>
                <p className="text-sm text-gray-300">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-4 text-xs pt-2">
                <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                  {faq.category}
                </span>
                <span className="text-gray-400">
                  Usada {faq.usage_count} veces
                </span>
                <span className={`px-2 py-1 rounded ${
                  faq.active ? 'bg-success/20 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {faq.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>

          {faq.usage_count > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Advertencia:</span> Esta FAQ ha sido utilizada {faq.usage_count} veces.
                Los usuarios que han recibido esta respuesta ya no tendrán acceso a ella.
              </p>
            </div>
          )}

          <div className="bg-danger/20 border-l-4 border-red-400 p-4">
            <p className="text-sm text-danger font-semibold">
              Esta FAQ será eliminada permanentemente del chatbot.
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
            Eliminar FAQ
          </button>
        </div>
      </div>
    </div>
  );
};
