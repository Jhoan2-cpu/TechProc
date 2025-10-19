import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { AvailableTicketCard } from '../components';
import { ticketsService } from '../services/ticketsService';
import { authService } from '../../../services/authService';

interface AvailableTicketsPageProps {
  onTakeTicket: (ticket: Ticket) => void;
  onViewDetails: (ticket: Ticket) => void;
}

export const AvailableTicketsPage = ({
  onTakeTicket,
  onViewDetails
}: AvailableTicketsPageProps) => {
  const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [takingTicketId, setTakingTicketId] = useState<number | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener todos los tickets desde la API
      const response = await ticketsService.getAll();

      // Filtrar tickets sin asignar (disponibles)
      const unassignedTickets = response.tickets.filter(
        t => t.assigned_technician === null
      );

      setAvailableTickets(unassignedTickets);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los tickets disponibles');
      console.error('Error al cargar tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeTicket = async (ticket: Ticket) => {
    try {
      setTakingTicketId(ticket.ticket_id);
      setError('');
      setSuccessMessage('');

      // Obtener el ID del empleado actual (technician_id es el employee.id)
      const currentEmployee = authService.getCurrentEmployee();
      if (!currentEmployee) {
        setError('No se pudo obtener los datos del empleado');
        return;
      }

      // Llamar al servicio para tomar el ticket
      const response = await ticketsService.take(ticket.ticket_id, {
        technician_id: currentEmployee.id,
      });

      // Mostrar mensaje de éxito
      if (response.success) {
        setSuccessMessage(response.message);

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => setSuccessMessage(''), 5000);
      }

      // Llamar al callback del padre
      onTakeTicket(ticket);

      // Recargar la lista de tickets
      await loadTickets();
    } catch (err: any) {
      setError(err.message || 'Error al tomar el ticket');
      console.error('Error al tomar ticket:', err);
    } finally {
      setTakingTicketId(null);
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
          Tickets Disponibles para Asignar
        </h2>
        {!loading && (
          <span className="px-4 py-2 bg-purple-900/20 text-purple-700 rounded-full font-semibold">
            {availableTickets.length} disponibles
          </span>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 animate-fade-in">
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 text-center">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="text-6xl text-primary-500 mb-4 animate-spin" />
          <p className="text-xl text-gray-300">Cargando tickets disponibles...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-4">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
          <button
            onClick={loadTickets}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tickets List */}
      {!loading && !error && (
        <div className="space-y-4">
          {availableTickets.length > 0 ? (
            availableTickets.map((ticket, index) => (
              <AvailableTicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                formatDate={formatDate}
                index={index}
                onTakeTicket={handleTakeTicket}
                onViewDetails={onViewDetails}
                isTaking={takingTicketId === ticket.ticket_id}
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
      )}
    </div>
  );
};
