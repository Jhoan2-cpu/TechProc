// Authentication Service - Implementado según BACKEND_API_SPECIFICATION.md
import { apiRequest } from './api.config';
import type {
  User,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RefreshTokenResponse,
} from '../shared/types/auth';

/**
 * Mock de usuarios con credenciales
 * Estos son los usuarios de prueba esperados por el backend según especificación
 * Cuando USE_MOCK = false, estos datos deben existir en la base de datos del backend
 */
const MOCK_CREDENTIALS = [
  {
    email: 'admin@techproc.com',
    password: 'admin123', // Según especificación
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@techproc.com',
      role: 'administrador' as const,
      name: 'Administrador',
      first_name: 'Super',
      last_name: 'Admin',
    },
  },
  {
    email: 'lms@techproc.com',
    password: 'lms123',
    user: {
      id: '2',
      username: 'lms',
      email: 'lms@techproc.com',
      role: 'gestor_lms' as const,
      name: 'Gestor LMS',
      first_name: 'Juan',
      last_name: 'Pérez',
    },
  },
  {
    email: 'soporte@techproc.com',
    password: 'soporte123',
    user: {
      id: '3',
      username: 'soporte',
      email: 'soporte@techproc.com',
      role: 'soporte_tecnico' as const,
      name: 'Soporte Técnico',
      first_name: 'Luis',
      last_name: 'Martínez',
    },
  },
  {
    email: 'security@techproc.com',
    password: 'security123',
    user: {
      id: '4',
      username: 'seg',
      email: 'security@techproc.com',
      role: 'soporte_seguridad' as const,
      name: 'Soporte Seguridad',
      first_name: 'María',
      last_name: 'González',
    },
  },
  {
    email: 'infra@techproc.com',
    password: 'infra123',
    user: {
      id: '5',
      username: 'infra',
      email: 'infra@techproc.com',
      role: 'soporte_infraestructura' as const,
      name: 'Soporte Infraestructura',
      first_name: 'Carlos',
      last_name: 'Ruiz',
    },
  },
  {
    email: 'web@techproc.com',
    password: 'web123',
    user: {
      id: '6',
      username: 'web',
      email: 'web@techproc.com',
      role: 'developer_web' as const,
      name: 'Developer Web',
      first_name: 'Ana',
      last_name: 'Torres',
    },
  },
  {
    email: 'data@techproc.com',
    password: 'data123',
    user: {
      id: '7',
      username: 'data',
      email: 'data@techproc.com',
      role: 'analista_datos' as const,
      name: 'Analista de Datos',
      first_name: 'Pedro',
      last_name: 'Sánchez',
    },
  },
];

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // API real
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  },

  // Register - Endpoint: POST /auth/register
  async register(data: RegisterData): Promise<LoginResponse> {
    // API real según especificación
    return apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logout
  async logout(): Promise<void> {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },

  // Refresh token - Endpoint: POST /auth/refresh
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // API real según especificación
    return apiRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Verificar token - Endpoint: POST /auth/verify
  async verifyToken(token: string): Promise<User> {
    // API real según especificación
    return apiRequest<User>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));// Decodificar payload del JWT
      console.log('Payload del token:', payload);
      const user: User = {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role as User['role'],
        name: `${payload.first_name} ${payload.last_name}`,
        first_name: payload.first_name as string,
        last_name: payload.last_name as string,
      }
      console.log('Usuario obtenido del token:', user);
      return user ? user : null;
    } catch {
      return null;
    }
  },

  // Guardar sesión
  saveSession(user: User, token: string, refreshToken?: string): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    if (refreshToken) {
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  },

  // Limpiar sesión
  clearSession(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },

  // Obtener token
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  },
};
