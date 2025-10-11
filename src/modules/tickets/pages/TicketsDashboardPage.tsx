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
} from '../components';

interface TicketsDashboardPageProps {
  tickets: Ticket[];
  currentTechnicianId: number;
  onViewDetails: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
}

export const TicketsDashboardPage = ({
  tickets,
  currentTechnicianId,
  onViewDetails,
  onEscalate,
  onResolve
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <TicketStatsCard
          title="Mis Tickets Activos"
          value={myActiveTickets}
          icon={faClipboardList}
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20"
          index={0}
        />
        <TicketStatsCard
          title="Resueltos Hoy"
          value={myResolvedToday}
          icon={faCheckCircle}
          iconBgColor="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/20"
          index={1}
        />
        <TicketStatsCard
          title="Tickets Disponibles"
          value={totalAvailable}
          icon={faInbox}
          iconBgColor="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"
          index={2}
        />
        <TicketStatsCard
          title="Críticos Disponibles"
          value={criticalAvailable}
          icon={faExclamationTriangle}
          iconBgColor="bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20"
          index={3}
        />
      </div>

      {/* Mis Tickets Activos */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-white mb-4">
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
                onResolve={onResolve}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">No tienes tickets activos en este momento</p>
          )}
        </div>
      </div>
    </>
  );
};
