// Tipos del módulo users

// ============================================
// User Types
// ============================================

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

// ============================================
// Users Service Types
// ============================================

// Tipos de respuesta según la API
export interface UsersListResponse {
  success: boolean;
  data: {
    users: ApiUser[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      per_page: number;
    };
  };
}

export interface UserDetailResponse {
  success: boolean;
  data: ApiUser;
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

// Tipos de la API (diferentes a los tipos del frontend)
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  country?: string;
  role: string;
  status: string;
  profile_photo?: string;
  last_access?: string;
  last_access_ip?: string;
  created_at: string;
  updated_at?: string;
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
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  country?: string;
  role: string;
  status: string;
}

// Datos para actualizar usuario
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  status?: string;
  role?: string;
}

// ============================================
// Registration Requests Service Types
// ============================================

// Tipos de respuesta según la API
export interface RegistrationRequestsListResponse {
  success: boolean;
  data: ApiRegistrationRequest[];
}

export interface ApproveRequestResponse {
  success: boolean;
  message: string;
}

export interface RejectRequestResponse {
  success: boolean;
  message: string;
}

// Tipo de solicitud de registro desde la API
export interface ApiRegistrationRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: string;
  reason?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Tipo de solicitud de registro para el frontend
export interface RegistrationRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: string;
  reason?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Parámetros de filtrado
export interface RegistrationRequestsFilterParams {
  status?: 'pending' | 'approved' | 'rejected';
}

// Datos para aprobar solicitud
export interface ApproveRequestData {
  role: string;
  status: string;
}

// Datos para rechazar solicitud
export interface RejectRequestData {
  rejection_reason: string;
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

export interface ApproveRegistrationModalProps {
  isOpen: boolean;
  registration: RegistrationRequest | null;
  onClose: () => void;
  onConfirm: (role: string) => void;
}

export interface RejectRegistrationModalProps {
  isOpen: boolean;
  registration: RegistrationRequest | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
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

export interface PendingRegistrationCardProps {
  registration: RegistrationRequest;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export interface PendingRegistrationStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface PendingRegistrationFiltersProps {
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected';
  onStatusChange: (status: 'all' | 'pending' | 'approved' | 'rejected') => void;
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
  roleInfo: RoleInfo;
  onEdit: (user: User) => void;
  onToggleStatus: (userId: string) => void;
}