import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { SecurityStats, SessionCard, IncidentCard } from '../components';
import { sessionsService, blockedIPsService, incidentsService, backupsService } from '../services';

export const SecurityDashboardPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, blockedIPsData, incidentsData, backupsData] = await Promise.all([
          sessionsService.getAll(),
          blockedIPsService.getAll(),
          incidentsService.getAll(),
          backupsService.getAll(),
        ]);
        setSessions(sessionsData);
        setBlockedIPs(blockedIPsData);
        setIncidents(incidentsData);
        setBackups(backupsData);
      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando datos de seguridad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white mb-6">
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
        <div className="card p-6 bg-danger/20 border-2 border-red-200 animate-slide-up">
          <h2 className="text-xl font-heading font-bold text-danger mb-4 flex items-center gap-2">
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
        <h2 className="text-xl font-heading font-bold text-white mb-4">
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
