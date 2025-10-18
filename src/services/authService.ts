// Authentication Service - Implementado según BACKEND_API_SPECIFICATION.md
import { apiRequest } from './api.config';
import type {
  User,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  RefreshTokenResponse,
  SessionData,
} from '../shared/types/auth';

export const authService = {
  // Login

   async login(credentials: LoginCredentials): Promise<LoginResponse> {

      //================================DESCOMENTAR CUANDO TODO EL API ESTÉ UNIDO
  //   // API real
  //   const response = await apiRequest<LoginResponse>('/auth/login', {
  //     method: 'POST',
  //     body: JSON.stringify(credentials),
  //   });

    //================================


    //RESPUESTA FALSA, PARA IMPLEMENTAR OTROS MÓDULOS [ELIMINAR CUANDO SE INCORPORE LA API REAL]
    const user: User = {
      id: 9,
      username: "JhoanAdmin",
      email: credentials.email,
      role: ["soporte_tecnico"],
      name: "Jhoan",
      first_name: "Cruz",
      last_name: "Castillo",
      profile_photo: null,
      status: "active",
    }
    
    const session: SessionData = {
      session_id: 1,
      token: "fasdfasdfasdfij9a8sdfu9aos8dfhj98aoshdf9sadf",
      expires_at: "2023-10-10T10:00:00Z",
    }
    const response : LoginResponse =  {
      success: true,
      data: {
        user: user,
        session: session,
      },
    }
    
    return response;
    
  },

  // Register - Endpoint: POST /auth/register
  async register(data: RegisterData): Promise<RegisterResponse> {
    // API real según especificación
    return apiRequest<RegisterResponse>('/auth/register', {
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
