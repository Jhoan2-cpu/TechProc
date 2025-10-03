import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faArrowUp,
  faUser,
  faCalendar,
  faTachometerAlt,
  faClipboardList,
  faInbox,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { EscalationsPage } from './EscalationsPage';

// Datos mock - Simulando técnico con ID 1
const currentTechnicianId = 1;

const mockTickets: Ticket[] = [
  // Tickets asignados al técnico actual (ID 1)
  {
    ticket_id: 1,
    assigned_technician: 1,
    user_id: 5,
    title: 'Error al cargar módulo de seguridad',
    description: 'El módulo de seguridad no carga correctamente después de la última actualización',
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
    ticket_id: 3,
    assigned_technician: 1,
    user_id: 12,
    title: 'Respaldo no se completó',
    description: 'El respaldo programado de ayer no se completó correctamente',
    priority: 'media',
    status: 'resuelto',
    creation_date: '2024-03-14 14:20:00',
    assignment_date: '2024-03-14 15:00:00',
    resolution_date: '2024-03-15 08:30:00',
    close_date: null,
    category: 'Respaldos',
    notes: 'Se reinició el proceso de respaldo manualmente',
  },
  {
    ticket_id: 5,
    assigned_technician: 1,
    user_id: 20,
    title: 'Fallo en autenticación 2FA',
    description: 'El sistema de doble autenticación no envía códigos por SMS',
    priority: 'alta',
    status: 'abierto',
    creation_date: '2024-03-15 14:00:00',
    assignment_date: '2024-03-15 14:15:00',
    resolution_date: null,
    close_date: null,
    category: 'Seguridad',
    notes: null,
  },
  // Tickets sin asignar (disponibles)
  {
    ticket_id: 2,
    assigned_technician: null,
    user_id: 8,
    title: 'No puedo acceder al sistema',
    description: 'Desde esta mañana no puedo iniciar sesión, aparece error de credenciales',
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
    ticket_id: 4,
    assigned_technician: null,
    user_id: 15,
    title: 'Solicitud de recuperación de contraseña',
    description: 'Usuario olvidó su contraseña y el correo de recuperación no llega',
    priority: 'media',
    status: 'abierto',
    creation_date: '2024-03-15 13:20:00',
    assignment_date: null,
    resolution_date: null,
    close_date: null,
    category: 'Acceso',
    notes: null,
  },
  {
    ticket_id: 6,
    assigned_technician: null,
    user_id: 22,
    title: 'Alerta de seguridad - Múltiples intentos de acceso',
    description: 'Se detectaron múltiples intentos fallidos de inicio de sesión desde IP desconocida',
    priority: 'crítica',
    status: 'abierto',
    creation_date: '2024-03-15 15:00:00',
    assignment_date: null,
    resolution_date: null,
    close_date: null,
    category: 'Seguridad',
    notes: null,
  },
  // Tickets asignados a otros técnicos
  {
    ticket_id: 7,
    assigned_technician: 2,
    user_id: 18,
    title: 'Configuración de firewall',
    description: 'Necesito ajustar las reglas del firewall para nueva aplicación',
    priority: 'baja',
    status: 'en_progreso',
    creation_date: '2024-03-15 11:00:00',
    assignment_date: '2024-03-15 11:30:00',
    resolution_date: null,
    close_date: null,
    category: 'Infraestructura',
    notes: 'Coordinando con equipo de desarrollo',
  },
];

type TabType = 'dashboard' | 'my_tickets' | 'available' | 'escalations';

