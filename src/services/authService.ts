// Authentication Service - Implementado según BACKEND_API_SPECIFICATION.md
import { apiRequest } from './api.config';
import type {
  User,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RefreshTokenResponse,
} from '../shared/types/auth';

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
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Guardar sesión (adaptado a la nueva estructura de la API)
  saveSession(user: User, token: string, sessionId?: number): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    if (sessionId) {
      sessionStorage.setItem('session_id', sessionId.toString());
    }
  },

  // Limpiar sesión
  clearSession(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('session_id');
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
