import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { AvailableTicketCard } from '../components';

interface AvailableTicketsPageProps {
  tickets: Ticket[];
  onTakeTicket: (ticket: Ticket) => void;
  onViewDetails: (ticket: Ticket) => void;
}

export const AvailableTicketsPage = ({
  tickets,
  onTakeTicket,
  onViewDetails
}: AvailableTicketsPageProps) => {
  const availableTickets = tickets.filter(t => t.assigned_technician === null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Tickets Disponibles para Asignar
        </h2>
        <span className="px-4 py-2 bg-purple-900/20 text-purple-700 rounded-full font-semibold">
          {availableTickets.length} disponibles
        </span>
      </div>

      <div className="space-y-4">
        {availableTickets.length > 0 ? (
          availableTickets.map((ticket, index) => (
            <AvailableTicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              formatDate={formatDate}
              index={index}
              onTakeTicket={onTakeTicket}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-gray-300">No hay tickets disponibles</p>
            <p className="text-sm text-gray-400 mt-2">Todos los tickets han sido asignados</p>
          </div>
        )}
      </div>
    </div>
  );
};
