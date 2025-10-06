// Backups Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Backup } from '../types';
import { mockBackups } from './security.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const backupsService = {
  // Obtener todos los backups
  async getAll(): Promise<Backup[]> {
    if (USE_MOCK) {
      return mockApiCall(mockBackups);
    }
    return apiRequest<Backup[]>('/security/backups');
  },

  // Iniciar un backup manual
  async startManual(type: 'complete' | 'incremental' | 'differential'): Promise<Backup> {
    if (USE_MOCK) {
      const newBackup: Backup = {
        id_backup: Date.now(),
        user_id: 1,
        type,
        status: 'in_progress',
        backup_date: new Date().toISOString(),
        size_mb: 0,
      };
      return mockApiCall(newBackup);
    }
    return apiRequest<Backup>('/security/backups/manual', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },

  // Configurar backup automático
  async configureAutomatic(config: {
    type: 'complete' | 'incremental' | 'differential';
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  }): Promise<void> {
    if (USE_MOCK) {
      return mockApiCall(undefined);
    }
    return apiRequest<void>('/security/backups/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
};
