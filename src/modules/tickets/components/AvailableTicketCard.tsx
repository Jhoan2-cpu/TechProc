import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faUser,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

interface AvailableTicketCardProps {
  ticket: Ticket;
  formatDate: (dateString: string | null) => string;
  index: number;
  onTakeTicket?: (ticket: Ticket) => void;
  onViewDetails?: (ticket: Ticket) => void;
}

export const AvailableTicketCard = ({ ticket, formatDate, index, onTakeTicket, onViewDetails }: AvailableTicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-blue-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'crítica': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-5 hover:shadow-lg transition-all animate-fade-in ${
        ticket.priority === 'crítica' ? 'border-red-300 bg-red-50' : 'border-secondary-200'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-heading font-bold text-xl text-secondary-900">
              #{ticket.ticket_id} - {ticket.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>
          <p className="text-secondary-700 mb-4">{ticket.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-secondary-600">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-secondary-400" />
              <span>Usuario ID: {ticket.user_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
              <span>{formatDate(ticket.creation_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary-400">Categoría:</span>
              <span className="font-medium text-primary-600">{ticket.category}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:w-40">
          <button
            onClick={() => onTakeTicket?.(ticket)}
            className={`btn text-white ${
              ticket.priority === 'crítica'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            Tomar Ticket
          </button>
          <button
            onClick={() => onViewDetails?.(ticket)}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};
