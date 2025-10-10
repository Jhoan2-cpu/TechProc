import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faCheckCircle,
  faExclamationTriangle,
  faTools,
} from '@fortawesome/free-solid-svg-icons';

interface ServersStatsProps {
  totalServers: number;
  onlineServers: number;
  offlineServers: number;
  maintenanceServers: number;
}

export const ServersStats = ({
  totalServers,
  onlineServers,
  offlineServers,
  maintenanceServers,
}: ServersStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Servidores */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Servidores</p>
            <p className="text-3xl font-heading font-bold text-white">{totalServers}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faServer} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Servidores Online */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Online</p>
            <p className="text-3xl font-heading font-bold text-white">{onlineServers}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Servidores Offline */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Offline</p>
            <p className="text-3xl font-heading font-bold text-white">{offlineServers}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Servidores en Mantenimiento */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Mantenimiento</p>
            <p className="text-3xl font-heading font-bold text-white">{maintenanceServers}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <FontAwesomeIcon icon={faTools} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
