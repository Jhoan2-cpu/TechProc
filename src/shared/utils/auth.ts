import type { User } from '../types/auth';
import { MODULE_ACCESS } from '../types/auth';

// Verificar si el usuario tiene acceso a un módulo específico
export const hasAccess = (user: User | null, module: string): boolean => {
  if (!user) return false;
  return MODULE_ACCESS[user.role].includes(module);
};

// Obtener lista de módulos accesibles para un usuario
export const getAccessibleModules = (user: User | null): string[] => {
  if (!user) return [];
  return MODULE_ACCESS[user.role];
};
