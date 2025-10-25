import { apiRequest } from '../../../services/api.config';
import type {
  Position,
  CreatePositionData,
  UpdatePositionData,
} from '../types';

/**
 * Servicio para gestión de posiciones/cargos
 */

// Obtener todas las posiciones de un departamento
export const getPositionsByDepartment = async (departmentId: number): Promise<Position[]> => {
  return apiRequest<Position[]>(`/administrator/positions?department_id=${departmentId}`, {
    method: 'GET',
  });
};

// Crear una nueva posición
export const createPosition = async (data: CreatePositionData): Promise<Position> => {
  return apiRequest<Position>('/administrator/positions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Actualizar una posición existente
export const updatePosition = async (id: number, data: UpdatePositionData): Promise<Position> => {
  return apiRequest<Position>(`/administrator/positions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
