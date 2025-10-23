// Este servicio está temporalmente deshabilitado porque los tipos no están definidos
// Si necesitas usarlo, debes definir primero los tipos en ../types/index.ts

// import { apiRequest } from '../../../services/api.config';
// import type {
//   StudentProgressResponse,
//   StudentDetailResponse,
//   GroupProgressResponse,
//   CompletionRateResponse,
//   StudentTimelineResponse,
// } from '../types';

// const BASE_PATH = '/data-analyst/progress';

// /**
//  * Obtiene progreso de todos los estudiantes
//  */
// export const getAllStudentsProgress = async (): Promise<StudentProgressResponse> => {
//   return apiRequest<StudentProgressResponse>(`${BASE_PATH}/students`, {
//     method: 'GET',
//   });
// };

// /**
//  * Obtiene detalle completo de progreso de un estudiante específico
//  */
// export const getStudentDetail = async (studentId: number): Promise<StudentDetailResponse> => {
//   return apiRequest<StudentDetailResponse>(`${BASE_PATH}/students/${studentId}`, {
//     method: 'GET',
//   });
// };

// /**
//  * Obtiene progreso de estudiantes por grupo
//  */
// export const getProgressByGroup = async (groupId: number): Promise<GroupProgressResponse> => {
//   return apiRequest<GroupProgressResponse>(`${BASE_PATH}/by-group/${groupId}`, {
//     method: 'GET',
//   });
// };

// /**
//  * Obtiene tasa de completación por grupo
//  */
// export const getCompletionRate = async (): Promise<CompletionRateResponse> => {
//   return apiRequest<CompletionRateResponse>(`${BASE_PATH}/completion-rate`, {
//     method: 'GET',
//   });
// };

// /**
//  * Obtiene línea de tiempo de actividades de un estudiante
//  */
// export const getStudentTimeline = async (studentId: number): Promise<StudentTimelineResponse> => {
//   return apiRequest<StudentTimelineResponse>(`${BASE_PATH}/timeline/${studentId}`, {
//     method: 'GET',
//   });
// };
