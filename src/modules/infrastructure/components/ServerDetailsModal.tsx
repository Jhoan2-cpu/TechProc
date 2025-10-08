import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faServer, faChartLine, faClock } from '@fortawesome/free-solid-svg-icons';
import type { Server } from '../types';

interface ServerDetailsModalProps {
  isOpen: boolean;
  server: Server | null;
  onClose: () => void;
  formatDate: (dateString: string | null) => string;
}

export const ServerDetailsModal = ({ isOpen, server, onClose, formatDate }: ServerDetailsModalProps) => {
  if (!isOpen || !server) return null;

  const getServerStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faServer} className="text-primary-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-secondary-900">
                {server.server_name}
              </h3>
              <p className="text-sm text-secondary-600">{server.operating_system}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado y Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-sm text-secondary-600 mb-2">Estado</p>
              <span className={`px-4 py-2 rounded-full text-sm font-bold inline-block ${getServerStatusColor(server.status)}`}>
                {server.status.toUpperCase()}
              </span>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-600 mb-2">Dirección IP</p>
              <p className="font-mono font-bold text-secondary-900">{server.ip_address}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-600 mb-2">Ubicación</p>
              <p className="font-bold text-secondary-900">{server.location}</p>
            </div>
          </div>

          {/* Especificaciones Hardware */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-primary-600" />
              Especificaciones de Hardware
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-xs text-secondary-600 mb-1">CPU Cores</p>
                <p className="text-2xl font-bold text-secondary-900">{server.cpu_cores}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-xs text-secondary-600 mb-1">RAM</p>
                <p className="text-2xl font-bold text-secondary-900">{server.ram_gb} GB</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-xs text-secondary-600 mb-1">Disco</p>
                <p className="text-2xl font-bold text-secondary-900">{server.disk_gb} GB</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-xs text-secondary-600 mb-1">Uptime</p>
                <p className="text-2xl font-bold text-secondary-900">{Math.floor(server.uptime_hours / 24)}d</p>
              </div>
            </div>
          </div>

          {/* Uso de Recursos */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
              Uso de Recursos
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-700 font-semibold">Uso de CPU</span>
                  <span className="font-bold text-secondary-900">{server.cpu_usage_percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={`h-4 rounded-full ${getUsageColor(server.cpu_usage_percent)} transition-all`} style={{ width: `${server.cpu_usage_percent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-700 font-semibold">Uso de RAM</span>
                  <span className="font-bold text-secondary-900">{server.ram_usage_percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={`h-4 rounded-full ${getUsageColor(server.ram_usage_percent)} transition-all`} style={{ width: `${server.ram_usage_percent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary-700 font-semibold">Uso de Disco</span>
                  <span className="font-bold text-secondary-900">{server.disk_usage_percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={`h-4 rounded-full ${getUsageColor(server.disk_usage_percent)} transition-all`} style={{ width: `${server.disk_usage_percent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas y Mantenimiento */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-primary-600" />
              Historial
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary-600">Fecha de Instalación</p>
                <p className="font-bold text-secondary-900">{formatDate(server.installation_date)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Último Mantenimiento</p>
                <p className="font-bold text-secondary-900">{formatDate(server.last_maintenance)}</p>
              </div>
            </div>
          </div>

          {/* Servicios en Ejecución */}
          {server.services_running.length > 0 && (
            <div className="card p-6">
              <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
                Servicios en Ejecución
              </h4>
              <div className="flex flex-wrap gap-2">
                {server.services_running.map((service, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GCP Integration Info */}
          <div className="card p-6 bg-blue-50 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-2">
              Integración con Google Cloud Platform
            </h4>
            <p className="text-sm text-secondary-600">
              Este servidor está preparado para ser monitoreado y gestionado a través de servicios de GCP como Compute Engine, Cloud Monitoring y Cloud Logging.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-secondary-50 border-t border-secondary-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
