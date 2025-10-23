// src/modules/analytics/types/attendance.ts
// Tipos para el módulo de análisis de asistencia

// ============================================
// Interfaces principales
// ============================================

export interface Attendance {
  id: number;
  attended: boolean;
  entry_time: string | null;
  exit_time: string | null;
  connected_minutes: number | null;
  connection_ip: string | null;
  device: string | null;
  approximate_location: string | null;
  connection_quality: string | null;
  observations: string | null;
  cloud_synchronized: boolean | null;
  record_date: string | null;
  class: AttendanceClass;
  student: AttendanceStudent;
}

export interface AttendanceClass {
  id: number;
  class_name: string;
  class_date: string;
  start_time: string;
  end_time: string;
  platform: string | null;
  group: AttendanceGroup;
}

export interface AttendanceGroup {
  id: number;
  name: string;
  course: AttendanceCourse;
}

export interface AttendanceCourse {
  id: number;
  title: string;
}

export interface AttendanceStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AttendanceStatistics {
  total_classes: number;
  total_attendances_recorded: number;
  present_attendances: number;
  absent_attendances: number;
  average_attendance_rate: number;
  by_group: GroupAttendanceStatistic[];
}

export interface GroupAttendanceStatistic {
  group_id: number;
  group_name: string;
  course_name: string;
  total_classes: number;
  total_attendances: number;
  present_count: number;
  attendance_rate: string;
}

export interface AttendanceTrend {
  date: string;
  attendance_count: number;
  present_count: number;
  attendance_rate: number;
}

export interface AttendanceFilterOptions {
  courses: CourseOption[];
  students: StudentOption[];
}

export interface CourseOption {
  id: number;
  title: string;
}

export interface StudentOption {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AttendanceFilters {
  group_id?: number;
  course_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
  attendance_status?: 'YES' | 'NO';
  per_page?: number;
  page?: number;
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
  total_pages?: number;
  total_records?: number;
  per_page?: number;
  last_page?: number;
  total?: number;
}