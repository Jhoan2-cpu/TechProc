import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../types';

interface ChatbotFAQCardProps {
  faq: ChatbotFAQ;
  index: number;
  onEdit: (faq: ChatbotFAQ) => void;
  onDelete: (faq: ChatbotFAQ) => void;
  onToggleActive: (faq: ChatbotFAQ) => void;
}

export const ChatbotFAQCard = ({ faq, index, onEdit, onDelete, onToggleActive }: ChatbotFAQCardProps) => {
  return (
    <div
      className="border border-secondary-200 rounded-lg p-4 hover:shadow-md hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">{faq.category}</span>
            <span className="px-2 py-1 bg-success/20 text-green-700 rounded text-xs">
              {faq.usage_count} usos
            </span>
            {faq.active && (
              <span className="px-2 py-1 bg-success/20 text-green-700 rounded text-xs">Activa</span>
            )}
          </div>
          <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
          <p className="text-sm text-gray-300 mb-2">{faq.answer}</p>
          <div className="flex flex-wrap gap-1">
            {faq.keywords.map((keyword, i) => (
              <span key={i} className="px-2 py-0.5 bg-secondary-100 text-gray-400 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(faq)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
            title="Editar FAQ"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onToggleActive(faq)}
            className={`btn ${faq.active ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
            title={faq.active ? 'Desactivar FAQ' : 'Activar FAQ'}
          >
            <FontAwesomeIcon icon={faq.active ? faToggleOff : faToggleOn} />
          </button>
          <button
            onClick={() => onDelete(faq)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
            title="Eliminar FAQ"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};
