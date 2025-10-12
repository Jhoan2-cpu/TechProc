import {
  faShieldHalved,
  faGraduationCap,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faUserCircle,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import type { UserRole, RoleInfo } from '../types';

export const getRoleInfo = (role: UserRole): RoleInfo => {
  const roles: Record<UserRole, RoleInfo> = {
    administrador: {
      label: 'Administrador',
      icon: faShieldHalved,
      color: 'text-red-600',
    },
    gestor_lms: {
      label: 'Gestor LMS',
      icon: faGraduationCap,
      color: 'text-blue-600',
    },
    soporte_tecnico: {
      label: 'Soporte Técnico',
      icon: faHeadset,
      color: 'text-yellow-600',
    },
    soporte_seguridad: {
      label: 'Soporte - Seguridad',
      icon: faLock,
      color: 'text-purple-600',
    },
    soporte_infraestructura: {
      label: 'Soporte - Infraestructura',
      icon: faServer,
      color: 'text-green-600',
    },
    developer_web: {
      label: 'Developer Web',
      icon: faGlobe,
      color: 'text-orange-600',
    },
    analista_datos: {
      label: 'Analista de Datos',
      icon: faChartLine,
      color: 'text-cyan-600',
    },
  };

  return roles[role] || { label: role, icon: faUserCircle, color: 'text-gray-600' };
};
