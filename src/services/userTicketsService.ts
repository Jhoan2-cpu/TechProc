// User Tickets Service - Servicio para tickets de usuarios
import { apiRequest } from './api.config';
import type {
  UserTicket,
  CreateUserTicketData,
  CreateUserTicketResponse,
} from '../shared/types/userTickets';

export const userTicketsService = {
  /**
   * Crear un nuevo ticket
   * Endpoint: POST /tickets
   */
  async create(data: CreateUserTicketData): Promise<CreateUserTicketResponse> {
    const response = await apiRequest<CreateUserTicketResponse>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Obtener tickets del usuario
   * Endpoint: GET /tickets?user_id={user_id}
   */
  async getUserTickets(userId: number): Promise<UserTicket[]> {
    const response = await apiRequest<any>(`/tickets?user_id=${userId}`);

    // Manejar diferentes estructuras de respuesta
    if (response && response.data) {
      // Si data es un array, devolverlo
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // Si data es un objeto con una propiedad que contiene el array
      if (response.data.tickets && Array.isArray(response.data.tickets)) {
        return response.data.tickets;
      }
    }

    // Si la respuesta es directamente un array
    if (Array.isArray(response)) {
      return response;
    }

    // Si no se puede determinar la estructura, devolver array vacío
    console.warn('Estructura de respuesta inesperada:', response);
    return [];
  },
};
