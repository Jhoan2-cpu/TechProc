import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faUser,
  faCalendar,
  faArrowUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

// Datos mock extendidos
const mockTickets: Ticket[] = [
  {
    ticket_id: 1,
    assigned_technician: 1,
    user_id: 5,
    title: 'Error al cargar m�dulo de seguridad',
    description: 'El m�dulo de seguridad no carga correctamente despu�s de la �ltima actualizaci�n',
    priority: 'alta',
    status: 'en_progreso',
    creation_date: '2024-03-15 10:30:00',
    assignment_date: '2024-03-15 11:00:00',
    resolution_date: null,
    close_date: null,
    category: 'Seguridad',
    notes: 'Investigando posible conflicto de versiones',
  },
  {
    ticket_id: 2,
    assigned_technician: 2,
    user_id: 8,
    title: 'No puedo acceder al sistema',
    description: 'Desde esta ma�ana no puedo iniciar sesi�n, aparece error de credenciales',
    priority: 'crítica',
    status: 'abierto',
    creation_date: '2024-03-15 09:15:00',
    assignment_date: null,
    resolution_date: null,
    close_date: null,
    category: 'Acceso',
    notes: null,
  },
  {
    ticket_id: 3,
    assigned_technician: 1,
    user_id: 12,
    title: 'Respaldo no se complet�',
    description: 'El respaldo programado de ayer no se complet� correctamente',
    priority: 'media',
    status: 'resuelto',
    creation_date: '2024-03-14 14:20:00',
    assignment_date: '2024-03-14 15:00:00',
    resolution_date: '2024-03-15 08:30:00',
    close_date: null,
    category: 'Respaldos',
    notes: 'Se reinici� el proceso de respaldo manualmente',
  },
  {
    ticket_id: 4,
    assigned_technician: 3,
    user_id: 15,
    title: 'Lentitud en aplicaci�n web',
    description: 'La aplicaci�n web presenta lentitud al cargar los reportes',
    priority: 'baja',
    status: 'abierto',
    creation_date: '2024-03-15 13:45:00',
    assignment_date: null,
    resolution_date: null,
    close_date: null,
    category: 'Rendimiento',
    notes: null,
  },
  {
    ticket_id: 5,
    assigned_technician: 1,
    user_id: 20,
    title: 'Alerta de seguridad - Múltiples intentos de acceso',
    description: 'Se detectaron múltiples intentos de acceso fallidos desde IP desconocida',
    priority: 'crítica',
    status: 'escalado',
    creation_date: '2024-03-15 08:00:00',
    assignment_date: '2024-03-15 08:15:00',
    resolution_date: null,
    close_date: null,
    category: 'Seguridad',
    notes: 'Escalado a equipo de seguridad avanzada',
  },
];

export const TicketsManagementPage = () => {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-blue-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'cr�tica': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto': return 'bg-blue-100 text-blue-700';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-700';
      case 'resuelto': return 'bg-green-100 text-green-700';
      case 'cerrado': return 'bg-gray-100 text-gray-700';
      case 'escalado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h1 className="text-3xl font-heading font-bold text-secondary-900">
          tickets/management
        </h1>
        <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
          <FontAwesomeIcon icon={faPlus} />
          Crear Ticket
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              />
              <input
                type="text"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="all">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
            <option value="escalado">Escalado</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="select"
          >
            <option value="all">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="cr�tica">Cr�tica</option>
          </select>
        </div>
      </div>

      {/* Tabla de Tickets */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  T�tulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Categor�a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Creaci�n
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.ticket_id}
                  className="hover:bg-secondary-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    #{ticket.ticket_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-900">
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{ticket.title}</p>
                      <p className="text-secondary-600 text-xs truncate">{ticket.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                      <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {formatDate(ticket.creation_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600 text-lg">No se encontraron tickets</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-secondary-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-secondary-900">
                  Detalles del Ticket #{selectedTicket.ticket_id}
                </h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-secondary-400 hover:text-secondary-600 text-2xl"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* T�tulo y Estado */}
              <div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{selectedTicket.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    Prioridad: {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTicket.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>

              {/* Descripci�n */}
              <div>
                <label className="text-sm font-medium text-secondary-600 block mb-1">Descripci�n</label>
                <p className="text-secondary-900 bg-secondary-50 p-3 rounded-lg">{selectedTicket.description}</p>
              </div>

              {/* Informaci�n del Ticket */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Usuario ID
                  </label>
                  <p className="font-semibold text-secondary-900">{selectedTicket.user_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">Categor�a</label>
                  <p className="font-semibold text-secondary-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    Fecha de Creaci�n
                  </label>
                  <p className="font-semibold text-secondary-900">{formatDate(selectedTicket.creation_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">Fecha de Asignaci�n</label>
                  <p className="font-semibold text-secondary-900">{formatDate(selectedTicket.assignment_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">Fecha de Resoluci�n</label>
                  <p className="font-semibold text-secondary-900">{formatDate(selectedTicket.resolution_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">T�cnico Asignado</label>
                  <p className="font-semibold text-secondary-900">
                    {selectedTicket.assigned_technician ? `T�cnico #${selectedTicket.assigned_technician}` : 'Sin asignar'}
                  </p>
                </div>
              </div>

              {/* Notas */}
              {selectedTicket.notes && (
                <div>
                  <label className="text-sm font-medium text-secondary-600 block mb-1">Notas</label>
                  <p className="text-secondary-900 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                    {selectedTicket.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
