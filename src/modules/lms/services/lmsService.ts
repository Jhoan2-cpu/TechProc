// LMS Dashboard Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { LMSStats, RecentCourse, RecentEnrollment } from '../types';
import {
  mockLMSStats,
  mockRecentCourses,
  mockRecentEnrollments,
} from './lms.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const lmsService = {
  // Obtener estadísticas del dashboard
  async getStats(): Promise<LMSStats> {
    if (USE_MOCK) {
      return mockApiCall(mockLMSStats);
    }
    return apiRequest<LMSStats>('/lms/stats');
  },

  // Obtener cursos recientes
  async getRecentCourses(): Promise<RecentCourse[]> {
    if (USE_MOCK) {
      return mockApiCall(mockRecentCourses);
    }
    return apiRequest<RecentCourse[]>('/lms/courses/recent');
  },

  // Obtener inscripciones recientes
  async getRecentEnrollments(): Promise<RecentEnrollment[]> {
    if (USE_MOCK) {
      return mockApiCall(mockRecentEnrollments);
    }
    return apiRequest<RecentEnrollment[]>('/lms/enrollments/recent');
  },
};
