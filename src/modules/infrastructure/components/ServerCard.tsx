import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faEdit,
  faTrash,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import type { Server } from '../types';

interface ServerCardProps {
  server: Server;
  formatDate: (dateString: string | null) => string;
  index: number;
  onDetails: (server: Server) => void;
  onEdit: (server: Server) => void;
  onDelete: (server: Server) => void;
}

export const ServerCard = ({ server, formatDate, index, onDetails, onEdit, onDelete }: ServerCardProps) => {
  const getServerStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success/20 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-warning/20 text-yellow-700';
      case 'error': return 'bg-danger/20 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">{server.server_name}</h3>
              <p className="text-gray-400">{server.operating_system}</p>
              <p className="text-sm text-gray-300 mt-1">
                <FontAwesomeIcon icon={faServer} className="mr-1" />
                IP: <span className="font-mono">{server.ip_address}</span>
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getServerStatusColor(server.status)}`}>
              {server.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-secondary-600/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">CPU</p>
              <p className="text-lg font-bold text-white">{server.cpu_cores} Cores</p>
            </div>
            <div className="bg-secondary-600/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">RAM</p>
              <p className="text-lg font-bold text-white">{server.ram_gb} GB</p>
            </div>
            <div className="bg-secondary-600/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Disco</p>
              <p className="text-lg font-bold text-white">{server.disk_gb} GB</p>
            </div>
            <div className="bg-secondary-600/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Uptime</p>
              <p className="text-lg font-bold text-white">{Math.floor(server.uptime_hours / 24)}d</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">Uso CPU</span>
                <span className="font-semibold text-white">{server.cpu_usage_percent}%</span>
              </div>
              <div className="w-full bg-secondary-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${getUsageColor(server.cpu_usage_percent)}`}
                  style={{ width: `${server.cpu_usage_percent}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">Uso RAM</span>
                <span className="font-semibold text-white">{server.ram_usage_percent}%</span>
              </div>
              <div className="w-full bg-secondary-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${getUsageColor(server.ram_usage_percent)}`}
                  style={{ width: `${server.ram_usage_percent}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300 font-medium">Uso Disco</span>
                <span className="font-semibold text-white">{server.disk_usage_percent}%</span>
              </div>
              <div className="w-full bg-secondary-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${getUsageColor(server.disk_usage_percent)}`}
                  style={{ width: `${server.disk_usage_percent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-secondary-200">
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Ubicación:</span> {server.location}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Instalación:</span> {formatDate(server.installation_date)}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Último Mantenimiento:</span> {formatDate(server.last_maintenance)}
            </p>
            {server.services_running.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 font-semibold mb-1">Servicios:</p>
                <div className="flex flex-wrap gap-2">
                  {server.services_running.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary-900/20 text-blue-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 lg:w-32">
          <button
            onClick={() => onDetails(server)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faChartLine} />
            Detalles
          </button>
          <button
            onClick={() => onEdit(server)}
            className="btn bg-primary-800 hover:bg-secondary-300 text-white flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} />
            Editar
          </button>
          <button
            onClick={() => onDelete(server)}
            className="btn bg-danger/20 hover:bg-danger/30 text-red-400 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
