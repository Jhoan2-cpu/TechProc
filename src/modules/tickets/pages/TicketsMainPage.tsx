import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TicketsDashboardPage } from './TicketsDashboardPage';
import { MyTicketsPage } from './MyTicketsPage';
import { AvailableTicketsPage } from './AvailableTicketsPage';
import { EscalationsPage } from './EscalationsPage';
import type { Ticket } from '../types';
import {
  ViewTicketDetailsModal,
  EscalateTicketModal,
  TakeTicketModal,
  ResolveTicketModal,
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

export const TicketsMainPage = () => {
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [ticketToView, setTicketToView] = useState<Ticket | null>(null);
  const [ticketToEscalate, setTicketToEscalate] = useState<Ticket | null>(null);
  const [ticketToTake, setTicketToTake] = useState<Ticket | null>(null);
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handlers para modales
  const handleViewDetails = (ticket: Ticket) => {
    setTicketToView(ticket);
  };

  const handleEscalate = (ticket: Ticket) => {
    setTicketToEscalate(ticket);
  };

  const handleEscalateSuccess = () => {
    // Recargar la lista de tickets después de escalar
    console.log('Ticket escalado exitosamente');
    // Incrementar refreshTrigger para forzar recarga en MyTicketsPage
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTakeTicket = (ticket: Ticket) => {
    // Ya no se necesita el modal, el ticket ya fue tomado en AvailableTicketsPage
    console.log('Ticket tomado:', ticket);
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
  };

  const handleResolve = (ticket: Ticket) => {
    setTicketToResolve(ticket);
  };

  const handleResolveSuccess = () => {
    // Recargar la lista de tickets después de resolver
    console.log('Ticket resuelto exitosamente');
    // Incrementar refreshTrigger para forzar recarga en MyTicketsPage
    setRefreshTrigger(prev => prev + 1);
  };

  // Determinar la sección actual basándose en la ruta
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('my-tickets')) return 'my_tickets';
    if (path.includes('available')) return 'available';
    if (path.includes('escalations')) return 'escalations';
    return 'dashboard';
  };

  const renderSection = () => {
    const section = getCurrentSection();

    switch (section) {
      case 'my_tickets':
        return (
          <MyTicketsPage
            onViewDetails={handleViewDetails}
            onEscalate={handleEscalate}
            onResolve={handleResolve}
            refreshTrigger={refreshTrigger}
          />
        );
      case 'available':
        return (
          <AvailableTicketsPage
            onTakeTicket={handleTakeTicket}
            onViewDetails={handleViewDetails}
          />
        );
      case 'escalations':
        return <EscalationsPage />;
      case 'dashboard':
      default:
        return (
          <TicketsDashboardPage
            onViewDetails={handleViewDetails}
            onEscalate={handleEscalate}
            onResolve={handleResolve}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderSection()}

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
        onSuccess={handleEscalateSuccess}
      />

      <TakeTicketModal
        ticket={ticketToTake}
        isOpen={!!ticketToTake}
        onClose={() => setTicketToTake(null)}
        onConfirm={handleTakeTicketConfirm}
      />

      <ResolveTicketModal
        ticket={ticketToResolve}
        isOpen={!!ticketToResolve}
        onClose={() => setTicketToResolve(null)}
        onSuccess={handleResolveSuccess}
      />
    </div>
  );
};
