import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faKey,
  faExclamationTriangle,
  faLaptop,
} from '@fortawesome/free-solid-svg-icons';

interface InfrastructureStatsProps {
  onlineServers: number;
  totalServers: number;
  activeLicenses: number;
  totalLicenses: number;
  criticalAlerts: number;
  resourcesInUse: number;
  totalResources: number;
}

export const InfrastructureStats = ({
  onlineServers,
  totalServers,
  activeLicenses,
  totalLicenses,
  criticalAlerts,
  resourcesInUse,
  totalResources,
}: InfrastructureStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Servidores Online */}
      <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 mb-1">Servidores Online</p>
            <p className="text-3xl font-heading font-bold text-success">{onlineServers}/{totalServers}</p>
          </div>
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faServer} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Licencias Activas */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 mb-1">Licencias Activas</p>
            <p className="text-3xl font-heading font-bold text-primary-400">{activeLicenses}/{totalLicenses}</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faKey} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Alertas Críticas */}
      <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700 mb-1">Alertas Críticas</p>
            <p className="text-3xl font-heading font-bold text-danger">{criticalAlerts}</p>
          </div>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Recursos en Uso */}
      <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 mb-1">Recursos en Uso</p>
            <p className="text-3xl font-heading font-bold text-purple-400">{resourcesInUse}/{totalResources}</p>
          </div>
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faLaptop} className="text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
