// Tipos de usuario del sistema según especificación BACKEND_API_SPECIFICATION.md

export type UserRole =
  | 'admin'
  | 'lms'
  | 'support'        // Añadido para coincidir con MODULE_ACCESS
  | 'soporte_seguridad'
  | 'soporte_infraestructura'
  | 'developer_web'
  | 'analista_datos'
  | 'seg'
  | 'infra'
  | 'web'
  | 'data';

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
// Interfaz para datos del empleado
export interface Employee {
  id: number;
  employee_id: string | null;
  hire_date: string;
  position: {
    id: number;
    position_name: string;
    department_id: number;
  };
  department: {
    id: number;
    department_name: string;
  };
  employment_status: string;
  schedule: string;
  speciality: string;
  salary: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    session: SessionData;
    employee: Employee;
  };
}

// Interfaz para credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz para datos de registro según especificación real de la API
export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: UserRole | string; // Aceptar tanto UserRole como string para mapeo interno
  reason: string;
  position_id: number;
  department_id: number;
  hire_date: string;
  employment_status: string;
  schedule: string;
  speciality: string;
  salary: number;
}

// Interfaz para respuesta de registro
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    request_id: number;
  };
}

// Interfaz para respuesta de refresh token
export interface RefreshTokenResponse {
  token: string;
}

// Permisos de acceso a módulos por rol según tabla de la especificación
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  admin: ['users', 'lms', 'tickets', 'security', 'infra', 'web', 'analytics'],
  administrador: ['users', 'lms', 'tickets', 'security', 'infra', 'web', 'analytics'],
  lms: ['lms'],
<<<<<<< HEAD
  support: ['tickets'], // Cambiado de 'support' a 'tickets'
=======
  gestor_lms: ['lms'],
  support: ['tickets'],
  soporte_tecnico: ['tickets'],
  seg: ['tickets', 'security'],
>>>>>>> origin/DEV-ADAPTANDO
  soporte_seguridad: ['tickets', 'security'],
  infra: ['tickets', 'infra'],
  soporte_infraestructura: ['tickets', 'infra'],
  web: ['tickets', 'web'],
  developer_web: ['tickets', 'web'],
  data: ['analytics'],
  analista_datos: ['analytics'],
  seg: ['tickets', 'security'],
  infra: ['tickets', 'infrastructure'],
  data: ['analytics'],
};