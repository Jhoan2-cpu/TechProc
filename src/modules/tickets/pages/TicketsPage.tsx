import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTachometerAlt,
  faClipboardList,
  faInbox,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { EscalationsPage } from './EscalationsPage';
import {
  TicketStatsCard,
  TicketCard,
  AvailableTicketCard,
  CriticalTicketAlert,
  ViewTicketDetailsModal,
  EscalateTicketModal,
  TakeTicketModal,
} from '../components';

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
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [ticketToView, setTicketToView] = useState<Ticket | null>(null);
  const [ticketToEscalate, setTicketToEscalate] = useState<Ticket | null>(null);
  const [ticketToTake, setTicketToTake] = useState<Ticket | null>(null);

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

  // Handlers para modales
  const handleViewDetails = (ticket: Ticket) => {
    setTicketToView(ticket);
  };

  const handleEscalate = (ticket: Ticket) => {
    setTicketToEscalate(ticket);
  };

  const handleEscalateConfirm = (ticketId: number, reason: string, observations: string) => {
    setTickets(tickets.map(t =>
      t.ticket_id === ticketId
        ? { ...t, status: 'escalado' as const }
        : t
    ));
    setTicketToEscalate(null);
    // Aquí se podría mostrar una notificación de éxito
  };

  const handleTakeTicket = (ticket: Ticket) => {
    setTicketToTake(ticket);
  };

  const handleTakeTicketConfirm = (ticketId: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setTickets(tickets.map(t =>
      t.ticket_id === ticketId
        ? {
            ...t,
            assigned_technician: currentTechnicianId,
            assignment_date: now,
            status: 'en_progreso' as const
          }
        : t
    ));
    setTicketToTake(null);
    // Aquí se podría mostrar una notificación de éxito
  };

  const renderMyTickets = () => (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Mis Tickets Asignados
        </h2>
        <span className="px-4 py-2 bg-primary-900/20 text-blue-700 rounded-full font-semibold">
          {myTickets.length} tickets
        </span>
      </div>

      <div className="space-y-4">
        {myTickets.length > 0 ? (
          myTickets.map((ticket, index) => (
            <TicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              formatDate={formatDate}
              index={index}
              onViewDetails={handleViewDetails}
              onEscalate={handleEscalate}
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
    </div>
  );

  const renderAvailableTickets = () => (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">
          Tickets Disponibles para Asignar
        </h2>
        <span className="px-4 py-2 bg-purple-900/20 text-purple-700 rounded-full font-semibold">
          {availableTickets.length} disponibles
        </span>
      </div>

      <div className="space-y-4">
        {availableTickets.length > 0 ? (
          availableTickets.map((ticket, index) => (
            <AvailableTicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              formatDate={formatDate}
              index={index}
              onTakeTicket={handleTakeTicket}
              onViewDetails={handleViewDetails}
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
    </div>
  );

  const renderDashboard = () => (
    <>
      {/* Estadísticas Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TicketStatsCard
          title="Mis Tickets Activos"
          value={myActiveTickets}
          icon={faClipboardList}
          colorClass="from-blue-50 to-blue-100 text-blue-700 bg-blue-600"
          index={0}
        />
        <TicketStatsCard
          title="Resueltos Hoy"
          value={myResolvedToday}
          icon={faCheckCircle}
          colorClass="from-green-50 to-green-100 text-green-700 bg-green-600"
          index={1}
        />
        <TicketStatsCard
          title="Tickets Disponibles"
          value={totalAvailable}
          icon={faInbox}
          colorClass="from-purple-50 to-purple-100 text-purple-700 bg-purple-600"
          index={2}
        />
        <TicketStatsCard
          title="Críticos Disponibles"
          value={criticalAvailable}
          icon={faExclamationTriangle}
          colorClass="from-red-50 to-red-100 text-red-700 bg-red-600"
          index={3}
        />
      </div>

      {/* Mis Tickets Activos */}
      <div className="card p-6 animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-white mb-4">
          Mis Tickets Activos
        </h2>
        <div className="space-y-4">
          {myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length > 0 ? (
            myTickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').map((ticket, index) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                formatDate={formatDate}
                index={index}
                variant="compact"
                onViewDetails={handleViewDetails}
                onEscalate={handleEscalate}
              />
            ))
          ) : (
            <p className="text-center text-gray-300 py-8">No tienes tickets activos en este momento</p>
          )}
        </div>
      </div>

      {/* Tickets Críticos Disponibles */}
      {criticalAvailable > 0 && (
        <div className="card p-6 animate-slide-up bg-danger/20 border-red-200">
          <h2 className="text-xl font-heading font-bold text-danger mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Tickets Críticos Disponibles - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {availableTickets.filter(t => t.priority === 'crítica').map((ticket) => (
              <CriticalTicketAlert
                key={ticket.ticket_id}
                ticket={ticket}
                formatDate={formatDate}
                onTakeTicket={handleTakeTicket}
              />
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
        <h1 className="text-3xl font-heading font-bold text-white mb-6">
          tickets/dashboard
        </h1>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-900/20'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
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

      {/* Modales */}
      <ViewTicketDetailsModal
        ticket={ticketToView}
        isOpen={!!ticketToView}
        onClose={() => setTicketToView(null)}
      />

      <EscalateTicketModal
        ticket={ticketToEscalate}
        isOpen={!!ticketToEscalate}
        onClose={() => setTicketToEscalate(null)}
        onEscalate={handleEscalateConfirm}
      />

      <TakeTicketModal
        ticket={ticketToTake}
        isOpen={!!ticketToTake}
        onClose={() => setTicketToTake(null)}
        onConfirm={handleTakeTicketConfirm}
      />
    </div>
  );
};
