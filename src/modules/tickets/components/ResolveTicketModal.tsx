import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { ticketsService } from '../services/ticketsService';
import { authService } from '../../../services/authService';

interface ResolveTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResolveTicketModal = ({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: ResolveTicketModalProps) => {
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Obtener el employee ID del técnico actual
      const currentEmployee = authService.getCurrentEmployee();
      if (!currentEmployee) {
        setError('No se pudo obtener los datos del empleado');
        return;
      }

      // Llamar al API para resolver el ticket
      await ticketsService.resolve(ticket.ticket_id, {
        resolution_notes: resolution,
        technician_id: currentEmployee.id,
      });

      // Éxito - cerrar modal y notificar al padre
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al resolver el ticket');
      console.error('Error resolving ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setResolution('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-white" />
            <h2 className="text-2xl font-heading font-bold text-white">
              Resolver Ticket
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Ticket Info */}
          <div className="bg-success/20 border border-green-200 rounded-lg p-4">
            <h3 className="font-heading font-bold text-lg text-success mb-2">
              Ticket #{ticket.ticket_id}
            </h3>
            <p className="text-sm text-green-800 mb-2">{ticket.title}</p>
            <p className="text-xs text-green-700">{ticket.description}</p>
            <div className="mt-2 flex gap-2 items-center">
              <span className="text-xs text-green-700">
                Prioridad: <span className="font-semibold">{ticket.priority}</span>
              </span>
              <span className="text-green-300">•</span>
              <span className="text-xs text-green-700">
                Usuario ID: <span className="font-semibold">{ticket.user_id}</span>
              </span>
              <span className="text-green-300">•</span>
              <span className="text-xs text-green-700">
                Categoría: <span className="font-semibold">{ticket.category}</span>
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Resolution Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción de la Solución *
            </label>
            <textarea
              required
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="input min-h-[200px]"
              placeholder="Describe detalladamente la solución implementada, los pasos realizados y cualquier acción de seguimiento necesaria..."
              disabled={submitting}
            />
          </div>

          {/* Info Note */}
          <div className="bg-primary-900/20 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-primary-400">
              <strong>Nota:</strong> Al resolver este ticket, su estado cambiará a "Resuelto" y se registrará la fecha de resolución.
              El usuario será notificado de la solución implementada.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Resolviendo...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Marcar como Resuelto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
