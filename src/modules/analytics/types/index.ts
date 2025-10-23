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

// ==========================================
// ATTENDANCE ANALYTICS MODULE
// ==========================================

// Attendance Record Types
export type AttendedStatus = 'YES' | 'NO';
export type ConnectionQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | null;
export type PerformanceLevel = 'excellent' | 'good' | 'regular' | 'poor' | 'very_poor';
export type AttendanceRiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Student Info
export interface AttendanceStudent {
  id: number;
  name: string;
  email: string;
}

// Class Info
export interface AttendanceClass {
  id: number;
  name: string;
  date: string;
}

// Group Info
export interface AttendanceGroup {
  id: number;
  name: string;
  code?: string;
}

// Course Info
export interface AttendanceCourse {
  id: number;
  title: string;
  level?: string;
}

// Attendance Record
export interface AttendanceRecord {
  id: number;
  student: AttendanceStudent;
  class: AttendanceClass;
  group: AttendanceGroup;
  course: AttendanceCourse;
  attended: AttendedStatus;
  entry_time: string | null;
  exit_time: string | null;
  connected_minutes: number;
  connection_quality: ConnectionQuality;
  record_date: string;
}

// Pagination
export interface AttendancePagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Attendance Records Response
export interface AttendanceRecordsResponse {
  success: boolean;
  data: {
    data: AttendanceRecord[];
    pagination: AttendancePagination;
  };
}

