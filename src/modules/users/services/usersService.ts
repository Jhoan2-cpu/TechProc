// Users Service - Módulo Administrador según USERS_CRUD_ENDPOINTS.md
import { apiRequest } from '../../../services/api.config';
import type {
  User,
  UsersListResponse,
  UserDetailResponse,
  UserCreateResponse,
  UserUpdateResponse,
  UserDeleteResponse,
  UsersFilterParams,
  CreateUserData,
  UpdateUserData,
} from '../types';

export const usersService = {
  /**
   * Listar todos los usuarios
   * Endpoint: GET /admin/users
   */
  async getAll(filters?: UsersFilterParams): Promise<User[]> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<UsersListResponse>(endpoint);
    console.log('Respuesta de getAll usuarios:', response);
    return response.data;
  },

  /**
   * Obtener detalles de un usuario
   * Endpoint: GET /admin/users/{user_id}
   */
  async getById(id: number): Promise<User> {
    const response = await apiRequest<UserDetailResponse>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo usuario
   * Endpoint: POST /admin/users
   */
  async create(data: CreateUserData): Promise<UserCreateResponse> {
    const response = await apiRequest<UserCreateResponse>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Actualizar un usuario
   * Endpoint: PUT /admin/users/{user_id}
   */
  async update(id: number, data: UpdateUserData): Promise<UserUpdateResponse> {
    const response = await apiRequest<UserUpdateResponse>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * Eliminar un usuario
   * Endpoint: DELETE /admin/users/{user_id}
   */
  async delete(id: number): Promise<void> {
    await apiRequest<UserDeleteResponse>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
