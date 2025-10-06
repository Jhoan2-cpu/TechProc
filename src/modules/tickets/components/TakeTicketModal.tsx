import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

interface TakeTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ticketId: number) => void;
}

export const TakeTicketModal = ({
  ticket,
  isOpen,
  onClose,
  onConfirm,
}: TakeTicketModalProps) => {
  if (!isOpen || !ticket) return null;

  const handleConfirm = () => {
    onConfirm(ticket.ticket_id);
    onClose();
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-white" />
            <h2 className="text-2xl font-heading font-bold text-white">
              Tomar Ticket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-secondary-700">
            ¿Estás seguro de que deseas tomar este ticket? Será asignado a ti inmediatamente.
          </p>

          {/* Ticket Info */}
          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-heading font-bold text-lg text-secondary-900">
                #{ticket.ticket_id} - {ticket.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityColor(ticket.priority)}`}>
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
            </div>
            <p className="text-sm text-secondary-700 mb-3">{ticket.description}</p>
            <div className="flex gap-4 text-xs text-secondary-600">
              <span>Usuario ID: {ticket.user_id}</span>
              <span>•</span>
              <span>Categoría: {ticket.category}</span>
            </div>
          </div>

          {ticket.priority === 'crítica' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>¡Atención!</strong> Este es un ticket crítico que requiere atención inmediata.
              </p>
            </div>
          )}

          {ticket.priority === 'alta' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                <strong>Nota:</strong> Este ticket tiene prioridad alta y debe ser atendido lo antes posible.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200 bg-secondary-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn bg-secondary-200 text-secondary-700 hover:bg-secondary-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`btn text-white ${
              ticket.priority === 'crítica'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Confirmar y Tomar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
