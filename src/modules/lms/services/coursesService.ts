// Courses Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Course } from '../types';
import { mockCourses } from './lms.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const coursesService = {
  // Obtener todos los cursos
  async getAll(): Promise<Course[]> {
    if (USE_MOCK) {
      return mockApiCall(mockCourses);
    }
    return apiRequest<Course[]>('/lms/courses');
  },

  // Obtener un curso por ID
  async getById(id: string): Promise<Course> {
    if (USE_MOCK) {
      const course = mockCourses.find(c => c.id === id);
      if (!course) {
        throw new Error('Curso no encontrado');
      }
      return mockApiCall(course);
    }
    return apiRequest<Course>(`/lms/courses/${id}`);
  },

  // Crear un nuevo curso
  async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    if (USE_MOCK) {
      const newCourse: Course = {
        ...course,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(newCourse);
    }
    return apiRequest<Course>('/lms/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },

  // Actualizar un curso
  async update(id: string, course: Partial<Course>): Promise<Course> {
    if (USE_MOCK) {
      const existingCourse = mockCourses.find(c => c.id === id);
      if (!existingCourse) {
        throw new Error('Curso no encontrado');
      }
      const updatedCourse = {
        ...existingCourse,
        ...course,
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(updatedCourse);
    }
    return apiRequest<Course>(`/lms/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  },

  // Eliminar un curso
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/lms/courses/${id}`, {
      method: 'DELETE',
    });
  },
};
