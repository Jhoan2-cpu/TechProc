// Tipos de usuario del sistema según especificación BACKEND_API_SPECIFICATION.md

export type UserRole =
  | 'administrador'           // Acceso total
  | 'gestor_lms'             // Solo LMS
  | 'soporte_tecnico'        // Tickets solamente
  | 'soporte_seguridad'      // Tickets + Security
  | 'soporte_infraestructura'// Tickets + Infrastructure
  | 'developer_web'          // Web + Tickets
  | 'analista_datos';        // Solo Analytics

// Interfaz User según schema de la especificación
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  first_name: string;
  last_name: string;
}

// Interfaz completa para respuesta de login según especificación
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
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
  administrador: ['users', 'lms', 'tickets', 'security', 'infrastructure', 'web', 'analytics'],
  gestor_lms: ['lms'],
  soporte_tecnico: ['tickets'],
  soporte_seguridad: ['tickets', 'security'],
  soporte_infraestructura: ['tickets', 'infrastructure'],
  developer_web: ['tickets', 'web'],
  analista_datos: ['analytics'],
};

// Usuarios de prueba
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@techproc.com',
    role: 'administrador',
    name: 'Administrador',
    first_name: 'Super',
    last_name: 'Admin',
  },
  {
    id: '2',
    username: 'lms',
    email: 'lms@techproc.com',
    role: 'gestor_lms',
    name: 'Gestor LMS',
    first_name: 'Juan',
    last_name: 'Pérez',
  },
  {
    id: '3',
    username: 'soporte',
    email: 'soporte@techproc.com',
    role: 'soporte_tecnico',
    name: 'Soporte Técnico',
    first_name: 'Luis',
    last_name: 'Martínez',
  },
  {
    id: '4',
    username: 'seg',
    email: 'security@techproc.com',
    role: 'soporte_seguridad',
    name: 'Soporte Seguridad',
    first_name: 'María',
    last_name: 'González',
  },
  {
    id: '5',
    username: 'infra',
    email: 'infra@techproc.com',
    role: 'soporte_infraestructura',
    name: 'Soporte Infraestructura',
    first_name: 'Carlos',
    last_name: 'Ruiz',
  },
  {
    id: '6',
    username: 'web',
    email: 'web@techproc.com',
    role: 'developer_web',
    name: 'Developer Web',
    first_name: 'Ana',
    last_name: 'Torres',
  },
  {
    id: '7',
    username: 'data',
    email: 'data@techproc.com',
    role: 'analista_datos',
    name: 'Analista de Datos',
    first_name: 'Pedro',
    last_name: 'Sánchez',
  },
];
