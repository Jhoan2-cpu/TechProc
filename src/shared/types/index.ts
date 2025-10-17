// Tipos compartidos entre módulos

// Re-exportar tipos de autenticación
export * from './auth';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type ModuleName = 'lms' | 'tickets' | 'security' | 'infrastructure' | 'web' | 'analytics' | 'users';