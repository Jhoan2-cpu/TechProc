import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronRight,
  faUsers,
  faUserClock,
  faGraduationCap,
  faTicket,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faTachometerAlt,
  faBookOpen,
  faUserGraduate,
  faChalkboardTeacher,
  faClipboardList,
  faInbox,
  faExchangeAlt,
  faUsersViewfinder,
  faBan,
  faUserSlash,
  faExclamationTriangle,
  faFileArchive,
  faKey,
  faHdd,
  faCog,
  faNewspaper,
  faBell,
  faBullhorn,
  faEnvelope,
  faRobot,
  faUserCheck,
  faTasks,
  faTrophy,
  faFileAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: IconDefinition;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapeo de rutas a información de breadcrumb
const routeMap: Record<string, { label: string; icon: IconDefinition; parent?: string }> = {
  '/': { label: 'Inicio', icon: faHome },
  '/profile': { label: 'Mi Perfil', icon: faUserCircle },
  '/users': { label: 'Gestión de Usuarios', icon: faUsers },
  '/pending-registrations': { label: 'Solicitudes de Registro', icon: faUserClock },

  // LMS
  '/lms-dashboard': { label: 'Dashboard', icon: faTachometerAlt, parent: '/lms' },
  '/lms-courses': { label: 'Cursos', icon: faBookOpen, parent: '/lms' },
  '/lms-students': { label: 'Estudiantes', icon: faUserGraduate, parent: '/lms' },
  '/lms-instructors': { label: 'Instructores', icon: faChalkboardTeacher, parent: '/lms' },
  '/lms': { label: 'LMS', icon: faGraduationCap },

  // Soporte
  '/tickets-dashboard': { label: 'Dashboard', icon: faTachometerAlt, parent: '/support' },
  '/tickets-my-tickets': { label: 'Mis Tickets', icon: faClipboardList, parent: '/support' },
  '/tickets-available': { label: 'Disponibles', icon: faInbox, parent: '/support' },
  '/tickets-escalations': { label: 'Escalaciones', icon: faExchangeAlt, parent: '/support' },
  '/support': { label: 'Soporte', icon: faTicket },

  // Seguridad
  '/security-dashboard': { label: 'Dashboard', icon: faTachometerAlt, parent: '/security' },
  '/security-sessions': { label: 'Sesiones Activas', icon: faUsersViewfinder, parent: '/security' },
  '/security-blocked-ips': { label: 'IPs Bloqueadas', icon: faBan, parent: '/security' },
  '/security-blocked-users': { label: 'Usuarios Bloqueados', icon: faUserSlash, parent: '/security' },
  '/security-incidents': { label: 'Incidentes', icon: faExclamationTriangle, parent: '/security' },
  '/security-backups': { label: 'Backups', icon: faFileArchive, parent: '/security' },
  '/security': { label: 'Seguridad', icon: faLock },

  // Infraestructura
  '/infrastructure-dashboard': { label: 'Dashboard', icon: faTachometerAlt, parent: '/infrastructure' },
  '/infrastructure-servers': { label: 'Servidores', icon: faServer, parent: '/infrastructure' },
  '/infrastructure-licenses': { label: 'Licencias', icon: faKey, parent: '/infrastructure' },
  '/infrastructure-storage': { label: 'Almacenamiento', icon: faHdd, parent: '/infrastructure' },
  '/infrastructure-software': { label: 'Software', icon: faCog, parent: '/infrastructure' },
  '/infrastructure': { label: 'Infraestructura', icon: faServer },

  // Web
  '/web-dashboard': { label: 'Dashboard', icon: faTachometerAlt, parent: '/web' },
  '/web-news': { label: 'Noticias', icon: faNewspaper, parent: '/web' },
  '/web-alerts': { label: 'Alertas', icon: faBell, parent: '/web' },
  '/web-announcements': { label: 'Anuncios', icon: faBullhorn, parent: '/web' },
  '/web-contacts': { label: 'Consultas', icon: faEnvelope, parent: '/web' },
  '/web-chatbot': { label: 'Chatbot', icon: faRobot, parent: '/web' },
  '/web': { label: 'Web', icon: faGlobe },

  // Analítica
  '/analytics-dashboard': { label: 'Dashboard', icon: faChartLine, parent: '/analytics' },
  '/analytics-attendance': { label: 'Asistencia', icon: faUserCheck, parent: '/analytics' },
  '/analytics-progress': { label: 'Progreso', icon: faTasks, parent: '/analytics' },
  '/analytics-performance': { label: 'Rendimiento', icon: faTrophy, parent: '/analytics' },
  '/analytics-dropout': { label: 'Riesgo Deserción', icon: faExclamationTriangle, parent: '/analytics' },
  '/analytics-reports': { label: 'Reportes', icon: faFileAlt, parent: '/analytics' },
  '/analytics': { label: 'Analítica', icon: faChartLine },
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Si se proporcionan items personalizados, usarlos
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const currentPath = location.pathname;
    const currentRoute = routeMap[currentPath];

    if (!currentRoute) {
      return [{ label: 'Inicio', path: '/', icon: faHome }];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', path: '/', icon: faHome }
    ];

    // Si hay un padre, agregarlo
    if (currentRoute.parent) {
      const parentRoute = routeMap[currentRoute.parent];
      if (parentRoute) {
        breadcrumbs.push({
          label: parentRoute.label,
          path: currentRoute.parent,
          icon: parentRoute.icon
        });
      }
    }

    // Agregar la ruta actual (si no es home)
    if (currentPath !== '/') {
      breadcrumbs.push({
        label: currentRoute.label,
        path: currentPath,
        icon: currentRoute.icon
      });
    }

    return breadcrumbs;
  })();

  const handleNavigate = (path: string, isLast: boolean) => {
    if (!isLast) {
      navigate(path);
    }
  };

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-400 text-xs"
              />
            )}

            <button
              onClick={() => handleNavigate(item.path, isLast)}
              disabled={isLast}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                ${isLast
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 cursor-default'
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-secondary-600 hover:to-secondary-700 hover:shadow-md hover:scale-105 border border-gray-700/30 hover:border-primary-500/50'
                }
              `}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.icon && (
                <FontAwesomeIcon
                  icon={item.icon}
                  className={isLast ? 'text-white' : 'text-primary-400'}
                />
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
