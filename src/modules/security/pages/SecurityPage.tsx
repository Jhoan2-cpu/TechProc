import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faBan,
  faDesktop,
  faFileArchive,
  faCheckCircle,
  faTimesCircle,
  faUsers,
  faClock,
  faUser,
  faGlobe,
  faCalendar,
  faPlay,
  faPause,
  faTrash,
  faPlus,
  faTachometerAlt,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import type {
  Incident,
  BlockedIP,
  Backup,
  ActiveSession
} from '../types';

// Datos mock - Sesiones activas con información de usuarios
const mockActiveSessions: (ActiveSession & {
  user_name: string;
  user_email: string;
  last_activity: string;
  location?: string;
})[] = [
  {
    session_id: 1,
    user_id: 5,
    user_name: 'Carlos Méndez',
    user_email: 'carlos.mendez@techproc.com',
    ip_address: '192.168.1.105',
    device: 'Chrome 120 - Windows 10',
    start_date: '2024-03-15 08:30:00',
    last_activity: '2024-03-15 14:25:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 2,
    user_id: 8,
    user_name: 'Ana Torres',
    user_email: 'ana.torres@techproc.com',
    ip_address: '192.168.1.120',
    device: 'Firefox 122 - macOS',
    start_date: '2024-03-15 09:00:00',
    last_activity: '2024-03-15 14:30:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 3,
    user_id: 12,
    user_name: 'Roberto Silva',
    user_email: 'roberto.silva@techproc.com',
    ip_address: '192.168.1.135',
    device: 'Chrome 120 - Android',
    start_date: '2024-03-15 10:15:00',
    last_activity: '2024-03-15 14:28:00',
    location: 'Arequipa, Perú',
    active: true,
  },
  {
    session_id: 4,
    user_id: 15,
    user_name: 'María González',
    user_email: 'maria.gonzalez@techproc.com',
    ip_address: '10.0.0.50',
    device: 'Safari 17 - iOS',
    start_date: '2024-03-15 11:00:00',
    last_activity: '2024-03-15 14:20:00',
    location: 'Cusco, Perú',
    active: true,
  },
];

const mockBlockedIPs: BlockedIP[] = [
  {
    id_blocked_ip: 1,
    ip_address: '192.168.100.50',
    reason: 'Múltiples intentos de acceso fallidos (15 intentos en 5 minutos)',
    block_date: '2024-03-15 08:00:00',
    active: true,
  },
  {
    id_blocked_ip: 2,
    ip_address: '10.0.0.123',
    reason: 'Actividad sospechosa - Escaneo de puertos detectado',
    block_date: '2024-03-14 20:00:00',
    active: true,
  },
  {
    id_blocked_ip: 3,
    ip_address: '203.0.113.45',
    reason: 'Intento de inyección SQL en formularios',
    block_date: '2024-03-14 15:30:00',
    active: true,
  },
  {
    id_blocked_ip: 4,
    ip_address: '198.51.100.89',
    reason: 'IP reportada en lista negra de spam/malware',
    block_date: '2024-03-13 10:00:00',
    active: false,
  },
];

const mockIncidents: (Incident & {
  description: string;
  severity: string;
  assigned_to?: string;
})[] = [
  {
    id_incident: 1,
    alert_id: 1,
    responsible_id: 3,
    title: 'Intento de acceso no autorizado detectado',
    description: 'Se detectaron múltiples intentos de acceso desde IP 192.168.100.50 con credenciales incorrectas',
    severity: 'high',
    status: 'investigating',
    report_date: '2024-03-15 08:15:00',
    assigned_to: 'Carlos Ramírez',
  },
  {
    id_incident: 2,
    alert_id: 2,
    responsible_id: 3,
    title: 'Actividad inusual en base de datos',
    description: 'Consultas sospechosas detectadas en horario no laboral',
    severity: 'medium',
    status: 'open',
    report_date: '2024-03-15 02:30:00',
  },
  {
    id_incident: 3,
    alert_id: 3,
    responsible_id: 1,
    title: 'Posible fuga de datos detectada',
    description: 'Transferencia inusual de gran volumen de datos hacia IP externa',
    severity: 'critical',
    status: 'investigating',
    report_date: '2024-03-15 12:00:00',
    assigned_to: 'Juan Pérez',
  },
  {
    id_incident: 4,
    alert_id: 4,
    responsible_id: 2,
    title: 'Malware detectado en estación de trabajo',
    description: 'El antivirus detectó y eliminó malware en PC-205',
    severity: 'medium',
    status: 'resolved',
    report_date: '2024-03-14 16:00:00',
    assigned_to: 'Ana García',
  },
];

