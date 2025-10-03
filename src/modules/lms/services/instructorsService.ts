// Instructors Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Instructor } from '../types';
import { mockInstructors } from './lms.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const instructorsService = {
  // Obtener todos los instructores
  async getAll(): Promise<Instructor[]> {
    if (USE_MOCK) {
      return mockApiCall(mockInstructors);
    }
    return apiRequest<Instructor[]>('/lms/instructors');
  },

  // Obtener un instructor por ID
  async getById(id: string): Promise<Instructor> {
    if (USE_MOCK) {
      const instructor = mockInstructors.find(i => i.id === id);
      if (!instructor) {
        throw new Error('Instructor no encontrado');
      }
      return mockApiCall(instructor);
    }
    return apiRequest<Instructor>(`/lms/instructors/${id}`);
  },

  // Crear un nuevo instructor
  async create(instructor: Omit<Instructor, 'id' | 'created_at' | 'updated_at'>): Promise<Instructor> {
    if (USE_MOCK) {
      const newInstructor: Instructor = {
        ...instructor,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(newInstructor);
    }
    return apiRequest<Instructor>('/lms/instructors', {
      method: 'POST',
      body: JSON.stringify(instructor),
    });
  },

  // Actualizar un instructor
  async update(id: string, instructor: Partial<Instructor>): Promise<Instructor> {
    if (USE_MOCK) {
      const existingInstructor = mockInstructors.find(i => i.id === id);
      if (!existingInstructor) {
        throw new Error('Instructor no encontrado');
      }
      const updatedInstructor = {
        ...existingInstructor,
        ...instructor,
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(updatedInstructor);
    }
    return apiRequest<Instructor>(`/lms/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instructor),
    });
  },

  // Eliminar un instructor
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/lms/instructors/${id}`, {
      method: 'DELETE',
    });
  },
};
