import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Storage } from '../types';

interface StorageCardProps {
  storage: Storage;
  formatDate: (dateString: string | null) => string;
  index: number;
}

export const StorageCard = ({ storage, formatDate, index }: StorageCardProps) => {
  const getStorageStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const usagePercent = (storage.used_gb / storage.capacity_gb) * 100;

  return (
    <div className={`card p-6 animate-fade-in ${storage.status === 'critical' ? 'border-2 border-red-300' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-secondary-900">{storage.storage_name}</h3>
          <p className="text-sm text-secondary-600 capitalize">{storage.storage_type.replace('_', ' ')}</p>
        </div>
        <FontAwesomeIcon
          icon={storage.status === 'healthy' ? faCheckCircle : storage.status === 'warning' ? faExclamationTriangle : faTimesCircle}
          className={`text-2xl ${getStorageStatusColor(storage.status)}`}
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-secondary-700">Uso de Almacenamiento</span>
          <span className="font-semibold">{storage.used_gb} GB / {storage.capacity_gb} GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${getUsageColor(usagePercent)}`}
            style={{ width: `${usagePercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-secondary-500 mt-1">
          {usagePercent.toFixed(1)}% utilizado -
          {(storage.capacity_gb - storage.used_gb).toFixed(0)} GB libres
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary-600">Ubicación:</span>
          <span className="font-medium text-secondary-900">{storage.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Punto de montaje:</span>
          <span className="font-mono text-secondary-900 text-xs">{storage.mount_point}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Backup:</span>
          <span className={storage.backup_enabled ? 'text-green-700' : 'text-red-700'}>
            {storage.backup_enabled ? 'Habilitado' : 'Deshabilitado'}
          </span>
        </div>
        {storage.last_backup && (
          <div className="flex justify-between">
            <span className="text-secondary-600">Último backup:</span>
            <span className="font-medium text-secondary-900">{formatDate(storage.last_backup)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200">
        <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faEdit} />
          Editar
        </button>
        <button className="btn bg-red-100 hover:bg-red-200 text-red-700 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faTrash} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
