// Registration Requests Service - Módulo Administrador según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  RegistrationRequestsListResponse,
  ApproveRequestResponse,
  RejectRequestResponse,
  ApiRegistrationRequest,
  RegistrationRequest,
  RegistrationRequestsFilterParams,
  ApproveRequestData,
  RejectRequestData,
} from '../types';

// Conversión de ApiRegistrationRequest a RegistrationRequest
const mapApiRequestToRequest = (apiRequest: ApiRegistrationRequest): RegistrationRequest => {
  return {
    id: String(apiRequest.id),
    first_name: apiRequest.first_name,
    last_name: apiRequest.last_name,
    email: apiRequest.email,
    phone_number: apiRequest.phone_number,
    role: apiRequest.role,
    reason: apiRequest.reason,
    created_at: apiRequest.created_at,
    status: apiRequest.status,
  };
};

export const registrationRequestsService = {
  /**
   * Listar solicitudes de registro pendientes
   * Endpoint: GET /admin/registration-requests
   */
  async getAll(filters?: RegistrationRequestsFilterParams): Promise<RegistrationRequest[]> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/admin/registration-requests${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<RegistrationRequestsListResponse>(endpoint);
    return response.data.map(mapApiRequestToRequest);
  },

  /**
   * Aprobar solicitud de registro
   * Endpoint: POST /admin/registration-requests/{request_id}/approve
   */
  async approve(requestId: string, data: ApproveRequestData): Promise<void> {
    await apiRequest<ApproveRequestResponse>(
      `/admin/registration-requests/${requestId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Rechazar solicitud de registro
   * Endpoint: POST /admin/registration-requests/{request_id}/reject
   */
  async reject(requestId: string, data: RejectRequestData): Promise<void> {
    await apiRequest<RejectRequestResponse>(
      `/admin/registration-requests/${requestId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },
};
