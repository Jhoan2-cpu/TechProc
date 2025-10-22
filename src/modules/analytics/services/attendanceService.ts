import { apiRequest } from '../../../services/api.config';
import type {
  AttendanceFilters,
  AttendanceRecordsResponse,
  AttendanceSummaryResponse,
  StudentStatsResponse,
  GroupStatsResponse,
  TrendResponse,
  RiskAnalysisResponse,
  FilterOptionsResponse,
} from '../types';

const BASE_PATH = '/data-analyst/attendance';

/**
 * Obtiene registros de asistencia con filtros y paginación
 */
export const getAttendanceRecords = async (
  filters?: AttendanceFilters
): Promise<AttendanceRecordsResponse> => {
  const params = new URLSearchParams();

  if (filters?.group_id) params.append('group_id', filters.group_id.toString());
  if (filters?.student_id) params.append('student_id', filters.student_id.toString());
  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.attended) params.append('attended', filters.attended);
  if (filters?.connection_quality) params.append('connection_quality', filters.connection_quality);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;

  return apiRequest<AttendanceRecordsResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene estadísticas generales de asistencia
 */
export const getAttendanceSummary = async (
  filters?: Partial<AttendanceFilters>
): Promise<AttendanceSummaryResponse> => {
  const params = new URLSearchParams();

  if (filters?.group_id) params.append('group_id', filters.group_id.toString());
  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${BASE_PATH}/stats/summary?${queryString}`
    : `${BASE_PATH}/stats/summary`;

  return apiRequest<AttendanceSummaryResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene estadísticas de asistencia por estudiante
 */
export const getStatsByStudent = async (
  filters?: Partial<AttendanceFilters>
): Promise<StudentStatsResponse> => {
  const params = new URLSearchParams();

  if (filters?.group_id) params.append('group_id', filters.group_id.toString());
  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.student_id) params.append('student_id', filters.student_id.toString());
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${BASE_PATH}/stats/by-student?${queryString}`
    : `${BASE_PATH}/stats/by-student`;

  return apiRequest<StudentStatsResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene estadísticas de asistencia por grupo
 */
export const getStatsByGroup = async (
  filters?: Partial<AttendanceFilters>
): Promise<GroupStatsResponse> => {
  const params = new URLSearchParams();

  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${BASE_PATH}/stats/by-group?${queryString}`
    : `${BASE_PATH}/stats/by-group`;

  return apiRequest<GroupStatsResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene análisis de tendencias de asistencia
 */
export const getAttendanceTrend = async (
  filters?: Partial<AttendanceFilters>
): Promise<TrendResponse> => {
  const params = new URLSearchParams();

  if (filters?.group_id) params.append('group_id', filters.group_id.toString());
  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${BASE_PATH}/trend?${queryString}`
    : `${BASE_PATH}/trend`;

  return apiRequest<TrendResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene análisis de riesgo de estudiantes
 */
export const getRiskAnalysis = async (
  threshold: number = 70,
  filters?: Partial<AttendanceFilters>
): Promise<RiskAnalysisResponse> => {
  const params = new URLSearchParams();

  params.append('threshold', threshold.toString());
  if (filters?.group_id) params.append('group_id', filters.group_id.toString());
  if (filters?.course_id) params.append('course_id', filters.course_id.toString());
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);

  const queryString = params.toString();
  const endpoint = `${BASE_PATH}/risk-analysis?${queryString}`;

  return apiRequest<RiskAnalysisResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Obtiene opciones disponibles para filtros
 */
export const getFilterOptions = async (): Promise<FilterOptionsResponse> => {
  return apiRequest<FilterOptionsResponse>(`${BASE_PATH}/filters/options`, {
    method: 'GET',
  });
};
