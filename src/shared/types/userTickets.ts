// Tipos para tickets de usuario

export type TicketPriority = 'baja' | 'media' | 'alta';
export type TicketCategory = 'Hardware' | 'Software' | 'Red' | 'Acceso' | 'Otro';

export interface UserTicket {
  id: number;
  ticket_id: number;
  user_id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserTicketData {
  user_id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

export interface CreateUserTicketResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    ticket_id: number;
  };
}

export interface GetUserTicketsResponse {
  success: boolean;
  data: UserTicket[];
}
