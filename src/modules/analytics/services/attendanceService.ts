// src/modules/analytics/services/attendanceService.ts
import { apiRequest } from '../../../services/api.config';
import type {
  Attendance,
  AttendanceStatistics,
  AttendanceTrend,
  AttendanceFilterOptions,
  AttendanceFilters,
  ApiResponse,
  PaginatedResponse
} from '../types/attendance';

export const attendanceService = {
  /**
   * Obtener listado de registros de asistencia con filtros
   */
  async getAttendances(filters?: AttendanceFilters): Promise<{ 
    attendances: Attendance[]; 
    pagination: any 
  }> {
    const params = new URLSearchParams();
    
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.attendance_status) params.append('attendance_status', filters.attendance_status);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/attendance${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<Attendance>>>(endpoint);
    
    return {
      attendances: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.last_page || Math.ceil((response.data.total || 0) / (response.data.per_page || 15)),
        total_records: response.data.total || response.data.total_records || 0,
        per_page: response.data.per_page || 15
      }
    };
  },

  /**
   * Obtener estadísticas de asistencia
   */
  async getAttendanceStatistics(filters?: AttendanceFilters): Promise<AttendanceStatistics> {
    const params = new URLSearchParams();
    
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/attendance/stats/summary${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<AttendanceStatistics>>(endpoint);
    return response.data;
  },

  /**
   * Obtener tendencia de asistencia por fecha
   */
  async getAttendanceTrend(filters?: AttendanceFilters): Promise<AttendanceTrend[]> {
    const params = new URLSearchParams();
    
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/data-analyst/attendance/trend${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<AttendanceTrend[]>>(endpoint);
    return response.data;
  },

  /**
   * Obtener opciones para los filtros
   */
  async getFilterOptions(): Promise<AttendanceFilterOptions> {
    const response = await apiRequest<ApiResponse<AttendanceFilterOptions>>(
      '/data-analyst/attendance/filters/options'
    );
    return response.data;
  },
};