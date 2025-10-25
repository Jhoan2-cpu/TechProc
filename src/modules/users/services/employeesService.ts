import { apiRequest } from '../../../services/api.config';
import type {
  CreateEmployeeWithUserData,
  CreateEmployeeWithUserResponse,
  UpdateEmployeeData,
  UpdateEmployeeResponse,
} from '../types';

/**
 * Servicio para gestión de empleados
 */

// Crear un nuevo empleado con su usuario
export const createEmployeeWithUser = async (data: CreateEmployeeWithUserData): Promise<CreateEmployeeWithUserResponse> => {
  return apiRequest<CreateEmployeeWithUserResponse>('/infraestructura/employees/create-with-user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Actualizar un empleado existente
export const updateEmployee = async (employeeId: number, data: UpdateEmployeeData): Promise<UpdateEmployeeResponse> => {
  return apiRequest<UpdateEmployeeResponse>(`/infraestructura/employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
