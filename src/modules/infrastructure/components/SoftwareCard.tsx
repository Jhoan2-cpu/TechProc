import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';

interface SoftwareCardProps {
  software: Software;
  formatDate: (dateString: string | null) => string;
  index: number;
  onDetails: (software: Software) => void;
  onEdit: (software: Software) => void;
  onDelete: (software: Software) => void;
}

export const SoftwareCard = ({ software, formatDate, index, onDetails, onEdit, onDelete }: SoftwareCardProps) => {
  return (
    <div className="card p-6 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-heading font-bold text-white">{software.software_name}</h3>
              <p className="text-gray-400">Versión {software.version}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-900/20 text-blue-700">
                {software.category}
              </span>
              {software.auto_update && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-green-700">
                  Auto-Update
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-400">Proveedor</p>
              <p className="font-semibold text-white">{software.vendor}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Instalación</p>
              <p className="font-semibold text-white">{formatDate(software.installation_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Última Actualización</p>
              <p className="font-semibold text-white">{formatDate(software.last_update)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Soporte hasta</p>
              <p className="font-semibold text-white">{formatDate(software.support_until)}</p>
            </div>
          </div>

          {software.server_ids.length > 0 && (
            <div className="bg-secondary-600/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Instalado en {software.server_ids.length} servidor(es)</p>
              <div className="flex flex-wrap gap-2">
                {software.server_ids.map((serverId) => (
                  <span key={serverId} className="px-2 py-1 bg-primary-900/20 text-primary-700 text-xs rounded">
                    Servidor #{serverId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex lg:flex-col gap-2 lg:w-32">
          <button
            onClick={() => onDetails(software)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
          >
            Detalles
          </button>
          <button
            onClick={() => onEdit(software)}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} />
            Editar
          </button>
          <button
            onClick={() => onDelete(software)}
            className="btn bg-danger/20 hover:bg-red-200 text-red-700 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
