// Blocked Users Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { BlockedUser } from '../types';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

// Mock data
const mockBlockedUsers: BlockedUser[] = [
  {
    id_blocked_user: 1,
    user_id: 15,
    user_name: 'Carlos Mendoza',
    user_email: 'carlos.mendoza@example.com',
    reason: 'Violación de términos de servicio',
    block_date: '2025-01-15T10:30:00Z',
    blocked_by: 1,
    blocked_by_name: 'Admin Principal',
    active: true,
  },
  {
    id_blocked_user: 2,
    user_id: 23,
    user_name: 'María González',
    user_email: 'maria.gonzalez@example.com',
    reason: 'Múltiples intentos de acceso no autorizado',
    block_date: '2025-01-10T14:20:00Z',
    blocked_by: 1,
    blocked_by_name: 'Admin Principal',
    active: true,
  },
  {
    id_blocked_user: 3,
    user_id: 47,
    user_name: 'Roberto Silva',
    user_email: 'roberto.silva@example.com',
    reason: 'Actividad sospechosa detectada',
    block_date: '2024-12-20T09:15:00Z',
    unblock_date: '2025-01-05T16:30:00Z',
    blocked_by: 2,
    blocked_by_name: 'Juan Pérez',
    active: false,
  },
];

export const blockedUsersService = {
  // Obtener todos los usuarios bloqueados
  async getAll(): Promise<BlockedUser[]> {
    if (USE_MOCK) {
      return mockApiCall(mockBlockedUsers);
    }
    return apiRequest<BlockedUser[]>('/security/blocked-users');
  },

  // Bloquear un usuario
  async block(userData: { user_id: number; reason: string }): Promise<BlockedUser> {
    if (USE_MOCK) {
      const newBlockedUser: BlockedUser = {
        id_blocked_user: Date.now(),
        user_id: userData.user_id,
        user_name: 'Usuario Ejemplo',
        user_email: 'usuario@example.com',
        reason: userData.reason,
        block_date: new Date().toISOString(),
        blocked_by: 1,
        blocked_by_name: 'Admin Principal',
        active: true,
      };
      return mockApiCall(newBlockedUser);
    }
    return apiRequest<BlockedUser>('/security/blocked-users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Desbloquear un usuario
  async unblock(id: number): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/security/blocked-users/${id}`, {
      method: 'DELETE',
    });
  },
};
