// src/modules/analytics/services/gradeService.ts

import { apiRequest } from '../../../services/api.config';
import type {
  GradeStatistics,
  TopPerformer,
  GradeReportData,
  FilterOptions,
  GradeFilters,
  ApiResponse
} from '../types/grades';

export const gradeService = {
  /**
   * Obtener estadísticas generales de calificaciones
   */
  async getStatistics(filters?: GradeFilters): Promise<GradeStatistics> {
    const params = new URLSearchParams();
    
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());
    if (filters?.grade_type) params.append('grade_type', filters.grade_type);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/grades/stats/summary${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<GradeStatistics>>(endpoint);
    return response.data;
  },

  /**
   * Obtener listado de calificaciones con filtros
   */
  async getGradeReport(filters?: GradeFilters): Promise<GradeReportData> {
    const params = new URLSearchParams();
    
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());
    if (filters?.grade_type) params.append('grade_type', filters.grade_type);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/grades${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<GradeReportData>>(endpoint);
    return response.data;
  },

  /**
   * Obtener estudiantes con mejor rendimiento
   */
  async getTopPerformers(filters?: GradeFilters): Promise<TopPerformer[]> {
    const params = new URLSearchParams();
    
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/grades/top-performers${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<TopPerformer[]>>(endpoint);
    return response.data;
  },

  /**
   * Obtener opciones de filtro disponibles
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const response = await apiRequest<ApiResponse<FilterOptions>>('/data-analyst/grades/filter-options');
    return response.data;
  }
};