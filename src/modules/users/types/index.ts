// Tipos del módulo users

export type UserRole =
  | 'administrador'
  | 'gestor_lms'
  | 'soporte_tecnico'
  | 'soporte_seguridad'
  | 'soporte_infraestructura'
  | 'developer_web'
  | 'analista_datos';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: UserRole;
  phone?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export interface RoleInfo {
  label: string;
  icon: any;
  color: string;
}