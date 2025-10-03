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
  role: UserRole;
  name: string;
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
  { id: '1', username: 'admin', role: 'administrador', name: 'Administrador' },
  { id: '2', username: 'lms', role: 'gestor_lms', name: 'Gestor LMS' },
  { id: '3', username: 'seg', role: 'soporte_seguridad', name: 'Soporte Seguridad' },
  { id: '4', username: 'infra', role: 'soporte_infraestructura', name: 'Soporte Infraestructura' },
  { id: '5', username: 'web', role: 'developer_web', name: 'Developer Web' },
  { id: '6', username: 'data', role: 'analista_datos', name: 'Analista de Datos' },
];
