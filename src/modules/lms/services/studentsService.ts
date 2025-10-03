// Students Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Student } from '../types';
import { mockStudents } from './lms.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const studentsService = {
  // Obtener todos los estudiantes
  async getAll(): Promise<Student[]> {
    if (USE_MOCK) {
      return mockApiCall(mockStudents);
    }
    return apiRequest<Student[]>('/lms/students');
  },

  // Obtener un estudiante por ID
  async getById(id: string): Promise<Student> {
    if (USE_MOCK) {
      const student = mockStudents.find(s => s.id === id);
      if (!student) {
        throw new Error('Estudiante no encontrado');
      }
      return mockApiCall(student);
    }
    return apiRequest<Student>(`/lms/students/${id}`);
  },

  // Crear un nuevo estudiante
  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    if (USE_MOCK) {
      const newStudent: Student = {
        ...student,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(newStudent);
    }
    return apiRequest<Student>('/lms/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  },

  // Actualizar un estudiante
  async update(id: string, student: Partial<Student>): Promise<Student> {
    if (USE_MOCK) {
      const existingStudent = mockStudents.find(s => s.id === id);
      if (!existingStudent) {
        throw new Error('Estudiante no encontrado');
      }
      const updatedStudent = {
        ...existingStudent,
        ...student,
        updated_at: new Date().toISOString(),
      };
      return mockApiCall(updatedStudent);
    }
    return apiRequest<Student>(`/lms/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  },

  // Eliminar un estudiante
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/lms/students/${id}`, {
      method: 'DELETE',
    });
  },
};
