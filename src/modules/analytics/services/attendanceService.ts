import { apiRequest } from '../../../services/api.config';
import type {
  AttendanceRecord,
  AttendanceStatistics,
  AttendanceTrend,
  FilterOptions,
  AttendanceFilters,
  StatisticsFilters,
  TrendFilters,
  ApiResponse,
  PaginatedResponse,
  StudentAttendance,
  CourseAnalytics
} from '../types';

// ============================================
// Attendance Service
// ============================================

export const attendanceService = {
  /**
   * Obtener listado de registros de asistencia con filtros
   */
  async getAttendanceRecords(filters?: AttendanceFilters): Promise<{ 
    records: AttendanceRecord[]; 
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

    const response = await apiRequest<ApiResponse<PaginatedResponse<AttendanceRecord>>>(endpoint);
    
    return {
      records: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        total_pages: response.data.total_pages,
        total_records: response.data.total_records,
        per_page: response.data.per_page
      }
    };
  },

  /**
   * Obtener estadísticas de asistencia
   */
  async getAttendanceStatistics(filters?: StatisticsFilters): Promise<AttendanceStatistics> {
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
  async getAttendanceTrend(filters?: TrendFilters): Promise<AttendanceTrend[]> {
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
  async getFilterOptions(): Promise<FilterOptions> {
    const response = await apiRequest<ApiResponse<FilterOptions>>('/data-analyst/attendance/filters/options');
    return response.data;
  },

  /**
   * Exportar datos de asistencia a CSV
   */
  async exportToCSV(filters?: AttendanceFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters?.group_id) params.append('group_id', filters.group_id.toString());
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.student_id) params.append('student_id', filters.student_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.attendance_status) params.append('attendance_status', filters.attendance_status);

    const queryString = params.toString();
    const endpoint = `/data-analyst/attendance/export/csv${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<Blob>(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });
    return response;
  },

  /**
   * Transformar datos de la API al formato esperado por el frontend
   * (Para compatibilidad con componentes existentes)
   */
  transformToStudentAttendance(records: AttendanceRecord[]): StudentAttendance[] {
    const studentMap = new Map<number, StudentAttendance>();

    records.forEach(record => {
      const studentId = record.student.id;
      const courseId = record.class.group.course.id;
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student_id: studentId,
          student_name: `${record.student.first_name} ${record.student.last_name}`,
          course_id: courseId,
          course_name: record.class.group.course.title,
          total_sessions: 0,
          attended_sessions: 0,
          absences: 0,
          tardiness: 0,
          justified_absences: 0,
          attendance_percentage: 0,
          last_attendance_date: null
        });
      }

      const studentAttendance = studentMap.get(studentId)!;
      studentAttendance.total_sessions++;

      if (record.attended === 'YES') {
        studentAttendance.attended_sessions++;
      } else if (record.attended === 'NO') {
        studentAttendance.absences++;
      } else if (record.attended === 'LATE') {
        studentAttendance.tardiness++;
      }

      // Actualizar última fecha de asistencia
      if (!studentAttendance.last_attendance_date || 
          new Date(record.class.class_date) > new Date(studentAttendance.last_attendance_date)) {
        studentAttendance.last_attendance_date = record.class.class_date;
      }
    });

    // Calcular porcentajes
    studentMap.forEach(attendance => {
      attendance.attendance_percentage = attendance.total_sessions > 0 
        ? (attendance.attended_sessions / attendance.total_sessions) * 100 
        : 0;
    });

    return Array.from(studentMap.values());
  },

  /**
   * Transformar estadísticas al formato de cursos
   */
  transformToCourseAnalytics(statistics: AttendanceStatistics): CourseAnalytics[] {
    return statistics.by_group.map(group => ({
      course_id: group.group_id,
      course_name: group.course_name,
      total_students: 0, // Esto necesitaría una consulta adicional
      active_students: 0, // Esto necesitaría una consulta adicional
      average_attendance: group.attendance_rate,
      average_performance: 0, // Esto necesitaría una consulta adicional
      average_progress: 0, // Esto necesitaría una consulta adicional
      completion_rate: 0, // Esto necesitaría una consulta adicional
      dropout_rate: 0, // Esto necesitaría una consulta adicional
      at_risk_count: 0 // Esto necesitaría una consulta adicional
    }));
  }
};