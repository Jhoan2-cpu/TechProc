// Authentication Service
import { mockApiCall } from './mockService';
import { apiRequest } from './api.config';
import type { User } from '../shared/types/auth';

const USE_MOCK = true; // Cambiar a false cuando la API esté lista

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
}

// Mock de usuarios con credenciales
const MOCK_CREDENTIALS = [
  {
    email: 'admin@techproc.com',
    password: '123456',
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
    password: '123456',
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
    password: '123456',
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
    password: '123456',
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
    password: '123456',
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
    password: '123456',
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
    password: '123456',
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

// Generar un token JWT mock
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (USE_MOCK) {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Buscar usuario
      const mockUser = MOCK_CREDENTIALS.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!mockUser) {
        throw new Error('Credenciales inválidas');
      }

      const token = generateMockToken(mockUser.user.id);

      return mockApiCall({
        user: mockUser.user,
        token,
        refreshToken: generateMockToken(mockUser.user.id + '-refresh'),
      });
    }

    // API real
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  async register(data: RegisterData): Promise<LoginResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Verificar si el email ya existe
      const existingUser = MOCK_CREDENTIALS.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario mock
      const newUser: User = {
        id: String(Date.now()),
        username: data.email.split('@')[0],
        email: data.email,
        role: (data.role as any) || 'analista_datos',
        name: `${data.first_name} ${data.last_name}`,
        first_name: data.first_name,
        last_name: data.last_name,
      };

      const token = generateMockToken(newUser.id);

      return mockApiCall({
        user: newUser,
        token,
        refreshToken: generateMockToken(newUser.id + '-refresh'),
      });
    }

    // API real
    return apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logout
  async logout(): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockApiCall(undefined);
    }

    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockApiCall({
        token: generateMockToken('refreshed'),
      });
    }

    return apiRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Verificar token
  async verifyToken(token: string): Promise<User> {
    if (USE_MOCK) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = MOCK_CREDENTIALS.find((u) => u.user.id === payload.userId);
        if (!user) throw new Error('Usuario no encontrado');
        return mockApiCall(user.user);
      } catch {
        throw new Error('Token inválido');
      }
    }

    return apiRequest<User>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = MOCK_CREDENTIALS.find((u) => u.user.id === payload.userId);
      return user ? user.user : null;
    } catch {
      return null;
    }
  },

  // Guardar sesión
  saveSession(token: string, refreshToken?: string): void {
    localStorage.setItem('auth_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  // Limpiar sesión
  clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
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
    return localStorage.getItem('auth_token');
  },
};
