// Incidents Service
import { mockApiCall } from '../../../services/mockService';
import { apiRequest } from '../../../services/api.config';
import type { Incident } from '../types';
import { mockIncidents } from './security.mock';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

export const incidentsService = {
  // Obtener todos los incidentes
  async getAll(): Promise<typeof mockIncidents> {
    if (USE_MOCK) {
      return mockApiCall(mockIncidents);
    }
    return apiRequest<typeof mockIncidents>('/security/incidents');
  },

  // Obtener un incidente por ID
  async getById(id: number): Promise<typeof mockIncidents[0]> {
    if (USE_MOCK) {
      const incident = mockIncidents.find((i) => i.id_incident === id);
      if (!incident) {
        throw new Error('Incidente no encontrado');
      }
      return mockApiCall(incident);
    }
    return apiRequest<typeof mockIncidents[0]>(`/security/incidents/${id}`);
  },

  // Crear un nuevo incidente
  async create(incidentData: Partial<Incident>): Promise<typeof mockIncidents[0]> {
    if (USE_MOCK) {
      const newIncident = {
        id_incident: Date.now(),
        alert_id: 0,
        responsible_id: 1,
        title: '',
        status: 'open' as const,
        report_date: new Date().toISOString(),
        description: '',
        severity: 'medium',
        ...incidentData,
      };
      return mockApiCall(newIncident);
    }
    return apiRequest<typeof mockIncidents[0]>('/security/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  },

  // Actualizar un incidente
  async update(id: number, incidentData: Partial<Incident>): Promise<typeof mockIncidents[0]> {
    if (USE_MOCK) {
      const incident = mockIncidents.find((i) => i.id_incident === id);
      if (!incident) {
        throw new Error('Incidente no encontrado');
      }
      const updated = { ...incident, ...incidentData };
      return mockApiCall(updated);
    }
    return apiRequest<typeof mockIncidents[0]>(`/security/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(incidentData),
    });
  },
};
