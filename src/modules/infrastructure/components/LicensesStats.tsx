import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

interface LicensesStatsProps {
  totalLicenses: number;
  activeLicenses: number;
  expiredLicenses: number;
  expiringLicenses: number;
}

export const LicensesStats = ({
  totalLicenses,
  activeLicenses,
  expiredLicenses,
  expiringLicenses,
}: LicensesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Licencias */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Licencias</p>
            <p className="text-3xl font-heading font-bold text-white">{totalLicenses}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faKey} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Licencias Activas */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Activas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeLicenses}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Licencias Expiradas */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Expiradas</p>
            <p className="text-3xl font-heading font-bold text-white">{expiredLicenses}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Por Vencer (próximos 30 días) */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Por Vencer</p>
            <p className="text-3xl font-heading font-bold text-white">{expiringLicenses}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <FontAwesomeIcon icon={faClock} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
