import { apiRequest } from '../../../services/api.config';
import type {
  Course,
  CourseStatistics,
  CourseFilters,
  ApiResponse,
  PaginatedResponse
} from '../types/course';

export const courseService = {
  /**
   * Obtener listado de cursos con filtros
   */
  async getCourses(filters?: CourseFilters): Promise<{ 
    courses: Course[]; 
    pagination: any 
  }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.status !== undefined) params.append('status', filters.status.toString());
    if (filters?.bestseller !== undefined) params.append('bestseller', filters.bestseller.toString());
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/courses${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<Course>>>(endpoint);
    
    return {
      courses: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.last_page || Math.ceil((response.data.total || response.data.total_records || 0) / response.data.per_page),
        total_records: response.data.total || response.data.total_records || 0,
        per_page: response.data.per_page
      }
    };
  },

  /**
   * Obtener detalle de un curso específico
   */
  async getCourseDetail(courseId: number): Promise<Course> {
    const response = await apiRequest<ApiResponse<Course>>(`/data-analyst/courses/${courseId}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de cursos
   */
  async getCourseStatistics(filters?: CourseFilters): Promise<CourseStatistics> {
    const params = new URLSearchParams();
    
    if (filters?.level) params.append('level', filters.level);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/courses/stats/summary${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<CourseStatistics>>(endpoint);
    return response.data;
  },

  /**
   * Exportar cursos a CSV
   */
  async exportToCSV(filters?: CourseFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.status !== undefined) params.append('status', filters.status.toString());
    if (filters?.bestseller !== undefined) params.append('bestseller', filters.bestseller.toString());
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/courses/export/csv${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<Blob>(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });
    return response;
  }
};