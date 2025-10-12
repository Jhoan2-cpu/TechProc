// Users Service - Módulo Administrador según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type { User } from '../types';

// Tipos de respuesta según la API
interface UsersListResponse {
  success: boolean;
  data: {
    users: ApiUser[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      per_page: number;
    };
  };
}

interface UserDetailResponse {
  success: boolean;
  data: ApiUser;
}

interface UserCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

interface UserUpdateResponse {
  success: boolean;
  message: string;
}

interface UserDeleteResponse {
  success: boolean;
  message: string;
}

// Tipos de la API (diferentes a los tipos del frontend)
interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  country?: string;
  role: string;
  status: string;
  profile_photo?: string;
  last_access?: string;
  last_access_ip?: string;
  created_at: string;
  updated_at?: string;
}

// Parámetros de filtrado para listar usuarios
export interface UsersFilterParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

// Datos para crear usuario
export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  country?: string;
  role: string;
  status: string;
}

// Datos para actualizar usuario
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  status?: string;
  role?: string;
}

// Conversión de ApiUser a User (frontend)
const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: String(apiUser.id),
    username: apiUser.email.split('@')[0],
    email: apiUser.email,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
    role: mapApiRoleToFrontendRole(apiUser.role),
    phone: apiUser.phone_number,
    department: undefined,
    is_active: apiUser.status === 'active',
    created_at: apiUser.created_at,
    last_login: apiUser.last_access,
  };
};

// Mapeo de roles de la API a roles del frontend
const mapApiRoleToFrontendRole = (apiRole: string): User['role'] => {
  const roleMap: Record<string, User['role']> = {
    'admin': 'administrador',
    'lms': 'gestor_lms',
    'seg': 'soporte_seguridad',
    'infra': 'soporte_infraestructura',
    'web': 'developer_web',
    'data': 'analista_datos',
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
  async getAll(filters?: UsersFilterParams): Promise<{ users: User[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.role) params.append('role', mapFrontendRoleToApiRole(filters.role as any));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<UsersListResponse>(endpoint);

    return {
      users: response.data.users.map(mapApiUserToUser),
      pagination: response.data.pagination,
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
