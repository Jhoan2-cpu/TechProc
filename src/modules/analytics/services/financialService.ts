import { apiRequest } from '../../../services/api.config';
import type {
  FinancialStatistics,
  RevenueSource,
  PendingPaymentsData,
  RevenueTrendItem,
  FinancialFilters,
  ApiResponse
} from '../types/financial';

export const financialService = {
  /**
   * Obtener estadísticas financieras completas
   */
  async getStatistics(filters?: FinancialFilters): Promise<FinancialStatistics> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.revenue_source_id) params.append('revenue_source_id', filters.revenue_source_id.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/financial/statistics${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<FinancialStatistics>>(endpoint);
    return response.data;
  },

  /**
   * Obtener tendencia de ingresos
   */
  async getRevenueTrend(filters?: FinancialFilters): Promise<RevenueTrendItem[]> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.revenue_source_id) params.append('revenue_source_id', filters.revenue_source_id.toString());
    if (filters?.period) params.append('period', filters.period);

    const queryString = params.toString();
    const endpoint = `/data-analyst/financial/revenue-trend${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<RevenueTrendItem[]>>(endpoint);
    return response.data;
  },

  /**
   * Obtener fuentes de ingresos disponibles
   */
  async getRevenueSources(): Promise<RevenueSource[]> {
    try {
      const response = await apiRequest<ApiResponse<RevenueSource[]>>('/data-analyst/financial/revenue-sources');
      // Filtrar elementos nulos de la respuesta
      return response.data.filter(source => source !== null);
    } catch (error) {
      console.error('Error fetching revenue sources:', error);
      return []; // Retornar array vacío en caso de error
    }
  },

  /**
   * Obtener pagos pendientes con detalles
   */
  async getPendingPayments(filters?: FinancialFilters): Promise<PendingPaymentsData> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.revenue_source_id) params.append('revenue_source_id', filters.revenue_source_id.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/financial/pending-payments${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PendingPaymentsData>>(endpoint);
    return response.data;
  },
};