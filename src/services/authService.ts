// Authentication Service - Implementado según BACKEND_API_SPECIFICATION.md
import { apiRequest } from './api.config';
import type {
  User,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
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
  async register(data: RegisterData): Promise<RegisterResponse> {
    // Mapear rol del frontend al formato del API
    const roleMap: Record<string, string> = {
      'administrador': 'admin',
      'admin': 'admin',
      'gestor_lms': 'lms',
      'lms': 'lms',
      'soporte_tecnico': 'data', // Mapear a data por defecto
      'soporte_seguridad': 'seg',
      'seg': 'seg',
      'soporte_infraestructura': 'infra',
      'infra': 'infra',
      'web': 'web',
      'developer_web': 'web',
      'analista_datos': 'data',
      'data': 'data',
    };

    const apiRole = roleMap[data.role] || 'data';

    // API real según especificación
    // Aseguramos que position_id y department_id estén presentes con valores fijos
    const requestData: any = {
      ...data,
      role: apiRole,
      position_id: 1,
      department_id: 2,
    };

    // Limpiar campos opcionales para evitar problemas de validación
    // El backend acepta estos valores para employment_status: Active, Inactive, Terminated
    // Si no es uno de estos valores exactos, mejor no enviarlo (es nullable)
    if (requestData.employment_status && !['Active', 'Inactive', 'Terminated'].includes(requestData.employment_status)) {
      delete requestData.employment_status;
    }

    console.log('Datos finales enviados al API después del mapeo:', JSON.stringify(requestData, null, 2));

    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
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

  // Obtener empleado actual
  getCurrentEmployee(): any | null {
    const employeeStr = sessionStorage.getItem('employee');
    if (!employeeStr) return null;

    try {
      return JSON.parse(employeeStr);
    } catch {
      return null;
    }
  },

  // Guardar sesión (adaptado a la nueva estructura de la API)
  saveSession(user: User, token: string, sessionId?: number, employee?: any): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    if (sessionId) {
      sessionStorage.setItem('session_id', sessionId.toString());
    }
    if (employee) {
      sessionStorage.setItem('employee', JSON.stringify(employee));
    }
  },

  // Limpiar sesión
  clearSession(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('session_id');
    sessionStorage.removeItem('employee');
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
