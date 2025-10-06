import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { TicketCard } from '../components';

interface MyTicketsPageProps {
  tickets: Ticket[];
  currentTechnicianId: number;
  onViewDetails: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
}

export const MyTicketsPage = ({
  tickets,
  currentTechnicianId,
  onViewDetails,
  onEscalate,
  onResolve
}: MyTicketsPageProps) => {
  const myTickets = tickets.filter(t => t.assigned_technician === currentTechnicianId);

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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Mis Tickets Asignados
        </h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
          {myTickets.length} tickets
        </span>
      </div>

      <div className="space-y-4">
        {myTickets.length > 0 ? (
          myTickets.map((ticket, index) => (
            <TicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              formatDate={formatDate}
              index={index}
              onViewDetails={onViewDetails}
              onEscalate={onEscalate}
              onResolve={onResolve}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faClipboardList} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-secondary-500">No tienes tickets asignados</p>
            <p className="text-sm text-secondary-400 mt-2">Los tickets aparecerán aquí cuando te sean asignados o los tomes del pool disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
