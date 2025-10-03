// Configuración de rutas modulares

export const ROUTES = {
  // Autenticación
  AUTH: {
    LOGIN: '/login',
  },

  // Perfil de Usuario (Todos los usuarios)
  PROFILE: '/profile',

  // Módulo Users (Administrador)
  USERS: {
    ROOT: '/users',
    LIST: '/users/list',
    CREATE: '/users/create',
    EDIT: '/users/:id',
  },

  // Módulo LMS
  LMS: {
    ROOT: '/lms',
    COURSES: '/lms/courses',
    USERS: '/lms/users',
    CONFIG: '/lms/config',
  },

  // Módulo Tickets
  TICKETS: {
    ROOT: '/tickets',
    LIST: '/tickets/list',
    CREATE: '/tickets/create',
    DETAIL: '/tickets/:id',
  },

  // Módulo Security
  SECURITY: {
    ROOT: '/security',
    POLICIES: '/security/policies',
    LOGS: '/security/logs',
    ACCESS: '/security/access',
  },

  // Módulo Infrastructure
  INFRASTRUCTURE: {
    ROOT: '/infrastructure',
    SERVERS: '/infrastructure/servers',
    LICENSES: '/infrastructure/licenses',
    STORAGE: '/infrastructure/storage',
  },

  // Módulo Web
  WEB: {
    ROOT: '/web',
    CHATBOT: '/web/chatbot',
    FORMS: '/web/forms',
    CONTENT: '/web/content',
  },

  // Módulo Analytics
  ANALYTICS: {
    ROOT: '/analytics',
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    PREDICTIONS: '/analytics/predictions',
  },
};