const mockBackups: Backup[] = [
  {
    id_backup: 1,
    user_id: 1,
    type: 'complete',
    status: 'completed',
    backup_date: '2024-03-15 02:00:00',
    size_mb: 2048.5,
  },
  {
    id_backup: 2,
    user_id: 1,
    type: 'incremental',
    status: 'completed',
    backup_date: '2024-03-14 02:00:00',
    size_mb: 512.3,
  },
  {
    id_backup: 3,
    user_id: 1,
    type: 'differential',
    status: 'completed',
    backup_date: '2024-03-13 02:00:00',
    size_mb: 850.7,
  },
  {
    id_backup: 4,
    user_id: 1,
    type: 'incremental',
    status: 'failed',
    backup_date: '2024-03-12 02:00:00',
    size_mb: 0,
  },
];

type SecurityTab = 'dashboard' | 'sessions' | 'blocked_ips' | 'incidents' | 'backups';

export const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState<SecurityTab>('dashboard');
  const [sessions] = useState(mockActiveSessions);
  const [blockedIPs] = useState(mockBlockedIPs);
  const [incidents] = useState(mockIncidents);
  const [backups] = useState(mockBackups);

  const activeSessions = sessions.filter(s => s.active).length;
  const activeBlockedIPs = blockedIPs.filter(ip => ip.active).length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const successfulBackups = backups.filter(b => b.status === 'completed').length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIncidentSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'investigating': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'dashboard' as SecurityTab, name: 'Dashboard', icon: faTachometerAlt },
    { id: 'sessions' as SecurityTab, name: 'Sesiones Activas', icon: faUsers },
    { id: 'blocked_ips' as SecurityTab, name: 'IPs Bloqueadas', icon: faBan },
    { id: 'incidents' as SecurityTab, name: 'Incidentes', icon: faExclamationTriangle },
    { id: 'backups' as SecurityTab, name: 'Backups', icon: faFileArchive },
  ];

  const renderDashboard = () => (
    <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Sesiones Activas</p>
              <p className="text-3xl font-heading font-bold text-green-900">{activeSessions}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">IPs Bloqueadas</p>
              <p className="text-3xl font-heading font-bold text-red-900">{activeBlockedIPs}</p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faBan} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 mb-1">Incidentes Críticos</p>
              <p className="text-3xl font-heading font-bold text-orange-900">{criticalIncidents}</p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Backups Exitosos</p>
              <p className="text-3xl font-heading font-bold text-blue-900">{successfulBackups}/{backups.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faFileArchive} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Incidentes Críticos */}
      {criticalIncidents > 0 && (
        <div className="card p-6 bg-red-50 border-2 border-red-200 animate-slide-up">
          <h2 className="text-xl font-heading font-bold text-red-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Incidentes Críticos - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').map((incident) => (
              <div key={incident.id_incident} className="bg-white border border-red-300 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-secondary-900 mb-1">
                      #{incident.id_incident} - {incident.title}
                    </h3>
                    <p className="text-sm text-secondary-700 mb-2">{incident.description}</p>
                    <div className="flex gap-4 text-xs text-secondary-600">
                      <span>{formatDate(incident.report_date)}</span>
                      {incident.assigned_to && <span>Asignado a: {incident.assigned_to}</span>}
                    </div>
                  </div>
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sesiones Activas Recientes */}
      <div className="card p-6 animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">
          Sesiones Activas Recientes
        </h2>
        <div className="space-y-3">
          {sessions.slice(0, 3).map((session) => (
            <div key={session.session_id} className="border border-secondary-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{session.user_name}</p>
                    <p className="text-sm text-secondary-600">{session.user_email}</p>
                    <div className="flex gap-4 text-xs text-secondary-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faGlobe} />
                        {session.ip_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faDesktop} />
                        {session.device}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-secondary-600">Última actividad:</p>
                  <p className="font-medium text-secondary-900">{formatDate(session.last_activity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Monitoreo de Sesiones Activas
        </h2>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
          {activeSessions} activas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session, index) => (
          <div
            key={session.session_id}
            className="card p-6 hover:shadow-lg transition-all animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-secondary-900">{session.user_name}</h3>
                  <p className="text-secondary-600">{session.user_email}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-secondary-500 mt-2">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faGlobe} className="text-secondary-400" />
                      <span className="font-mono">{session.ip_address}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faDesktop} className="text-secondary-400" />
                      {session.device}
                    </span>
                    {session.location && (
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faGlobe} className="text-secondary-400" />
                        {session.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:text-right space-y-2">
                <div>
                  <p className="text-xs text-secondary-500">Inicio de sesión</p>
                  <p className="text-sm font-medium text-secondary-900">{formatDate(session.start_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-500">Última actividad</p>
                  <p className="text-sm font-medium text-secondary-900">{formatDate(session.last_activity)}</p>
                </div>
              </div>
              <div className="flex lg:flex-col gap-2">
                <button className="btn bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faPause} />
                  Suspender
                </button>
                <button className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faTimesCircle} />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlockedIPs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Gestión de IPs Bloqueadas
        </h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Bloquear IP
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blockedIPs.map((ip, index) => (
          <div
            key={ip.id_blocked_ip}
            className={`card p-6 animate-fade-in ${ip.active ? 'border-l-4 border-red-500' : 'opacity-60'}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faBan} className={ip.active ? 'text-red-600' : 'text-gray-400'} size="lg" />
                  <div>
                    <h3 className="font-mono font-bold text-xl text-secondary-900">{ip.ip_address}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${ip.active ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {ip.active ? 'Bloqueada' : 'Desbloqueada'}
                    </span>
                  </div>
                </div>
                <p className="text-secondary-700 mb-2">{ip.reason}</p>
                <p className="text-sm text-secondary-500">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  Bloqueada: {formatDate(ip.block_date)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {ip.active ? (
                  <button className="btn bg-green-600 hover:bg-green-700 text-white">
                    Desbloquear
                  </button>
                ) : (
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Bloquear
                  </button>
                )}
                <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Gestión de Incidentes de Seguridad
        </h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Incidente
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {incidents.map((incident, index) => (
          <div
            key={incident.id_incident}
            className={`card p-6 border-2 hover:shadow-lg transition-all animate-fade-in ${getIncidentSeverityColor(incident.severity)}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-secondary-900">
                      Incidente #{incident.id_incident} - {incident.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIncidentSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                        {incident.status.replace('_', ' ').charAt(0).toUpperCase() + incident.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-secondary-700 mb-3">{incident.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                    {formatDate(incident.report_date)}
                  </span>
                  {incident.assigned_to && (
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUser} className="text-secondary-400" />
                      {incident.assigned_to}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClipboardList} className="text-secondary-400" />
                    Alerta #{incident.alert_id}
                  </span>
                </div>
              </div>
              <div className="flex lg:flex-col gap-2 lg:w-40">
                {incident.status !== 'resolved' && incident.status !== 'closed' && (
                  <>
                    <button className="btn bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none">
                      Resolver
                    </button>
                    <button className="btn bg-yellow-600 hover:bg-yellow-700 text-white flex-1 lg:flex-none">
                      Investigar
                    </button>
                  </>
                )}
                <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBackups = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Gestión de Backups de Seguridad
        </h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlay} />
          Iniciar Backup Manual
        </button>
      </div>

      {/* Configuración de Backup Automático */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
          Configuración de Backup Automático
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Tipo de Backup</label>
            <select className="select w-full">
              <option>Completo</option>
              <option>Incremental</option>
              <option>Diferencial</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Frecuencia</label>
            <select className="select w-full">
              <option>Diario</option>
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Hora de Ejecución</label>
            <input type="time" className="input w-full" defaultValue="02:00" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
            Cancelar
          </button>
          <button className="btn bg-primary-600 hover:bg-primary-700 text-white">
            Guardar Configuración
          </button>
        </div>
      </div>

      {/* Historial de Backups */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
          Historial de Backups
        </h3>
        <div className="space-y-3">
          {backups.map((backup, index) => (
            <div
              key={backup.id_backup}
              className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    icon={backup.status === 'completed' ? faCheckCircle : backup.status === 'failed' ? faTimesCircle : faClock}
                    className={`text-3xl ${
                      backup.status === 'completed' ? 'text-green-600' :
                      backup.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold text-secondary-900">
                      Backup {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      {formatDate(backup.backup_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-secondary-600">Tamaño</p>
                    <p className="font-semibold text-secondary-900">{backup.size_mb.toFixed(1)} MB</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    backup.status === 'completed' ? 'bg-green-100 text-green-700' :
                    backup.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {backup.status === 'completed' ? 'Exitoso' :
                     backup.status === 'failed' ? 'Fallido' : 'En Progreso'}
                  </span>
                  {backup.status === 'completed' && (
                    <button className="btn bg-primary-600 hover:bg-primary-700 text-white">
                      Restaurar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
          Centro de Seguridad
        </h1>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-50'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'sessions' && renderSessions()}
      {activeTab === 'blocked_ips' && renderBlockedIPs()}
      {activeTab === 'incidents' && renderIncidents()}
      {activeTab === 'backups' && renderBackups()}
    </div>
  );
};
