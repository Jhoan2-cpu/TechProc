import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import type { ContactForm } from '../types';

interface PendingContactsSectionProps {
  contacts: ContactForm[];
  formatDateTime: (dateString: string | null) => string;
  getPriorityColor: (priority: string) => string;
  onRespond: (contact: ContactForm) => void;
}

export const PendingContactsSection = ({
  contacts,
  formatDateTime,
  getPriorityColor,
  onRespond,
}: PendingContactsSectionProps) => {
  const pendingContacts = contacts.filter(c => c.status === 'pending');

  if (pendingContacts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 backdrop-blur-sm rounded-xl p-6 border-2 border-orange-500/50 shadow-xl shadow-orange-500/10">
      <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faEnvelope} className="text-orange-400" />
        Consultas Pendientes - Requieren Atención
      </h2>
      <div className="space-y-3">
        {pendingContacts.map((contact) => (
          <div
            key={contact.id_contact}
            className="bg-gradient-to-r from-secondary-600/50 to-secondary-700/50 border border-orange-500/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-bold text-white">{contact.full_name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                    {contact.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-1">{contact.subject}</p>
                <p className="text-xs text-gray-400">{contact.email} • {formatDateTime(contact.submission_date)}</p>
              </div>
              <button
                onClick={() => onRespond(contact)}
                className="btn bg-orange-600 hover:bg-orange-700 text-white"
              >
                Responder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
