import { useState, useEffect } from 'react';
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
import { apiRequest } from '../../../services/api.config';
import { ticketsService } from '../services/ticketsService';
import { authService } from '../../../services/authService';

interface TicketStats {
  total_tickets: number;
  by_status: {
    abierto: number;
    en_proceso: number;
    resuelto: number;
    cerrado: number;
  };
  by_priority: {
    baja: number;
    media: number;
    alta: number;
    critica: number;
  };
  by_category: Record<string, number>;
  average_resolution_time_hours: number;
  pending_escalations: number;
}

interface TicketsDashboardPageProps {
  onViewDetails: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
  refreshTrigger?: number;
}

export const TicketsDashboardPage = ({
  onViewDetails,
  onEscalate,
  onResolve,
  refreshTrigger
}: TicketsDashboardPageProps) => {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState<string>('');

  // Cargar estadísticas desde el API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<{ success: boolean; data: TicketStats }>('/tickets/stats', {
          method: 'GET',
        });

        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  // Cargar tickets asignados al empleado
  useEffect(() => {
    loadMyTickets();
  }, [refreshTrigger]);

  const loadMyTickets = async () => {
    try {
      setLoadingTickets(true);
      setError('');

      // Obtener el ID del empleado actual
      const currentEmployee = authService.getCurrentEmployee();
      if (!currentEmployee) {
        setError('No se pudo obtener los datos del empleado');
        return;
      }

      // Obtener tickets asignados al técnico actual
      const response = await ticketsService.getAll({
        assigned_technician: currentEmployee.id
      });

      setMyTickets(response.tickets);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tus tickets asignados');
      console.error('Error al cargar tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

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
      {/* Estadísticas por Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loading ? (
          <div className="col-span-4 text-center text-gray-400 py-8">
            Cargando estadísticas...
          </div>
        ) : stats ? (
          <>
            <TicketStatsCard
              title="Abiertos"
              value={stats.by_status.abierto}
              icon={faInbox}
              iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20"
              index={0}
            />
            <TicketStatsCard
              title="En Proceso"
              value={stats.by_status.en_proceso}
              icon={faClipboardList}
              iconBgColor="bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/20"
              index={1}
            />
            <TicketStatsCard
              title="Resueltos"
              value={stats.by_status.resuelto}
              icon={faCheckCircle}
              iconBgColor="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/20"
              index={2}
            />
            <TicketStatsCard
              title="Cerrados"
              value={stats.by_status.cerrado}
              icon={faExclamationTriangle}
              iconBgColor="bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-500/20"
              index={3}
            />
          </>
        ) : (
          <div className="col-span-4 text-center text-red-400 py-8">
            Error al cargar estadísticas
          </div>
        )}
      </div>

      {/* Mis Tickets Activos */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-white mb-4">
          Mis Tickets Activos
        </h2>
        <div className="space-y-4">
          {loadingTickets ? (
            <p className="text-center text-gray-400 py-8">Cargando tickets...</p>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadMyTickets}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length > 0 ? (
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
