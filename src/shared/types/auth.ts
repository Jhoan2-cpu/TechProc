// Tipos de usuario del sistema según especificación BACKEND_API_SPECIFICATION.md

export type UserRole =
  | 'admin'           // Acceso total
  | 'gestor_lms'             // Solo LMS
  | 'soporte_tecnico'        // Tickets solamente
  | 'soporte_seguridad'      // Tickets + Security
  | 'soporte_infraestructura'// Tickets + Infrastructure
  | 'developer_web'          // Web + Tickets
  | 'analista_datos';        // Solo Analytics

// Interfaz User según schema de la especificación
export interface User {
  id: number;
  username?: string;
  email: string;
  role: UserRole[];
  name?: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  status: string;
}

// Interfaz para la sesión de la respuesta de login
export interface SessionData {
  session_id: number;
  token: string;
  expires_at: string;
}

// Interfaz completa para respuesta de login según especificación real de la API
export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    session: SessionData;
  };
}

// Interfaz para credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz para datos de registro según especificación
export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole;
}

// Interfaz para respuesta de refresh token
export interface RefreshTokenResponse {
  token: string;
}

// Permisos de acceso a módulos por rol según tabla de la especificación
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  admin: ['users', 'lms', 'tickets', 'security', 'infrastructure', 'web', 'analytics'],
  gestor_lms: ['lms'],
  soporte_tecnico: ['tickets'],
  soporte_seguridad: ['tickets', 'security'],
  soporte_infraestructura: ['tickets', 'infrastructure'],
  developer_web: ['tickets', 'web'],
  analista_datos: ['analytics'],
};