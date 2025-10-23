import { apiRequest } from '../../../services/api.config';
import type {
  SecurityEvent,
  SecurityAlert,
  SecurityAnalysis,
  DashboardData,
  SecurityFilters,
  ApiResponse,
  PaginatedResponse
} from '../types/security';

export const securityService = {
  /**
   * Obtener análisis completo de seguridad
   */
  async getAnalysis(filters?: SecurityFilters): Promise<SecurityAnalysis> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/security/analysis${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<SecurityAnalysis>>(endpoint);
    return response.data;
  },

  /**
   * Obtener listado de eventos de seguridad
   */
  async getEvents(filters?: SecurityFilters): Promise<{
    events: SecurityEvent[];
    pagination: any;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.event_type) params.append('event_type', filters.event_type);
    if (filters?.ip_address) params.append('ip_address', filters.ip_address);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/security/events${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<SecurityEvent>>>(endpoint);
    
    return {
      events: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.last_page || 1,
        total_records: response.data.total || 0,
        per_page: response.data.per_page || 20
      }
    };
  },

  /**
   * Obtener listado de alertas de seguridad
   */
  async getAlerts(filters?: SecurityFilters): Promise<{
    alerts: SecurityAlert[];
    pagination: any;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/security/alerts${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<SecurityAlert>>>(endpoint);
    
    return {
      alerts: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.last_page || 1,
        total_records: response.data.total || 0,
        per_page: response.data.per_page || 20
      }
    };
  },

  /**
   * Obtener datos para el dashboard
   */
  async getDashboardData(filters?: SecurityFilters): Promise<DashboardData> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/security/dashboard${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<DashboardData>>(endpoint);
    return response.data;
  }
};