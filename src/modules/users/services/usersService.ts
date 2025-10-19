// Users Service - Módulo Administrador según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  User,
  UsersListResponse,
  UserDetailResponse,
  UserCreateResponse,
  UserUpdateResponse,
  UserDeleteResponse,
  ApiUser,
  UsersFilterParams,
  CreateUserData,
  UpdateUserData,
} from '../types';

// Conversión de ApiUser a User (frontend)
const mapApiUserToUser = (apiUser: ApiUser): User => {
  // Tomar el primer rol del array (la API devuelve roles como array)
  const primaryRole = apiUser.role && apiUser.role.length > 0 ? apiUser.role[0] : 'data';

  return {
    id: String(apiUser.id),
    username: apiUser.email.split('@')[0],
    email: apiUser.email,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
    role: mapApiRoleToFrontendRole(primaryRole),
    phone: apiUser.phone_number,
    department: undefined,
    is_active: apiUser.status === 'active', // active=true, inactive/banned=false
    created_at: apiUser.created_at,
    last_login: apiUser.last_access || undefined,
  };
};

// Mapeo de roles de la API a roles del frontend
const mapApiRoleToFrontendRole = (apiRole: string): User['role'] => {
  const roleMap: Record<string, User['role']> = {
    'admin': 'administrador',
    'lms': 'gestor_lms',
    'gestor_lms': 'gestor_lms',
    'soporte_tecnico': 'soporte_tecnico',
    'seg': 'soporte_seguridad',
    'soporte_seguridad': 'soporte_seguridad',
    'infra': 'soporte_infraestructura',
    'soporte_infraestructura': 'soporte_infraestructura',
    'web': 'developer_web',
    'developer_web': 'developer_web',
    'data': 'analista_datos',
    'analista_datos': 'analista_datos',
    // Roles adicionales que vienen del API
    'editor': 'administrador',
    'writer': 'analista_datos',
  };
  return roleMap[apiRole] || 'analista_datos';
};

// Mapeo de roles del frontend a roles de la API
const mapFrontendRoleToApiRole = (frontendRole: User['role']): string => {
  const roleMap: Record<User['role'], string> = {
    'administrador': 'admin',
    'gestor_lms': 'lms',
    'soporte_seguridad': 'seg',
    'soporte_infraestructura': 'infra',
    'developer_web': 'web',
    'analista_datos': 'data',
    'soporte_tecnico': 'soporte',
  };
  return roleMap[frontendRole] || 'data';
};

export const usersService = {
  /**
   * Listar todos los usuarios
   * Endpoint: GET /admin/users
   */
  async getAll(filters?: UsersFilterParams): Promise<{ users: User[]; pagination: { page: number; limit: number; total: number } }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.role) params.append('role', mapFrontendRoleToApiRole(filters.role as User['role']));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<UsersListResponse>(endpoint);
    console.log('Respuesta de getAll usuarios:', response);
    return {
      users: response.data.users.map(mapApiUserToUser),
      pagination: {
        page: response.data.pagination.current_page,
        limit: response.data.pagination.per_page,
        total: response.data.pagination.total_records,
      },
    };
  },

  /**
   * Obtener detalles de un usuario
   * Endpoint: GET /admin/users/{user_id}
   */
  async getById(id: string): Promise<User> {
    const response = await apiRequest<UserDetailResponse>(`/admin/users/${id}`);
    return mapApiUserToUser(response.data);
  },

  /**
   * Crear un nuevo usuario
   * Endpoint: POST /admin/users
   */
  async create(data: CreateUserData): Promise<User> {
    const apiData = {
      ...data,
      role: mapFrontendRoleToApiRole(data.role as any),
    };

    const response = await apiRequest<UserCreateResponse>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
    // Obtener el usuario completo
    return this.getById(String(response.data.id));
  },

  /**
   * Actualizar un usuario
   * Endpoint: PUT /admin/users/{user_id}
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const apiData = {
      ...data,
      role: data.role ? mapFrontendRoleToApiRole(data.role as any) : undefined,
    };

    await apiRequest<UserUpdateResponse>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });

    // Obtener el usuario actualizado
    return this.getById(id);
  },

  /**
   * Eliminar un usuario
   * Endpoint: DELETE /admin/users/{user_id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<UserDeleteResponse>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
