import {
  faShieldHalved,
  faGraduationCap,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { UserRole, RoleInfo } from '../types';

export const getRoleInfo = (role: UserRole): RoleInfo => {
  const roles: Record<UserRole, RoleInfo> = {
    admin: {
      label: 'Administrador',
      icon: faShieldHalved,
      color: 'text-red-600',
    },
    instructor: {
      label: 'Instructor',
      icon: faGraduationCap,
      color: 'text-blue-600',
    },
    student: {
      label: 'Estudiante',
      icon: faUserCircle,
      color: 'text-green-600',
    },
    lms: {
      label: 'Gestor LMS',
      icon: faGraduationCap,
      color: 'text-purple-600',
    },
    seg: {
      label: 'Soporte - Seguridad',
      icon: faLock,
      color: 'text-pink-600',
    },
    infra: {
      label: 'Soporte - Infraestructura',
      icon: faServer,
      color: 'text-indigo-600',
    },
    web: {
      label: 'Developer Web',
      icon: faGlobe,
      color: 'text-orange-600',
    },
    data: {
      label: 'Analista de Datos',
      icon: faChartLine,
      color: 'text-cyan-600',
    },
  };

  return roles[role] || { label: role, icon: faUserCircle, color: 'text-gray-600' };
};
