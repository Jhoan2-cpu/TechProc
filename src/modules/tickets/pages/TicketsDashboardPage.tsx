import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faClipboardList,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import {
  TicketStatsCard,
  TicketCard,
  CriticalTicketAlert,
} from '../components';

interface TicketsDashboardPageProps {
  tickets: Ticket[];
  currentTechnicianId: number;
  onViewDetails: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onTakeTicket: (ticket: Ticket) => void;
}

export const TicketsDashboardPage = ({
  tickets,
  currentTechnicianId,
  onViewDetails,
  onEscalate,
  onTakeTicket
}: TicketsDashboardPageProps) => {
  // Filtrar tickets del técnico actual
  const myTickets = tickets.filter(t => t.assigned_technician === currentTechnicianId);
  const availableTickets = tickets.filter(t => t.assigned_technician === null);

  // Estadísticas personales del técnico
  const myActiveTickets = myTickets.filter(t => t.status === 'abierto' || t.status === 'en_progreso').length;
  const myResolvedToday = myTickets.filter(t => t.status === 'resuelto').length;
  const criticalAvailable = availableTickets.filter(t => t.priority === 'crítica').length;
  const totalAvailable = availableTickets.length;

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
    <>
      {/* Estadísticas Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TicketStatsCard
          title="Mis Tickets Activos"
          value={myActiveTickets}
          icon={faClipboardList}
          colorClass="from-blue-50 to-blue-100 text-blue-700 bg-blue-600"
          index={0}
        />
        <TicketStatsCard
          title="Resueltos Hoy"
          value={myResolvedToday}
          icon={faCheckCircle}
          colorClass="from-green-50 to-green-100 text-green-700 bg-green-600"
          index={1}
        />
        <TicketStatsCard
          title="Tickets Disponibles"
          value={totalAvailable}
          icon={faInbox}
          colorClass="from-purple-50 to-purple-100 text-purple-700 bg-purple-600"
          index={2}
        />
        <TicketStatsCard
          title="Críticos Disponibles"
          value={criticalAvailable}
          icon={faExclamationTriangle}
          colorClass="from-red-50 to-red-100 text-red-700 bg-red-600"
          index={3}
        />
      </div>

      {/* Mis Tickets Activos */}
      <div className="card p-6 animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">
          Mis Tickets Activos
        </h2>
        <div className="space-y-4">
          {myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length > 0 ? (
            myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').map((ticket, index) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                formatDate={formatDate}
                index={index}
                variant="compact"
                onViewDetails={onViewDetails}
                onEscalate={onEscalate}
              />
            ))
          ) : (
            <p className="text-center text-secondary-500 py-8">No tienes tickets activos en este momento</p>
          )}
        </div>
      </div>

      {/* Tickets Críticos Disponibles */}
      {criticalAvailable > 0 && (
        <div className="card p-6 animate-slide-up bg-red-50 border-red-200">
          <h2 className="text-xl font-heading font-bold text-red-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Tickets Críticos Disponibles - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {availableTickets.filter(t => t.priority === 'crítica').map((ticket) => (
              <CriticalTicketAlert
                key={ticket.ticket_id}
                ticket={ticket}
                formatDate={formatDate}
                onTakeTicket={onTakeTicket}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
