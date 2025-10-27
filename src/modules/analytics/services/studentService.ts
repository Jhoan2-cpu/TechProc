import { apiRequest } from '../../../services/api.config';
import type {
  Student,
  StudentStatistics,
  StudentFilters,
  ApiResponse,
  PaginatedResponse
} from '../types/student';

export const studentService = {
  /**
   * Obtener listado de estudiantes con filtros
   */
  async getStudents(filters?: StudentFilters): Promise<{ 
    students: Student[]; 
    pagination: any 
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.company_id) params.append('company_id', filters.company_id.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.enrollment_type) params.append('enrollment_type', filters.enrollment_type);
      if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.per_page) params.append('per_page', filters.per_page?.toString() || '10');
      if (filters?.page) params.append('page', filters.page.toString());

      const queryString = params.toString();
      const endpoint = `/data-analyst/students${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest<ApiResponse<PaginatedResponse<Student>>>(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener estudiantes');
      }
      
      return {
        students: response.data.data || [],
        pagination: {
          current_page: response.data.current_page || 1,
          total_pages: Math.ceil((response.data.total_records || 0) / (response.data.per_page || 10)),
          total_records: response.data.total_records || 0,
          per_page: response.data.per_page || 10
        }
      };
    } catch (error) {
      console.error('Error in studentService.getStudents:', error);
      throw error;
    }
  },

  /**
   * Obtener detalle de un estudiante específico
   */
  async getStudentDetail(studentId: number): Promise<Student> {
    const response = await apiRequest<ApiResponse<Student>>(`/data-analyst/students/${studentId}`);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener detalle del estudiante');
    }
    return response.data;
  },

  /**
   * Obtener estadísticas de estudiantes
   */
  async getStudentStatistics(): Promise<StudentStatistics> {
    const response = await apiRequest<ApiResponse<StudentStatistics>>('/data-analyst/students/stats/summary');
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener estadísticas');
    }
    return response.data;
  },

  /**
   * Obtener reporte avanzado
   */
  async getAdvancedReport(filters?: StudentFilters): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters?.company_id) params.append('company_id', filters.company_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.academic_period_id) params.append('academic_period_id', filters.academic_period_id.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/students/reports/advanced${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<any>>(endpoint);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener reporte avanzado');
    }
    return response.data;
  },
};