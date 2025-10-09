import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBan,
  faExclamationTriangle,
  faFileArchive,
} from '@fortawesome/free-solid-svg-icons';

interface SecurityStatsProps {
  activeSessions: number;
  activeBlockedIPs: number;
  criticalIncidents: number;
  successfulBackups: number;
  totalBackups: number;
}

export const SecurityStats = ({
  activeSessions,
  activeBlockedIPs,
  criticalIncidents,
  successfulBackups,
  totalBackups,
}: SecurityStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sesiones Activas */}
      <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 mb-1">Sesiones Activas</p>
            <p className="text-3xl font-heading font-bold text-success">{activeSessions}</p>
          </div>
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* IPs Bloqueadas */}
      <div
        className="card p-6 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700 mb-1">IPs Bloqueadas</p>
            <p className="text-3xl font-heading font-bold text-danger">{activeBlockedIPs}</p>
          </div>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faBan} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Incidentes Críticos */}
      <div
        className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-700 mb-1">Incidentes Críticos</p>
            <p className="text-3xl font-heading font-bold text-orange-400">{criticalIncidents}</p>
          </div>
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Backups Exitosos */}
      <div
        className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 mb-1">Backups Exitosos</p>
            <p className="text-3xl font-heading font-bold text-primary-400">
              {successfulBackups}/{totalBackups}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faFileArchive} className="text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
