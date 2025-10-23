import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faUser, faCalendar, faExclamationCircle, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

export const TicketCard = ({ ticket, index }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      'baja': 'text-blue-400',
      'media': 'text-yellow-400',
      'alta': 'text-orange-400',
      'critica': 'text-red-400'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-400';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'baja': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'media': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'alta': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'critica': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    return `px-2 py-1 rounded-full text-xs border ${colors[priority as keyof typeof colors] || colors.baja}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'abierto': 'text-blue-400',
      'en_progreso': 'text-yellow-400',
      'resuelto': 'text-green-400',
      'cerrado': 'text-gray-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'abierto': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'en_progreso': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'resuelto': 'bg-green-500/20 text-green-400 border-green-500/30',
      'cerrado': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return `px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors] || colors.abierto}`;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'abierto': 'Abierto',
      'en_progreso': 'En Progreso',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'baja': 'Baja',
      'media': 'Media',
      'alta': 'Alta',
      'critica': 'Crítica'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const calculateResolutionTime = () => {
    if (!ticket.resolution_date) return null;
    const creation = new Date(ticket.creation_date);
    const resolution = new Date(ticket.resolution_date);
    const hours = Math.floor((resolution.getTime() - creation.getTime()) / (1000 * 60 * 60));
    return hours;
  };

  const resolutionTime = calculateResolutionTime();

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faTicket} className="text-primary-400" />
            <h3 className="font-heading font-bold text-lg text-white">
              #{ticket.ticket_id} - {ticket.title}
            </h3>
            <span className={getStatusBadge(ticket.status)}>
              {getStatusLabel(ticket.status)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {ticket.description}
          </p>
          
          <div className="space-y-2 text-sm">
            {ticket.assigned_technician && (
              <div className="flex items-center gap-2 text-gray-300">
                <FontAwesomeIcon icon={faUser} className="w-4 text-primary-400" />
                <span>Técnico: {ticket.assigned_technician.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendar} className="w-4 text-primary-400" />
              <span>Creado: {new Date(ticket.creation_date).toLocaleDateString('es-PE', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>

            {ticket.escalations_count > 0 && (
              <div className="flex items-center gap-2 text-orange-400">
                <FontAwesomeIcon icon={faArrowTrendUp} className="w-4" />
                <span className="font-medium">Escalado {ticket.escalations_count} {ticket.escalations_count === 1 ? 'vez' : 'veces'}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right ml-4">
          <span className={getPriorityBadge(ticket.priority)}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
            {getPriorityLabel(ticket.priority)}
          </span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Categoría</p>
          <p className="text-sm text-white font-medium capitalize">{ticket.category}</p>
        </div>
        
        {ticket.assignment_date && (
          <div className="p-3 bg-primary-900/20 rounded">
            <p className="text-xs text-gray-400 mb-1">Asignado</p>
            <p className="text-sm text-white">
              {new Date(ticket.assignment_date).toLocaleDateString('es-PE')}
            </p>
          </div>
        )}
        
        {ticket.resolution_date && (
          <div className="p-3 bg-primary-900/20 rounded">
            <p className="text-xs text-gray-400 mb-1">Resuelto</p>
            <p className="text-sm text-white">
              {new Date(ticket.resolution_date).toLocaleDateString('es-PE')}
            </p>
          </div>
        )}

        {resolutionTime !== null && (
          <div className="p-3 bg-green-900/20 rounded border border-green-500/30">
            <p className="text-xs text-gray-400 mb-1">Tiempo de Resolución</p>
            <p className="text-sm text-green-400 font-medium">
              {resolutionTime} horas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};