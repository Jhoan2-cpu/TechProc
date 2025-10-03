import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faBan,
  faFileArchive,
  faUsers,
  faPlus,
  faPlay,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import type {
  Incident,
  BlockedIP,
  Backup,
  ActiveSession
} from '../types';
import {
  SecurityStats,
  SessionCard,
  IncidentCard,
  BlockedIPCard,
  BackupCard,
} from '../components';

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
      <SecurityStats
        activeSessions={activeSessions}
        activeBlockedIPs={activeBlockedIPs}
        criticalIncidents={criticalIncidents}
        successfulBackups={successfulBackups}
        totalBackups={backups.length}
      />

      {/* Incidentes Críticos */}
      {criticalIncidents > 0 && (
        <div className="card p-6 bg-red-50 border-2 border-red-200 animate-slide-up">
          <h2 className="text-xl font-heading font-bold text-red-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Incidentes Críticos - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').map((incident) => (
              <IncidentCard
                key={incident.id_incident}
                incident={incident}
                formatDate={formatDate}
                compact={true}
              />
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
            <SessionCard
              key={session.session_id}
              session={session}
              formatDate={formatDate}
              compact={true}
            />
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
        {sessions.map((session) => (
          <SessionCard
            key={session.session_id}
            session={session}
            formatDate={formatDate}
          />
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
        {blockedIPs.map((ip) => (
          <BlockedIPCard
            key={ip.id_blocked_ip}
            blockedIP={ip}
            formatDate={formatDate}
          />
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
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id_incident}
            incident={incident}
            formatDate={formatDate}
          />
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
          {backups.map((backup) => (
            <BackupCard
              key={backup.id_backup}
              backup={backup}
              formatDate={formatDate}
            />
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
          security/dashboard
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
