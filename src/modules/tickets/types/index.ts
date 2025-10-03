// Enums
export type TicketPriority = 'baja' | 'media' | 'alta' | 'crítica';
export type TicketStatus = 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado' | 'escalado';
export type TicketActionType = 'comment' | 'status_change' | 'assignment' | 'escalation';
export type TechnicianStatus = 'activo' | 'inactivo' | 'suspendido';

// Interfaces
export interface Ticket {
  ticket_id: number;
  assigned_technician: number | null;
  user_id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  creation_date: string;
  assignment_date: string | null;
  resolution_date: string | null;
  close_date: string | null;
  category: string;
  notes: string | null;
}

export interface Escalation {
  escalation_id: number;
  ticket_id: number;
  technician_origin_id: number;
  technician_destination_id: number;
  escalation_reason: string;
  observations: string | null;
  escalation_date: string;
  approved: boolean;
}

export interface TicketTracking {
  ticket_tracking_id: number;
  ticket_id: number;
  comment: string;
  action_type: TicketActionType;
  follow_up_date: string;
}

export interface SupportTechnician {
  id_technician: number;
  user_id: number;
  specialty: string;
  assigned_tickets: number;
  resolved_tickets: number;
  available: boolean;
  support_schedule: string;
  status: TechnicianStatus;
  // Campos adicionales del usuario
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_photo?: string | null;
}
