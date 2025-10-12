// Tickets Service - Módulo Soporte Técnico según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type { Ticket } from '../types';

// Tipos de respuesta según la API
interface TicketsListResponse {
  success: boolean;
  data: {
    tickets: ApiTicket[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      per_page: number;
    };
  };
}

interface TicketDetailResponse {
  success: boolean;
  data: ApiTicketDetail;
}

interface TicketCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    ticket_id: number;
  };
}

interface TicketUpdateResponse {
  success: boolean;
  message: string;
}

interface TicketActionResponse {
  success: boolean;
  message: string;
}

// Tipos de la API
interface ApiTicket {
  id: number;
  ticket_id: number;
  title: string;
  description: string;
  priority: 'baja' | 'media' | 'alta' | 'critica';
  status: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  category: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  assigned_technician?: {
    id: number;
    name: string;
  } | null;
  creation_date: string;
  assignment_date?: string | null;
}

interface ApiTicketDetail extends ApiTicket {
  notes?: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  assigned_technician?: {
    id: number;
    employee_id: number;
    name: string;
    speciality: string;
  } | null;
  resolution_date?: string | null;
  close_date?: string | null;
  tracking?: Array<{
    ticket_tracking_id: number;
    comment: string;
    action_type: string;
    follow_up_date: string;
  }>;
}

// Parámetros de filtrado
export interface TicketsFilterParams {
  page?: number;
  limit?: number;
  status?: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  priority?: 'baja' | 'media' | 'alta' | 'critica';
  category?: string;
  assigned_technician?: number;
  search?: string;
}

// Datos para crear ticket
export interface CreateTicketData {
  user_id: number;
  title: string;
  description: string;
  priority: 'baja' | 'media' | 'alta' | 'critica';
  category: string;
}

// Datos para tomar ticket
export interface TakeTicketData {
  technician_id: number;
}

// Datos para actualizar estado
export interface UpdateTicketStatusData {
  status: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  notes?: string;
}

// Datos para resolver ticket
export interface ResolveTicketData {
  resolution_notes: string;
  technician_id: number;
}

// Datos para cerrar ticket
export interface CloseTicketData {
  closing_notes: string;
}

// Datos para escalar ticket
export interface EscalateTicketData {
  technician_origin_id: number;
  technician_destiny_id: number;
  escalation_reason: string;
  observations?: string;
}

// Conversión de ApiTicket a Ticket
const mapApiTicketToTicket = (apiTicket: ApiTicket | ApiTicketDetail): Ticket => {
  // Mapear prioridad
  let priority: Ticket['priority'] = apiTicket.priority === 'critica' ? 'crítica' : apiTicket.priority;

  // Mapear status
  let status: Ticket['status'] = 'abierto';
  if (apiTicket.status === 'en_proceso') {
    status = 'en_progreso';
  } else if (apiTicket.status === 'resuelto' || apiTicket.status === 'cerrado') {
    status = apiTicket.status;
  }

  return {
    ticket_id: apiTicket.ticket_id || apiTicket.id,
    assigned_technician: apiTicket.assigned_technician?.id || null,
    user_id: apiTicket.user.id,
    title: apiTicket.title,
    description: apiTicket.description,
    priority,
    status,
    creation_date: apiTicket.creation_date,
    assignment_date: apiTicket.assignment_date || null,
    resolution_date: (apiTicket as ApiTicketDetail).resolution_date || null,
    close_date: (apiTicket as ApiTicketDetail).close_date || null,
    category: apiTicket.category,
    notes: (apiTicket as ApiTicketDetail).notes || null,
  };
};

export const ticketsService = {
  /**
   * Listar todos los tickets
   * Endpoint: GET /tickets
   */
  async getAll(filters?: TicketsFilterParams): Promise<{ tickets: Ticket[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.assigned_technician) params.append('assigned_technician', String(filters.assigned_technician));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/tickets${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<TicketsListResponse>(endpoint);

    return {
      tickets: response.data.tickets.map(mapApiTicketToTicket),
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener detalles de un ticket
   * Endpoint: GET /tickets/{ticket_id}
   */
  async getById(id: number): Promise<Ticket> {
    const response = await apiRequest<TicketDetailResponse>(`/tickets/${id}`);
    return mapApiTicketToTicket(response.data);
  },

  /**
   * Crear un nuevo ticket
   * Endpoint: POST /tickets
   */
  async create(data: CreateTicketData): Promise<Ticket> {
    const response = await apiRequest<TicketCreateResponse>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el ticket completo
    return this.getById(response.data.ticket_id);
  },

  /**
   * Tomar ticket (asignar a técnico)
   * Endpoint: POST /tickets/{ticket_id}/take
   */
  async take(id: number, data: TakeTicketData): Promise<void> {
    await apiRequest<TicketActionResponse>(`/tickets/${id}/take`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar estado de ticket
   * Endpoint: PUT /tickets/{ticket_id}/status
   */
  async updateStatus(id: number, data: UpdateTicketStatusData): Promise<void> {
    await apiRequest<TicketActionResponse>(`/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Resolver ticket
   * Endpoint: POST /tickets/{ticket_id}/resolve
   */
  async resolve(id: number, data: ResolveTicketData): Promise<void> {
    await apiRequest<TicketActionResponse>(`/tickets/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Cerrar ticket
   * Endpoint: POST /tickets/{ticket_id}/close
   */
  async close(id: number, data: CloseTicketData): Promise<void> {
    await apiRequest<TicketActionResponse>(`/tickets/${id}/close`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Escalar ticket
   * Endpoint: POST /tickets/{ticket_id}/escalate
   */
  async escalate(id: number, data: EscalateTicketData): Promise<void> {
    await apiRequest<TicketActionResponse>(`/tickets/${id}/escalate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
