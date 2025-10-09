import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faHdd,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faMapMarkerAlt,
  faServer,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import type { Storage } from '../types';

interface StorageDetailsModalProps {
  isOpen: boolean;
  storage: Storage | null;
  onClose: () => void;
  formatDate: (dateString: string | null) => string;
}

export const StorageDetailsModal = ({ isOpen, storage, onClose, formatDate }: StorageDetailsModalProps) => {
  if (!isOpen || !storage) return null;

  const getStorageStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-success/20';
      case 'warning': return 'text-yellow-600 bg-warning/20';
      case 'critical': return 'text-red-600 bg-danger/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStorageStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'critical': return faTimesCircle;
      default: return faCheckCircle;
    }
  };

  const getStorageStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Saludable';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return status;
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-danger/20';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-warning/20';
    return 'bg-success/20';
  };

  const getStorageTypeText = (type: string) => {
    switch (type) {
      case 'local': return 'Local';
      case 'cloud': return 'Cloud';
      case 'nas': return 'NAS';
      case 'san': return 'SAN';
      default: return type;
    }
  };

  const usagePercent = (storage.used_gb / storage.capacity_gb) * 100;
  const freeSpace = storage.capacity_gb - storage.used_gb;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faHdd} className="text-primary-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">
                {storage.storage_name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {getStorageTypeText(storage.storage_type)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado */}
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-400 mb-3">Estado del Almacenamiento</p>
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${getStorageStatusColor(storage.status)}`}>
              <FontAwesomeIcon icon={getStorageStatusIcon(storage.status)} className="text-2xl" />
              <span className="text-xl font-bold">{getStorageStatusText(storage.status)}</span>
            </div>
          </div>

          {/* Uso de Almacenamiento */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Uso de Almacenamiento
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Capacidad Total</p>
                  <p className="text-2xl font-bold text-white">{storage.capacity_gb} GB</p>
                </div>
                <div className="bg-primary-900/20 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Espacio Usado</p>
                  <p className="text-2xl font-bold text-primary-400">{storage.used_gb} GB</p>
                </div>
                <div className="bg-success/20 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Espacio Libre</p>
                  <p className="text-2xl font-bold text-success">{freeSpace.toFixed(0)} GB</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-semibold">Porcentaje de Uso</span>
                  <span className="text-2xl font-bold text-white">{usagePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full transition-all ${getUsageColor(usagePercent)} flex items-center justify-center`}
                    style={{ width: `${usagePercent}%` }}
                  >
                    {usagePercent > 10 && (
                      <span className="text-white text-xs font-bold">{usagePercent.toFixed(0)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Ubicación */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-600" />
              Ubicación y Configuración
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ubicación Física</span>
                <span className="font-bold text-white">{storage.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Punto de Montaje</span>
                <span className="font-mono text-sm text-white bg-secondary-600/50 px-3 py-1 rounded">
                  {storage.mount_point}
                </span>
              </div>
              {storage.server_id && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FontAwesomeIcon icon={faServer} />
                    Servidor Asociado
                  </span>
                  <span className="font-bold text-white">Server ID: {storage.server_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Información de Backup */}
          <div className={`card p-6 ${storage.backup_enabled ? 'bg-success/20 border-green-200' : 'bg-danger/20 border-red-200'}`}>
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración de Backup
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold">Estado del Backup</span>
                <span className={`px-4 py-2 rounded-full font-bold ${
                  storage.backup_enabled
                    ? 'bg-success/20 text-green-700'
                    : 'bg-danger/20 text-red-700'
                }`}>
                  {storage.backup_enabled ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
              {storage.backup_enabled && storage.last_backup && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    Último Backup
                  </span>
                  <span className="font-bold text-white">{formatDate(storage.last_backup)}</span>
                </div>
              )}
              {!storage.backup_enabled && (
                <div className="bg-danger/20 border-l-4 border-red-400 p-3">
                  <p className="text-sm text-danger">
                    <span className="font-semibold">Advertencia:</span> El backup está deshabilitado. Se recomienda habilitarlo para proteger los datos.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información GCP */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-2">
              Integración con Google Cloud Platform
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Este almacenamiento puede ser gestionado a través de servicios de GCP:
            </p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Google Cloud Storage para almacenamiento en la nube</li>
              <li>Persistent Disks para discos locales en VMs</li>
              <li>Cloud Monitoring para alertas de capacidad</li>
              <li>Cloud Backup and DR para copias de seguridad</li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-secondary-600/50 border-t border-secondary-200 p-6 flex justify-end">
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
