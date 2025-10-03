// Enums
export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'crítico';
export type ReportType = 'asistencia' | 'rendimiento' | 'progreso' | 'desercion' | 'general';
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type AttendanceStatus = 'presente' | 'ausente' | 'tardanza' | 'justificado';

// Interfaces - Asistencia de Estudiantes
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

// Interfaces - Progreso Académico
export interface StudentProgress {
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  total_modules: number;
  completed_modules: number;
  current_module: number;
  progress_percentage: number;
  average_time_per_module: number; // en horas
  estimated_completion_date: string;
  enrollment_date: string;
}

// Interfaces - Rendimiento Académico
export interface StudentPerformance {
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  total_assessments: number;
  completed_assessments: number;
  average_score: number; // 0-100
  highest_score: number;
  lowest_score: number;
  passing_rate: number; // porcentaje de evaluaciones aprobadas
  last_assessment_date: string | null;
  grade: string; // A, B, C, D, F
}

// Interfaces - Predicción de Deserción
export interface DropoutPrediction {
  student_id: number;
  student_name: string;
  email: string;
  course_id: number;
  course_name: string;
  risk_level: RiskLevel;
  risk_score: number; // 0-100
  factors: DropoutFactor[];
  last_login: string;
  days_inactive: number;
  recommended_actions: string[];
  prediction_date: string;
}

// Interfaces - Factores de Riesgo
export interface DropoutFactor {
  factor_name: string;
  impact: 'bajo' | 'medio' | 'alto';
  value: string;
  description: string;
}

// Interfaces - Reportes Generados
export interface Report {
  id_report: number;
  report_name: string;
  report_type: ReportType;
  description: string;
  format: ReportFormat;
  generated_by: number;
  generated_by_name?: string;
  generation_date: string;
  file_path: string;
  file_size_kb: number;
  parameters: ReportParameters;
}

// Interfaces - Parámetros de Reporte
export interface ReportParameters {
  date_from?: string;
  date_to?: string;
  course_ids?: number[];
  student_ids?: number[];
  include_charts?: boolean;
  include_raw_data?: boolean;
}

// Interfaces - Estadísticas Generales del Dashboard
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

// Interfaces - Análisis por Curso
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

// Interfaces - Métricas de Tiempo
export interface TimeMetrics {
  date: string;
  active_users: number;
  new_enrollments: number;
  completions: number;
  dropouts: number;
  average_session_time: number; // minutos
}
