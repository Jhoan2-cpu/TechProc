// Tipos de usuario del sistema

export type UserRole =
  | 'administrador'
  | 'gestor_lms'
  | 'soporte_seguridad'
  | 'soporte_infraestructura'
  | 'developer_web'
  | 'analista_datos';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  first_name: string;
  last_name: string;
}

// Permisos de acceso a módulos por rol
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  administrador: ['users', 'lms', 'tickets', 'security', 'infrastructure', 'web', 'analytics'],
  gestor_lms: ['lms'],
  soporte_seguridad: ['tickets', 'security'],
  soporte_infraestructura: ['tickets', 'infrastructure'],
  developer_web: ['web', 'tickets'],
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
    username: 'seg',
    email: 'security@techproc.com',
    role: 'soporte_seguridad',
    name: 'Soporte Seguridad',
    first_name: 'María',
    last_name: 'González',
  },
  {
    id: '4',
    username: 'infra',
    email: 'infra@techproc.com',
    role: 'soporte_infraestructura',
    name: 'Soporte Infraestructura',
    first_name: 'Carlos',
    last_name: 'Ruiz',
  },
  {
    id: '5',
    username: 'web',
    email: 'web@techproc.com',
    role: 'developer_web',
    name: 'Developer Web',
    first_name: 'Ana',
    last_name: 'Torres',
  },
  {
    id: '6',
    username: 'data',
    email: 'data@techproc.com',
    role: 'analista_datos',
    name: 'Analista de Datos',
    first_name: 'Pedro',
    last_name: 'Sánchez',
  },
];