export const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [tickets] = useState<Ticket[]>(mockTickets);

  // Filtrar tickets del técnico actual
  const myTickets = tickets.filter(t => t.assigned_technician === currentTechnicianId);
  const availableTickets = tickets.filter(t => t.assigned_technician === null);

  // Estadísticas personales del técnico
  const myActiveTickets = myTickets.filter(t => t.status === 'abierto' || t.status === 'en_progreso').length;
  const myResolvedToday = myTickets.filter(t => t.status === 'resuelto').length;
  const criticalAvailable = availableTickets.filter(t => t.priority === 'crítica').length;
  const totalAvailable = availableTickets.length;

  const tabs = [
    { id: 'dashboard' as TabType, name: 'Dashboard', icon: faTachometerAlt },
    { id: 'my_tickets' as TabType, name: 'Mis Tickets', icon: faClipboardList },
    { id: 'available' as TabType, name: 'Tickets Disponibles', icon: faInbox },
    { id: 'escalations' as TabType, name: 'Escalaciones', icon: faExchangeAlt },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'text-blue-600 bg-blue-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'crítica': return 'text-red-600 bg-red-100';
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

  const renderMyTickets = () => (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Mis Tickets Asignados
        </h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
          {myTickets.length} tickets
        </span>
      </div>

      <div className="space-y-4">
        {myTickets.length > 0 ? (
          myTickets.map((ticket, index) => (
            <div
              key={ticket.ticket_id}
              className="border border-secondary-200 rounded-lg p-5 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-heading font-bold text-xl text-secondary-900">
                      #{ticket.ticket_id} - {ticket.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-700 mb-4">{ticket.description}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-secondary-600">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-secondary-400" />
                      <span>Usuario ID: {ticket.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                      <span>Creado: {formatDate(ticket.creation_date)}</span>
                    </div>
                    {ticket.assignment_date && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                        <span>Asignado: {formatDate(ticket.assignment_date)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-secondary-400">Categoría:</span>
                      <span className="font-medium text-primary-600">{ticket.category}</span>
                    </div>
                  </div>
                  {ticket.notes && (
                    <div className="mt-3 text-sm text-secondary-700 bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                      <span className="font-semibold">Nota:</span> {ticket.notes}
                    </div>
                  )}
                </div>
                <div className="flex lg:flex-col gap-2 lg:w-40">
                  <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none">
                    Ver Detalles
                  </button>
                  {ticket.status !== 'resuelto' && ticket.status !== 'cerrado' && (
                    <>
                      <button className="btn bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none">
                        Resolver
                      </button>
                      <button className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1 lg:flex-none">
                        Escalar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faClipboardList} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-secondary-500">No tienes tickets asignados</p>
            <p className="text-sm text-secondary-400 mt-2">Los tickets aparecerán aquí cuando te sean asignados o los tomes del pool disponible</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAvailableTickets = () => (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Tickets Disponibles para Asignar
        </h2>
        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
          {availableTickets.length} disponibles
        </span>
      </div>

      <div className="space-y-4">
        {availableTickets.length > 0 ? (
          availableTickets.map((ticket, index) => (
            <div
              key={ticket.ticket_id}
              className={`border-2 rounded-lg p-5 hover:shadow-lg transition-all animate-fade-in ${
                ticket.priority === 'crítica' ? 'border-red-300 bg-red-50' : 'border-secondary-200'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-heading font-bold text-xl text-secondary-900">
                      #{ticket.ticket_id} - {ticket.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>
                  <p className="text-secondary-700 mb-4">{ticket.description}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-secondary-600">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-secondary-400" />
                      <span>Usuario ID: {ticket.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                      <span>{formatDate(ticket.creation_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary-400">Categoría:</span>
                      <span className="font-medium text-primary-600">{ticket.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:w-40">
                  <button className={`btn text-white ${
                    ticket.priority === 'crítica'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}>
                    Tomar Ticket
                  </button>
                  <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-secondary-500">No hay tickets disponibles</p>
            <p className="text-sm text-secondary-400 mt-2">Todos los tickets han sido asignados</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      {/* Estadísticas Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Mis Tickets Activos</p>
              <p className="text-3xl font-heading font-bold text-blue-900">{myActiveTickets}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Resueltos Hoy</p>
              <p className="text-3xl font-heading font-bold text-green-900">{myResolvedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Tickets Disponibles</p>
              <p className="text-3xl font-heading font-bold text-purple-900">{totalAvailable}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faInbox} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Críticos Disponibles</p>
              <p className="text-3xl font-heading font-bold text-red-900">{criticalAvailable}</p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Mis Tickets Activos */}
      <div className="card p-6 animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">
          Mis Tickets Activos
        </h2>
        <div className="space-y-4">
          {myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length > 0 ? (
            myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').map((ticket, index) => (
              <div
                key={ticket.ticket_id}
                className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-heading font-bold text-lg text-secondary-900">
                        #{ticket.ticket_id} - {ticket.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-700 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-secondary-400" />
                        <span>Usuario ID: {ticket.user_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                        <span>{formatDate(ticket.creation_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-secondary-400">Categoría:</span>
                        <span className="font-medium">{ticket.category}</span>
                      </div>
                    </div>
                    {ticket.notes && (
                      <div className="mt-2 text-sm text-secondary-600 bg-secondary-50 p-2 rounded">
                        <span className="font-medium">Nota:</span> {ticket.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button className="btn bg-primary-600 hover:bg-primary-700 text-white text-sm">
                      Ver Detalles
                    </button>
                    <button className="btn bg-orange-600 hover:bg-orange-700 text-white text-sm">
                      Escalar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary-500 py-8">No tienes tickets activos en este momento</p>
          )}
        </div>
      </div>

      {/* Tickets Críticos Disponibles */}
      {criticalAvailable > 0 && (
        <div className="card p-6 animate-slide-up bg-red-50 border-red-200">
          <h2 className="text-xl font-heading font-bold text-red-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Tickets Críticos Disponibles - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {availableTickets.filter(t => t.priority === 'crítica').map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="bg-white border border-red-300 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-secondary-900 mb-1">
                      #{ticket.ticket_id} - {ticket.title}
                    </h3>
                    <p className="text-sm text-secondary-700 mb-2">{ticket.description}</p>
                    <div className="flex gap-4 text-xs text-secondary-600">
                      <span>Usuario ID: {ticket.user_id}</span>
                      <span>{formatDate(ticket.creation_date)}</span>
                      <span className="font-medium text-red-700">{ticket.category}</span>
                    </div>
                  </div>
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Tomar Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header con navegación por pestañas */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
          Sistema de Tickets
        </h1>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-50'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'my_tickets' && renderMyTickets()}
      {activeTab === 'available' && renderAvailableTickets()}
      {activeTab === 'escalations' && <EscalationsPage />}
    </div>
  );
};
