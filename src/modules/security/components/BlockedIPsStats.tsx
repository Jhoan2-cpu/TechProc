import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faCheckCircle,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

interface BlockedIPsStatsProps {
  totalBlocked: number;
  activeBlocked: number;
  unblockedToday: number;
}

export const BlockedIPsStats = ({
  totalBlocked,
  activeBlocked,
  unblockedToday,
}: BlockedIPsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total de IPs Bloqueadas */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Bloqueadas</p>
            <p className="text-3xl font-heading font-bold text-white">{totalBlocked}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faBan} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* IPs Activamente Bloqueadas */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Activas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeBlocked}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FontAwesomeIcon icon={faShieldAlt} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Desbloqueadas Hoy */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Desbloqueadas Hoy</p>
            <p className="text-3xl font-heading font-bold text-white">{unblockedToday}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
