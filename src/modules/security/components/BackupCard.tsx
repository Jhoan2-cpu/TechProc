import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArchive,
  faCalendar,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import type { Backup } from '../types';

interface BackupCardProps {
  backup: Backup & {
    backup_name?: string;
    backup_type?: string;
    start_date?: string;
    end_date?: string;
    file_size_mb?: number;
    notes?: string;
  };
  formatDate: (dateString: string) => string;
}

export const BackupCard = ({ backup, formatDate }: BackupCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900';
      case 'failed':
        return 'bg-red-100 text-red-900';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      completed: 'Completado',
      failed: 'Fallido',
      in_progress: 'En Progreso',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return faCheckCircle;
      case 'failed':
        return faTimesCircle;
      case 'in_progress':
        return faClock;
      default:
        return faClock;
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const displayName = backup.backup_name || `Backup ${backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}`;
  const displayType = backup.backup_type || backup.type;
  const displayDate = backup.start_date || backup.backup_date;
  const displaySize = backup.file_size_mb !== undefined ? backup.file_size_mb : backup.size_mb;

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              backup.status === 'completed'
                ? 'bg-green-100'
                : backup.status === 'failed'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}
          >
            <FontAwesomeIcon
              icon={faFileArchive}
              className={`text-xl ${
                backup.status === 'completed'
                  ? 'text-green-600'
                  : backup.status === 'failed'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary-900">
              {displayName}
            </h3>
            <p className="text-sm text-secondary-600 mt-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faDatabase} className="text-primary-600" />
              Tipo: <span className="font-medium">{displayType}</span>
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(backup.status)}`}>
          <FontAwesomeIcon icon={getStatusIcon(backup.status)} className="mr-1" />
          {getStatusText(backup.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-secondary-500 text-xs mb-1">Fecha de Backup</p>
          <p className="text-secondary-900 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
            {formatDate(displayDate)}
          </p>
        </div>
        {backup.end_date && (
          <div>
            <p className="text-secondary-500 text-xs mb-1">Fecha de Fin</p>
            <p className="text-secondary-900 font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              {formatDate(backup.end_date)}
            </p>
          </div>
        )}
        <div>
          <p className="text-secondary-500 text-xs mb-1">Tamaño del Archivo</p>
          <p className="text-secondary-900 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faFileArchive} className="text-primary-600" />
            {formatFileSize(displaySize)}
          </p>
        </div>
      </div>

      {backup.notes && (
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <p className="text-sm text-secondary-600">
            <span className="font-semibold">Notas:</span> {backup.notes}
          </p>
        </div>
      )}
    </div>
  );
};
