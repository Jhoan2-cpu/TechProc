// Blocked IPs Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { BlockedIP } from '../types';
import { mockBlockedIPs } from './security.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const blockedIPsService = {
  // Obtener todas las IPs bloqueadas
  async getAll(): Promise<BlockedIP[]> {
    if (USE_MOCK) {
      return mockApiCall(mockBlockedIPs);
    }
    return apiRequest<BlockedIP[]>('/security/blocked-ips');
  },

  // Bloquear una IP
  async block(ipData: { ip_address: string; reason: string }): Promise<BlockedIP> {
    if (USE_MOCK) {
      const newBlockedIP: BlockedIP = {
        id_blocked_ip: Date.now(),
        ip_address: ipData.ip_address,
        reason: ipData.reason,
        block_date: new Date().toISOString(),
        active: true,
      };
      return mockApiCall(newBlockedIP);
    }
    return apiRequest<BlockedIP>('/security/blocked-ips', {
      method: 'POST',
      body: JSON.stringify(ipData),
    });
  },

  // Desbloquear una IP
  async unblock(id: number): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>(`/security/blocked-ips/${id}`, {
      method: 'DELETE',
    });
  },
};
