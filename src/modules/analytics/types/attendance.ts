// Tipos para el módulo de análisis de asistencia

// ============================================
// Enums y tipos base
// ============================================

export type AttendanceStatus = 'YES' | 'NO' | 'LATE' | 'JUSTIFIED';
export type ConnectionQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

// ============================================
// Interfaces principales
// ============================================

export interface StudentAttendance {
  student_id: number;
  student_name: string;
  email: string;
  course_id: number;
  course_name: string;
  total_sessions: number;
  attended_sessions: number;
  absences: number;
  tardiness: number;
  justified_absences: number;
  attendance_percentage: number;
  last_attendance_date: string | null;
}

export interface CourseAnalytics {
  id: number;
  title: string;
  total_students: number;
  average_attendance: number;
  total_sessions: number;
}

export interface AttendanceRecord {
  id: number;
  attended: AttendanceStatus;
  entry_time: string | null;
  exit_time: string | null;
  connected_minutes: number | null;
  connection_ip: string | null;
  device: string | null;
  approximate_location: string | null;
  connection_quality: ConnectionQuality | null;
  observations: string | null;
  cloud_synchronized: boolean;
  record_date: string;
  class: {
    id: number;
    class_name: string;
    class_date: string;
    start_time: string;
    end_time: string;
    platform: string;
    group: {
      id: number;
      name: string;
      course: {
        id: number;
        title: string;
      };
    };
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface AttendanceStatistics {
  total_classes: number;
  total_attendances_recorded: number;
  present_attendances: number;
  absent_attendances: number;
  average_attendance_rate: number;
  by_group: Array<{
    group_id: number;
    group_name: string;
    course_name: string;
    total_classes: number;
    total_attendances: number;
    present_count: number;
    attendance_rate: number;
  }>;
}

export interface AttendanceTrend {
  date: string;
  attendance_count: number;
  present_count: number;
  attendance_rate: number;
}

export interface FilterOptions {
  courses: Array<{
    id: number;
    title: string;
  }>;
  students: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }>;
}

// ============================================
// Filtros para las consultas
// ============================================

export interface AttendanceFilters {
  group_id?: number;
  course_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
  attendance_status?: AttendanceStatus;
  per_page?: number;
  page?: number;
}

export interface StatisticsFilters {
  group_id?: number;
  course_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface TrendFilters {
  group_id?: number;
  course_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
}

// ============================================
// Respuestas de la API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
}