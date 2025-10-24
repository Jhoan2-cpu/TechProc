import { apiRequest } from '../../../services/api.config';
import type {
  Ticket,
  TicketStatistics,
  CategoryStatistic,
  TechnicianRanking,
  TicketFilters,
  ApiResponse,
  PaginatedResponse
} from '../types/ticket';

export const ticketService = {
  /**
   * Obtener listado de tickets con filtros
   */
  async getTickets(filters?: TicketFilters): Promise<{ 
    tickets: Ticket[]; 
    pagination: any 
  }> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.technician_id) params.append('technician_id', filters.technician_id.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/tickets${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<Ticket>>>(endpoint);
    
    return {
      tickets: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.total_pages || Math.ceil((response.data.total_records || 0) / (response.data.per_page || 15)),
        total_records: response.data.total_records || 0,
        per_page: response.data.per_page || 15
      }
    };
  },

  /**
   * Obtener estadísticas completas de tickets
   */
  async getTicketStatistics(filters?: TicketFilters): Promise<TicketStatistics> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.category) params.append('category', filters.category);

    const queryString = params.toString();
    const endpoint = `/data-analyst/tickets/stats/summary${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<TicketStatistics>>(endpoint);
    return response.data;
  },

  /**
   * Obtener estadísticas por categoría
   */
  async getCategoryStatistics(filters?: TicketFilters): Promise<CategoryStatistic[]> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/tickets/stats/categories${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<CategoryStatistic[]>>(endpoint);
    return response.data;
  },

  /**
   * Obtener ranking de técnicos
   */
  async getTechnicianRanking(filters?: TicketFilters): Promise<TechnicianRanking[]> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/tickets/stats/technicians${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<TechnicianRanking[]>>(endpoint);
    return response.data;
  },
};