import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../types';

interface ChatbotFAQCardProps {
  faq: ChatbotFAQ;
  index: number;
}

export const ChatbotFAQCard = ({ faq, index }: ChatbotFAQCardProps) => {
  return (
    <div
      className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{faq.category}</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {faq.usage_count} usos
            </span>
            {faq.active && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Activa</span>
            )}
          </div>
          <h4 className="font-semibold text-secondary-900 mb-2">{faq.question}</h4>
          <p className="text-sm text-secondary-700 mb-2">{faq.answer}</p>
          <div className="flex flex-wrap gap-1">
            {faq.keywords.map((keyword, i) => (
              <span key={i} className="px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn bg-primary-600 hover:bg-primary-700 text-white">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="btn bg-yellow-600 hover:bg-yellow-700 text-white">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};
