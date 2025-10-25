// Tipos del módulo users

// ============================================
// User Types
// ============================================

export type UserRole =
  | 'admin'
  | 'instructor'
  | 'student'
  | 'lms'
  | 'seg'
  | 'infra'
  | 'web'
  | 'data';

export type UserStatus = 'active' | 'inactive';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  dni?: string;
  document?: string;
  email: string;
  email_verified_at?: string | null;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  role: string[]; // Array de roles
  gender?: Gender;
  country?: string;
  country_location?: string;
  timezone?: string;
  profile_photo?: string | null;
  status: UserStatus;
  synchronized?: boolean;
  last_access_ip?: string | null;
  last_access?: string | null;
  last_connection?: string | null;
  created_at: string;
  updated_at?: string;
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

// ============================================
// Users Service Types
// ============================================

// Tipos de respuesta según la API
export interface UsersListResponse {
  success: boolean;
  data: User[];
}

export interface UserDetailResponse {
  success: boolean;
  data: User;
}

export interface UserCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
}

export interface UserDeleteResponse {
  success: boolean;
  message: string;
}

// Parámetros de filtrado para listar usuarios
export interface UsersFilterParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

// Datos para crear usuario
export interface CreateUserData {
  first_name: string;
  last_name: string;
  full_name?: string;
  dni?: string;
  document?: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: Gender;
  country?: string;
  country_location?: string;
  timezone?: string;
  profile_photo?: string | null;
  role: UserRole;
  status?: UserStatus;
  synchronized?: boolean;
}

// Datos para actualizar usuario
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  dni?: string;
  document?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: Gender;
  country?: string;
  country_location?: string;
  timezone?: string;
  profile_photo?: string | null;
  role?: UserRole;
  status?: UserStatus;
  synchronized?: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface UserFormModalProps {
  title: string;
  user?: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export interface UserFiltersProps {
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateClick: () => void;
}

export interface UserStatsCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  borderColor: string;
  shadowColor: string;
}

export interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onViewDetails: (user: User) => void;
}

// ============================================
// Department Types
// ============================================

export interface Department {
  id: number;
  department_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  employees?: Employee[];
}

export interface Position {
  id: number;
  position_name: string;
  department_id: number;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface CreatePositionData {
  position_name: string;
  department_id: number;
}

export interface UpdatePositionData {
  position_name: string;
  department_id: number;
}

export interface Employee {
  id: number;
  employee_id: number;
  hire_date: string;
  position_id: number;
  department_id: number;
  user_id: number;
  employment_status: string;
  schedule: string;
  speciality: string;
  salary: string;
  created_at: string;
  updated_at: string;
  user: User;
  position: Position;
}

export interface CreateDepartmentData {
  department_name: string;
  description: string;
}

export interface DepartmentResponse {
  id: number;
  department_name: string;
  description: string;
}

export interface DepartmentDetailsResponse extends Department {
  employees: Employee[];
}

export interface CreateEmployeeWithUserData {
  user: {
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    password: string;
    phone_number?: string;
    address?: string;
    birth_date?: string;
    role: string[];
    gender?: string;
    country?: string;
    country_location?: string;
    timezone?: string;
    status?: string;
  };
  employee: {
    hire_date: string;
    position_id: number;
    department_id: number;
    employment_status: string;
    schedule: string;
    speciality: string;
    salary: number;
  };
}

export interface CreateEmployeeWithUserResponse {
  success: boolean;
  message: string;
  data: Employee;
}