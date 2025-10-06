import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faCalendar,
  faArrowUp,
  faTag,
  faStickyNote,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

interface ViewTicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewTicketDetailsModal = ({
  ticket,
  isOpen,
  onClose,
}: ViewTicketDetailsModalProps) => {
  if (!isOpen || !ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'media': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'alta': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'crítica': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resuelto': return 'bg-green-100 text-green-700 border-green-300';
      case 'cerrado': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'escalado': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Detalles del Ticket #{ticket.ticket_id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title and Status */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-secondary-900 mb-3">
              {ticket.title}
            </h3>
            <div className="flex gap-3 flex-wrap">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getPriorityColor(ticket.priority)}`}>
                <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
                Prioridad: {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(ticket.status)}`}>
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Estado: {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
              </span>
              <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700 border-2 border-purple-300">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {ticket.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-secondary-600 mb-2">Descripción</h4>
            <p className="text-secondary-900">{ticket.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                <h4 className="text-sm font-semibold text-blue-900">Usuario</h4>
              </div>
              <p className="text-blue-800 font-medium">ID: {ticket.user_id}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUser} className="text-green-600" />
                <h4 className="text-sm font-semibold text-green-900">Técnico Asignado</h4>
              </div>
              <p className="text-green-800 font-medium">
                {ticket.assigned_technician ? `ID: ${ticket.assigned_technician}` : 'Sin asignar'}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-purple-600" />
                <h4 className="text-sm font-semibold text-purple-900">Fecha de Creación</h4>
              </div>
              <p className="text-purple-800 text-sm">{formatDate(ticket.creation_date)}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-orange-600" />
                <h4 className="text-sm font-semibold text-orange-900">Fecha de Asignación</h4>
              </div>
              <p className="text-orange-800 text-sm">{formatDate(ticket.assignment_date)}</p>
            </div>

            {ticket.resolution_date && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                  <h4 className="text-sm font-semibold text-green-900">Fecha de Resolución</h4>
                </div>
                <p className="text-green-800 text-sm">{formatDate(ticket.resolution_date)}</p>
              </div>
            )}

            {ticket.close_date && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Fecha de Cierre</h4>
                </div>
                <p className="text-gray-800 text-sm">{formatDate(ticket.close_date)}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {ticket.notes && (
            <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faStickyNote} className="text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-900">Notas</h4>
              </div>
              <p className="text-amber-800">{ticket.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200 bg-secondary-50">
          <button
            onClick={onClose}
            className="btn bg-secondary-600 hover:bg-secondary-700 text-white w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
