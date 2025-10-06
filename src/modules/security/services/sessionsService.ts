// Sessions Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import { mockActiveSessions } from './security.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const sessionsService = {
  // Obtener todas las sesiones activas
  async getAll(): Promise<typeof mockActiveSessions> {
    if (USE_MOCK) {
      return mockApiCall(mockActiveSessions);
    }
    return apiRequest<typeof mockActiveSessions>('/security/sessions');
  },

  // Cerrar una sesión
  async close(sessionId: number): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/security/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },
};
