import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faUsers } from '@fortawesome/free-solid-svg-icons';
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
        Dashboard
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
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-sm rounded-xl p-6 border-2 border-red-500/50 shadow-xl shadow-red-500/10 animate-slide-up">
          <h2 className="text-xl font-heading font-bold text-red-400 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white" />
            </div>
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
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl animate-slide-up">
        <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faUsers} className="text-white" />
          </div>
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
