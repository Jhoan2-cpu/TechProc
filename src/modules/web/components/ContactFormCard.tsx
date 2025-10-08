import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { ContactForm } from '../types';

interface ContactFormCardProps {
  contact: ContactForm;
  index: number;
  formatDateTime: (dateString: string | null) => string;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  onRespond: (contact: ContactForm) => void;
  onMarkAsSpam?: (contact: ContactForm) => void;
  onResolve?: (contact: ContactForm) => void;
  onViewDetails?: (contact: ContactForm) => void;
}

export const ContactFormCard = ({
  contact,
  index,
  formatDateTime,
  getPriorityColor,
  getStatusColor,
  onRespond,
  onMarkAsSpam,
  onResolve,
  onViewDetails,
}: ContactFormCardProps) => {
  return (
    <div
      className={`card p-6 animate-fade-in ${contact.status === 'spam' ? 'opacity-50' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-heading font-bold text-secondary-900">{contact.full_name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                  {contact.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  {contact.form_type}
                </span>
              </div>
              <p className="text-sm text-secondary-600">{contact.email} {contact.phone && `• ${contact.phone}`}</p>
              {contact.company && <p className="text-sm text-secondary-600">Empresa: {contact.company}</p>}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-sm font-semibold text-secondary-700 mb-1">Asunto:</p>
            <p className="text-secondary-900">{contact.subject}</p>
          </div>
          <div className="bg-secondary-50 rounded p-3 mb-3">
            <p className="text-sm font-semibold text-secondary-700 mb-1">Mensaje:</p>
            <p className="text-sm text-secondary-900">{contact.message}</p>
          </div>
          {contact.response && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded p-3 mb-3">
              <p className="text-sm font-semibold text-green-800 mb-1">Respuesta enviada:</p>
              <p className="text-sm text-secondary-700">{contact.response}</p>
              <p className="text-xs text-secondary-600 mt-2">Por {contact.assigned_to_name} • {formatDateTime(contact.response_date)}</p>
            </div>
          )}
          <div className="flex gap-4 text-xs text-secondary-600">
            <span><FontAwesomeIcon icon={faClock} className="mr-1" />Recibido: {formatDateTime(contact.submission_date)}</span>
            {contact.assigned_to_name && <span>Asignado a: {contact.assigned_to_name}</span>}
            {contact.utm_source && <span>Fuente: {contact.utm_source}/{contact.utm_medium}</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          {contact.status === 'pending' && (
            <>
              <button
                onClick={() => onRespond(contact)}
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
                title="Responder consulta"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Responder
              </button>
              {onMarkAsSpam && (
                <button
                  onClick={() => onMarkAsSpam(contact)}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                  title="Marcar como spam"
                >
                  Marcar Spam
                </button>
              )}
            </>
          )}
          {contact.status === 'in_progress' && onResolve && (
            <button
              onClick={() => onResolve(contact)}
              className="btn bg-green-600 hover:bg-green-700 text-white"
              title="Marcar como resuelto"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Resolver
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(contact)}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
              title="Ver detalles completos"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
