// Enums
export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'crítico';
export type ReportType = 'students' | 'courses' | 'attendance' | 'grades' | 'financial' | 'tickets' | 'security' | 'dashboard';
export type ReportFormat = 'pdf' | 'excel';
export type AttendanceStatus = 'presente' | 'ausente' | 'tardanza' | 'justificado';

// Interfaces - Reportes Generados
export interface Report {
  id: number;
  report_type: ReportType;
  report_type_name: string;
  format: ReportFormat;
  file_name: string;
  report_title: string;
  description: string;
  file_size: string;
  record_count: number;
  filters: ReportFilters;
  generated_by: number;
  generated_by_name: string;
  download_url: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  icon: string;
}

// Interfaces - Parámetros de Reporte
export interface ReportFormData {
  report_type: ReportType;
  format: ReportFormat;
  start_date: string;
  end_date: string;
  include_charts: boolean;
  include_raw_data: boolean;
  report_title?: string;
  filters?: ReportFilters;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  company_id?: number;
  academic_period_id?: number;
  status?: string;
  [key: string]: any;
}

// Mantener las interfaces existentes que no han cambiado
export interface StudentAttendance {
  student_id: number;
  student_name: string;
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

export interface StudentProgress {
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  total_modules: number;
  completed_modules: number;
  current_module: number;
  progress_percentage: number;
  average_time_per_module: number;
  estimated_completion_date: string;
  enrollment_date: string;
}

export interface StudentPerformance {
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  total_assessments: number;
  completed_assessments: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  passing_rate: number;
  last_assessment_date: string | null;
  grade: string;
}

export interface DropoutPrediction {
  student_id: number;
  student_name: string;
  email: string;
  course_id: number;
  course_name: string;
  risk_level: RiskLevel;
  risk_score: number;
  factors: DropoutFactor[];
  last_login: string;
  days_inactive: number;
  recommended_actions: string[];
  prediction_date: string;
}

export interface DropoutFactor {
  factor_name: string;
  impact: 'bajo' | 'medio' | 'alto';
  value: string;
  description: string;
}

export interface AnalyticsDashboard {
  total_students: number;
  active_students: number;
  at_risk_students: number;
  average_attendance: number;
  average_performance: number;
  average_progress: number;
  total_courses: number;
  completion_rate: number;
}

export interface CourseAnalytics {
  course_id: number;
  course_name: string;
  total_students: number;
  active_students: number;
  average_attendance: number;
  average_performance: number;
  average_progress: number;
  completion_rate: number;
  dropout_rate: number;
  at_risk_count: number;
}

export interface TimeMetrics {
  date: string;
  active_users: number;
  new_enrollments: number;
  completions: number;
  dropouts: number;
  average_session_time: number;
}

export * from '../../analytics/types/attendance';