// Summary Statistics
export interface ConnectionQualityDistribution {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

export interface PerformanceIndicators {
  status: string;
  trend: string;
  health_score: number;
}

export interface AttendanceSummary {
  total_records: number;
  total_attended: number;
  total_missed: number;
  attendance_rate: number;
  avg_connected_minutes: number;
  connection_quality_distribution: ConnectionQualityDistribution;
  performance_indicators: PerformanceIndicators;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  data: AttendanceSummary;
}

// By Student Statistics
export interface StudentAttendanceStats {
  student_id: number;
  student_name: string;
  student_email: string;
  total_classes: number;
  classes_attended: number;
  classes_missed: number;
  attendance_rate: string;
  avg_connected_minutes: string;
  performance_level: PerformanceLevel;
  risk_level: AttendanceRiskLevel;
}

export interface StudentStatsResponse {
  success: boolean;
  data: StudentAttendanceStats[];
  meta: {
    total_students: number;
  };
}

// By Group Statistics
export interface GroupAttendanceStats {
  group_id: number;
  group_name: string;
  group_code: string;
  course_title: string;
  total_students: number;
  total_records: number;
  total_attended: number;
  attendance_rate: string;
  performance_level: PerformanceLevel;
  avg_attendance_per_student: number;
}

export interface GroupStatsResponse {
  success: boolean;
  data: GroupAttendanceStats[];
  meta: {
    total_groups: number;
  };
}

// Trend Analysis
export interface TrendPeriod {
  period: string;
  total_records: number;
  attended: number;
  missed: number;
  attendance_rate: string;
}

export interface TrendAnalysis {
  direction: string;
  change_percentage: number;
  average_rate: number;
  first_period_avg: number;
  recent_period_avg: number;
}

export interface TrendResponse {
  success: boolean;
  data: TrendPeriod[];
  analysis: TrendAnalysis;
}

// Risk Analysis
export interface RiskStudent {
  student_id: number;
  student_name: string;
  student_email: string;
  group_id: number;
  group_name: string;
  course_title: string;
  total_classes: number;
  classes_attended: number;
  classes_missed: number;
  attendance_rate: string;
  last_attendance_date: string;
  risk_level: AttendanceRiskLevel;
  days_since_last_attendance: number;
  recommendations: string[];
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
}

export interface RiskAnalysisData {
  threshold: number;
  total_at_risk: number;
  students: RiskStudent[];
  risk_distribution: RiskDistribution;
}

export interface RiskAnalysisResponse {
  success: boolean;
  data: RiskAnalysisData;
}

// Filter Options
export interface FilterGroup {
  id: number;
  name: string;
  code: string;
  course_title: string;
}

export interface FilterCourse {
  id: number;
  title: string;
  level: string;
}

export interface FilterOptions {
  groups: FilterGroup[];
  courses: FilterCourse[];
  connection_quality_options: ConnectionQuality[];
  attended_options: AttendedStatus[];
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptions;
}

// Filter Params
export interface AttendanceFilters {
  group_id?: number;
  student_id?: number;
  course_id?: number;
  attended?: AttendedStatus;
  connection_quality?: ConnectionQuality;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

// ==========================================
// PROGRESS ANALYTICS MODULE
// ==========================================

// Progress Level Types
export type ProgressLevelType = 'excellent' | 'good' | 'regular' | 'poor' | 'very_poor';
export type ProgramStatus = 'Passed' | 'Failed' | 'in_progress' | 'dropped';
export type CompletionStatus = 'excellent' | 'good' | 'needs_attention' | 'critical';

// Attendance Info for Progress
export interface ProgressAttendanceInfo {
  total_classes: number;
  attended: number;
  rate: number;
}

// Evaluations Info for Progress
export interface ProgressEvaluationsInfo {
  total: number;
  completed: number;
  rate: number;
}

// Student Progress Data
export interface StudentProgressData {
  student_id: number;
  student_name: string;
  student_email: string;
  group_id: number;
  group_name: string;
  course_id: number;
  course_title: string;
  final_grade: number;
  average_grade: number;
  program_status: ProgramStatus;
  attendance: ProgressAttendanceInfo;
  evaluations: ProgressEvaluationsInfo;
  overall_progress: number;
  progress_level: ProgressLevelType;
  status_label: string;
}

// Student Progress Response
export interface StudentProgressResponse {
  success: boolean;
  data: StudentProgressData[];
}

// Student Detail - Student Info
export interface ProgressStudentInfo {
  id: number;
  name: string;
  email: string;
  enrollment_date: string;
}

// Student Detail - Course Info
export interface StudentCourseProgress {
  course_id: number;
  course_title: string;
  group_id: number;
  group_name: string;
  start_date: string;
  end_date: string;
  final_grade: number;
  average_grade: number;
  program_status: ProgramStatus;
  total_classes: number;
  attended_classes: number;
  attendance_rate: number;
  total_evaluations: number;
  completed_evaluations: number;
  evaluation_completion_rate: number;
  overall_progress: number;
  progress_level: ProgressLevelType;
}

// Student Detail - Overall Metrics
export interface StudentOverallMetrics {
  total_courses: number;
  active_courses: number;
  completed_courses: number;
  attendance_rate: number;
  evaluation_completion_rate: number;
  average_grade: number;
}

// Student Detail - Engagement
export interface StudentEngagement {
  attendance: ProgressAttendanceInfo;
  evaluations: ProgressEvaluationsInfo;
  last_activity: string;
  overall_score: number;
}

// Student Detail Data
export interface StudentDetailData {
  student: ProgressStudentInfo;
  courses: StudentCourseProgress[];
  overall_metrics: StudentOverallMetrics;
  engagement: StudentEngagement;
}

// Student Detail Response
export interface StudentDetailResponse {
  success: boolean;
  data: StudentDetailData;
}

// Group Progress - Summary
export interface GroupProgressSummary {
  total_students: number;
  avg_attendance_rate: number;
  avg_evaluation_completion_rate: number;
  avg_overall_progress: number;
  avg_grade: number;
  students_at_risk: number;
  high_performers: number;
}

// Group Progress Data
export interface GroupProgressData {
  group_id: number;
  students: StudentProgressData[];
  summary: GroupProgressSummary;
}

// Group Progress Response
export interface GroupProgressResponse {
  success: boolean;
  data: GroupProgressData;
}

// Completion Rate - Group Data
export interface GroupCompletionRate {
  group_id: number;
  group_name: string;
  course_id: number;
  course_title: string;
  total_students: number;
  completed_students: number;
  in_progress_students: number;
  dropped_students: number;
  completion_rate: number;
  dropout_rate: number;
  avg_final_grade: number;
  status: CompletionStatus;
}

// Completion Rate - Overall Summary
export interface CompletionRateOverall {
  total_groups: number;
  avg_completion_rate: number;
  avg_dropout_rate: number;
  total_students: number;
  total_completed: number;
  total_dropped: number;
}

// Completion Rate Response
export interface CompletionRateResponse {
  success: boolean;
  data: GroupCompletionRate[];
  overall: CompletionRateOverall;
}

// Timeline Event
export interface TimelineEvent {
  type: 'evaluation' | 'attendance' | 'module' | 'assignment';
  date: string;
  context: string;
  status: string;
  value: string;
  icon: string;
}

// Student Timeline Response
export interface StudentTimelineResponse {
  success: boolean;
  data: {
    student_id: number;
    timeline: TimelineEvent[];
  };
}
