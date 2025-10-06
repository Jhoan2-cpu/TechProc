import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Incident, BlockedIP, Backup, ActiveSession } from '../types';
import { SecurityStats, SessionCard, IncidentCard } from '../components';

// Datos mock
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
    description: 'Se detectaron múltiples intentos de acceso desde IP 192.168.100.50',
    severity: 'high',
    status: 'investigating',
    report_date: '2024-03-15 08:15:00',
    assigned_to: 'Carlos Ramírez',
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
    id_backup: 4,
    user_id: 1,
    type: 'incremental',
    status: 'failed',
    backup_date: '2024-03-12 02:00:00',
    size_mb: 0,
  },
];

export const SecurityDashboardPage = () => {
  const [sessions] = useState(mockActiveSessions);
  const [blockedIPs] = useState(mockBlockedIPs);
  const [incidents] = useState(mockIncidents);
  const [backups] = useState(mockBackups);

  const activeSessions = sessions.filter((s) => s.active).length;
  const activeBlockedIPs = blockedIPs.filter((ip) => ip.active).length;
  const criticalIncidents = incidents.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved'
  ).length;
  const successfulBackups = backups.filter((b) => b.status === 'completed').length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
        security/dashboard
      </h1>

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
            {incidents
              .filter((i) => i.severity === 'critical' && i.status !== 'resolved')
              .map((incident) => (
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
    </div>
  );
};
