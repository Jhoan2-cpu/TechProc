// Enrollments Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Enrollment } from '../types';
import { mockEnrollments, mockStudents, mockCourses } from './lms.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const enrollmentsService = {
  // Obtener todas las inscripciones
  async getAll(): Promise<Enrollment[]> {
    if (USE_MOCK) {
      return mockApiCall(mockEnrollments);
    }
    return apiRequest<Enrollment[]>('/lms/enrollments');
  },

  // Obtener inscripciones por estudiante
  async getByStudent(studentId: string): Promise<Enrollment[]> {
    if (USE_MOCK) {
      const enrollments = mockEnrollments.filter(e => e.student_id === studentId);
      return mockApiCall(enrollments);
    }
    return apiRequest<Enrollment[]>(`/lms/enrollments/student/${studentId}`);
  },

  // Obtener inscripciones por curso
  async getByCourse(courseId: string): Promise<Enrollment[]> {
    if (USE_MOCK) {
      const enrollments = mockEnrollments
        .filter(e => e.course_id === courseId)
        .map(enrollment => {
          const student = mockStudents.find(s => s.id === enrollment.student_id);
          const course = mockCourses.find(c => c.id === enrollment.course_id);
          return {
            ...enrollment,
            student,
            course,
          };
        });
      return mockApiCall(enrollments);
    }
    return apiRequest<Enrollment[]>(`/lms/enrollments/course/${courseId}`);
  },

  // Crear una inscripción
  async create(enrollment: Omit<Enrollment, 'id' | 'enrolled_at'>): Promise<Enrollment> {
    if (USE_MOCK) {
      const newEnrollment: Enrollment = {
        ...enrollment,
        id: String(Date.now()),
        enrolled_at: new Date().toISOString(),
      };
      return mockApiCall(newEnrollment);
    }
    return apiRequest<Enrollment>('/lms/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollment),
    });
  },

  // Actualizar progreso de inscripción
  async updateProgress(id: string, progress: number): Promise<Enrollment> {
    if (USE_MOCK) {
      const existingEnrollment = mockEnrollments.find(e => e.id === id);
      if (!existingEnrollment) {
        throw new Error('Inscripción no encontrada');
      }
      const updatedEnrollment = {
        ...existingEnrollment,
        progress,
      };
      return mockApiCall(updatedEnrollment);
    }
    return apiRequest<Enrollment>(`/lms/enrollments/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  },

  // Eliminar una inscripción
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/lms/enrollments/${id}`, {
      method: 'DELETE',
    });
  },
};
