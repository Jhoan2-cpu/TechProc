import { apiRequest } from '../../../services/api.config';
import type {
  CreateEmployeeWithUserData,
  CreateEmployeeWithUserResponse,
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
