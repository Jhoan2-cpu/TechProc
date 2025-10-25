import { apiRequest } from '../../../services/api.config';
import type {
  Department,
  DepartmentDetailsResponse,
  CreateDepartmentData,
  DepartmentResponse,
} from '../types';

/**
 * Servicio para gestión de departamentos
 */

// Obtener todos los departamentos
export const getDepartments = async (): Promise<Department[]> => {
  return apiRequest<Department[]>('/infraestructura/departments', {
    method: 'GET',
  });
};

// Obtener detalles de un departamento específico con sus empleados
export const getDepartmentById = async (id: number): Promise<DepartmentDetailsResponse> => {
  return apiRequest<DepartmentDetailsResponse>(`/infraestructura/departments/${id}`, {
    method: 'GET',
  });
};

// Crear un nuevo departamento
export const createDepartment = async (data: CreateDepartmentData): Promise<DepartmentResponse> => {
  return apiRequest<DepartmentResponse>('/infraestructura/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
