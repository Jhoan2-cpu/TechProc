import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { TicketCard } from '../components';
import { ticketsService } from '../services/ticketsService';
import { authService } from '../../../services/authService';

interface MyTicketsPageProps {
  onViewDetails: (ticket: Ticket) => void;
  onEscalate: (ticket: Ticket) => void;
  onResolve: (ticket: Ticket) => void;
  refreshTrigger?: number; // Prop para forzar recarga
}

export const MyTicketsPage = ({
  onViewDetails,
  onEscalate,
  onResolve,
  refreshTrigger
}: MyTicketsPageProps) => {
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadMyTickets();
  }, [refreshTrigger]); // Recargar cuando cambie refreshTrigger

  const loadMyTickets = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Mis Tickets Asignados
        </h2>
        {!loading && (
          <span className="px-4 py-2 bg-primary-900/20 text-blue-700 rounded-full font-semibold">
            {myTickets.length} tickets
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="text-6xl text-primary-500 mb-4 animate-spin" />
          <p className="text-xl text-gray-300">Cargando tus tickets...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-4">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
          <button
            onClick={loadMyTickets}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tickets List */}
      {!loading && !error && (
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
              <p className="text-xl text-gray-300">No tienes tickets asignados</p>
              <p className="text-sm text-gray-400 mt-2">Los tickets aparecerán aquí cuando te sean asignados o los tomes del pool disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
