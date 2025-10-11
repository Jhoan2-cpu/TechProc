import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faKey,
  faExclamationTriangle,
  faHdd,
} from '@fortawesome/free-solid-svg-icons';

interface InfrastructureStatsProps {
  onlineServers: number;
  totalServers: number;
  activeLicenses: number;
  totalLicenses: number;
  criticalAlerts: number;
  totalStorage: number;
}

export const InfrastructureStats = ({
  onlineServers,
  totalServers,
  activeLicenses,
  totalLicenses,
  criticalAlerts,
  totalStorage,
}: InfrastructureStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Servidores Online */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Servidores Online</p>
            <p className="text-3xl font-heading font-bold text-white">{onlineServers}/{totalServers}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faServer} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Licencias Activas */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Licencias Activas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeLicenses}/{totalLicenses}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faKey} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Alertas Críticas */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Alertas Críticas</p>
            <p className="text-3xl font-heading font-bold text-white">{criticalAlerts}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Almacenamiento Total */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Almacenamiento</p>
            <p className="text-3xl font-heading font-bold text-white">{totalStorage} GB</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FontAwesomeIcon icon={faHdd} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
