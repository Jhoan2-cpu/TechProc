import { apiRequest } from '../../../services/api.config';
import type {
  DashboardSummary,
  StudentMetricsDetail,
  FinancialMetricsDetail,
  RecentActivity,
  DashboardFilters,
  ApiResponse
} from '../types/dashboard';

export const dashboardService = {
  /**
   * Obtener resumen completo del dashboard
   */
  async getSummary(filters?: DashboardFilters): Promise<DashboardSummary> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.company_id) params.append('company_id', filters.company_id.toString());
    if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/dashboard/summary${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<DashboardSummary>>(endpoint);
    return response.data;
  },

  /**
   * Obtener métricas específicas de estudiantes
   */
  async getStudentMetrics(filters?: DashboardFilters): Promise<StudentMetricsDetail> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.company_id) params.append('company_id', filters.company_id.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/dashboard/metrics/students${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<StudentMetricsDetail>>(endpoint);
    return response.data;
  },

  /**
   * Obtener métricas financieras
   */
  async getFinancialMetrics(filters?: DashboardFilters): Promise<FinancialMetricsDetail> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/dashboard/metrics/financial${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<FinancialMetricsDetail>>(endpoint);
    return response.data;
  },

  /**
   * Obtener actividades recientes
   */
  async getRecentActivities(filters?: DashboardFilters): Promise<RecentActivity[]> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/dashboard/activities/recent${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<RecentActivity[]>>(endpoint);
    return response.data;
  }
};