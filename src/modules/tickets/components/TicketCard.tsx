import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faUser,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  formatDate: (dateString: string | null) => string;
  index: number;
  showActions?: boolean;
  variant?: 'default' | 'compact';
  onViewDetails?: (ticket: Ticket) => void;
  onEscalate?: (ticket: Ticket) => void;
  onResolve?: (ticket: Ticket) => void;
}

export const TicketCard = ({
  ticket,
  formatDate,
  index,
  showActions = true,
  variant = 'default',
  onViewDetails,
  onEscalate,
  onResolve,
}: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-primary-900/20';
      case 'media': return 'text-yellow-600 bg-warning/20';
      case 'alta': return 'text-orange-600 bg-orange-900/20';
      case 'crítica': return 'text-red-600 bg-danger/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto': return 'bg-primary-900/20 text-blue-700';
      case 'en_progreso': return 'bg-warning/20 text-yellow-700';
      case 'resuelto': return 'bg-success/20 text-green-700';
      case 'cerrado': return 'bg-gray-100 text-gray-700';
      case 'escalado': return 'bg-danger/20 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-heading font-bold text-lg text-white">
                #{ticket.ticket_id} - {ticket.title}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              {ticket.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                <span>Usuario ID: {ticket.user_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                <span>{formatDate(ticket.creation_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Categoría:</span>
                <span className="font-medium">{ticket.category}</span>
              </div>
            </div>
            {ticket.notes && (
              <div className="mt-2 text-sm text-gray-400 bg-secondary-600/50 p-2 rounded">
                <span className="font-medium">Nota:</span> {ticket.notes}
              </div>
            )}
          </div>
          {showActions && (
            <div className="flex md:flex-col gap-2">
              <button
                onClick={() => onViewDetails?.(ticket)}
                className="btn bg-primary-600 hover:bg-primary-700 text-white text-sm"
              >
                Ver Detalles
              </button>
              {ticket.status !== 'resuelto' && ticket.status !== 'cerrado' && (
                <>
                  <button
                    onClick={() => onResolve?.(ticket)}
                    className="btn bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Resolver
                  </button>
                  <button
                    onClick={() => onEscalate?.(ticket)}
                    className="btn bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  >
                    Escalar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="border border-secondary-200 rounded-lg p-5 hover:shadow-lg transition-all animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-heading font-bold text-xl text-white">
              #{ticket.ticket_id} - {ticket.title}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
              </span>
            </div>
          </div>
          <p className="text-gray-300 mb-4">{ticket.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              <span>Usuario ID: {ticket.user_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              <span>Creado: {formatDate(ticket.creation_date)}</span>
            </div>
            {ticket.assignment_date && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                <span>Asignado: {formatDate(ticket.assignment_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Categoría:</span>
              <span className="font-medium text-primary-600">{ticket.category}</span>
            </div>
          </div>
          {ticket.notes && (
            <div className="mt-3 text-sm text-gray-300 bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
              <span className="font-semibold">Nota:</span> {ticket.notes}
            </div>
          )}
        </div>
        {showActions && (
          <div className="flex lg:flex-col gap-2 lg:w-40">
            <button
              onClick={() => onViewDetails?.(ticket)}
              className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none"
            >
              Ver Detalles
            </button>
            {ticket.status !== 'resuelto' && ticket.status !== 'cerrado' && (
              <>
                <button
                  onClick={() => onResolve?.(ticket)}
                  className="btn bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none"
                >
                  Resolver
                </button>
                <button
                  onClick={() => onEscalate?.(ticket)}
                  className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1 lg:flex-none"
                >
                  Escalar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
