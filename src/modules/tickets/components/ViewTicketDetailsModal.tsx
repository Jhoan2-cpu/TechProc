import { useState, useEffect } from 'react';
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
  faSpinner,
  faEnvelope,
  faPhone,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket, TicketDetail } from '../types';
import { ticketsService } from '../services/ticketsService';

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
  const [ticketDetails, setTicketDetails] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar detalles del ticket desde el API cuando se abre el modal
  useEffect(() => {
    if (isOpen && ticket) {
      loadTicketDetails();
    }
  }, [isOpen, ticket]);

  const loadTicketDetails = async () => {
    if (!ticket) return;

    try {
      setLoading(true);
      setError('');

      // Obtener detalles completos del ticket desde el API
      const details = await ticketsService.getById(ticket.ticket_id);
      setTicketDetails(details as TicketDetail);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los detalles del ticket');
      console.error('Error al cargar detalles del ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-primary-900/20 border-blue-300';
      case 'media': return 'text-yellow-600 bg-warning/20 border-yellow-300';
      case 'alta': return 'text-orange-600 bg-orange-900/20 border-orange-300';
      case 'crítica': return 'text-red-600 bg-danger/20 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto': return 'bg-primary-900/20 text-blue-700 border-blue-300';
      case 'en_progreso': return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'resuelto': return 'bg-success/20 text-green-700 border-green-300';
      case 'cerrado': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'escalado': return 'bg-danger/20 text-red-700 border-red-300';
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

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'asignacion': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'escalacion': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'escalacion_aprobada': return 'bg-green-100 text-green-800 border-green-300';
      case 'resolucion': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cierre': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'asignacion': return 'Asignación';
      case 'escalacion': return 'Escalación';
      case 'escalacion_aprobada': return 'Escalación Aprobada';
      case 'resolucion': return 'Resolución';
      case 'cierre': return 'Cierre';
      default: return actionType;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Detalles del Ticket #{ticket.ticket_id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-6xl text-primary-500 mb-4 animate-spin" />
              <p className="text-xl text-gray-300">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-4">
                <p className="text-red-400 text-lg">{error}</p>
              </div>
              <button
                onClick={loadTicketDetails}
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
              >
                Reintentar
              </button>
            </div>
          ) : ticketDetails ? (
            <>
          {/* Title and Status */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">
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
              <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-900/20 text-purple-700 border-2 border-purple-300">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {ticket.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-secondary-600/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Descripción</h4>
            <p className="text-white">{ticket.description}</p>
          </div>

          {/* User Information */}
          <div className="bg-primary-900/20 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
              <h4 className="text-lg font-semibold text-primary-400">Información del Usuario</h4>
            </div>
            <div className="space-y-2">
              <p className="text-primary-400 font-medium">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {ticketDetails.user.name}
              </p>
              <p className="text-primary-400">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                {ticketDetails.user.email}
              </p>
              {ticketDetails.user.phone && (
                <p className="text-primary-400">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  {ticketDetails.user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Assigned Technician Information */}
          {ticketDetails.assigned_technician_detail && (
            <div className="bg-success/20 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faUser} className="text-green-600" />
                <h4 className="text-lg font-semibold text-success">Técnico Asignado</h4>
              </div>
              <div className="space-y-2">
                <p className="text-green-800 font-medium">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {ticketDetails.assigned_technician_detail.name}
                </p>
                {ticketDetails.assigned_technician_detail.speciality && (
                  <p className="text-green-800">
                    <FontAwesomeIcon icon={faTag} className="mr-2" />
                    {ticketDetails.assigned_technician_detail.speciality}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-purple-600" />
                <h4 className="text-sm font-semibold text-purple-400">Fecha de Creación</h4>
              </div>
              <p className="text-purple-400 text-sm">{formatDate(ticket.creation_date)}</p>
            </div>

            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-orange-600" />
                <h4 className="text-sm font-semibold text-orange-400">Fecha de Asignación</h4>
              </div>
              <p className="text-orange-800 text-sm">{formatDate(ticket.assignment_date)}</p>
            </div>

            {ticket.resolution_date && (
              <div className="bg-success/20 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                  <h4 className="text-sm font-semibold text-success">Fecha de Resolución</h4>
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
          {ticketDetails.notes && (
            <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faStickyNote} className="text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-900">Notas</h4>
              </div>
              <p className="text-amber-800">{ticketDetails.notes}</p>
            </div>
          )}

          {/* Tracking Section */}
          {ticketDetails.tracking && ticketDetails.tracking.length > 0 && (
            <div className="bg-secondary-500/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faListCheck} className="text-primary-400 text-xl" />
                <h4 className="text-lg font-semibold text-white">Historial de Seguimiento</h4>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ticketDetails.tracking.map((track, index) => (
                  <div
                    key={index}
                    className="bg-secondary-600/70 rounded-lg p-4 border-l-4 border-primary-500 hover:bg-secondary-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionTypeColor(track.action_type)}`}>
                        {getActionTypeLabel(track.action_type)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
                        {formatDate(track.follow_up_date)}
                      </span>
                    </div>
                    <p className="text-white text-sm">{track.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200 bg-secondary-600/50">
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
