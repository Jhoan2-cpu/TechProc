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
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Sesiones Activas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeSessions}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faUsers} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* IPs Bloqueadas */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">IPs Bloqueadas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeBlockedIPs}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faBan} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Incidentes Críticos */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Incidentes Críticos</p>
            <p className="text-3xl font-heading font-bold text-white">{criticalIncidents}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Backups Exitosos */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Backups Exitosos</p>
            <p className="text-3xl font-heading font-bold text-white">
              {successfulBackups}/{totalBackups}
            </p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faFileArchive} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
