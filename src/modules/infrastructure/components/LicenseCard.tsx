import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import type { License } from '../types';

interface LicenseCardProps {
  license: License;
  formatDate: (dateString: string | null) => string;
  index: number;
  onDetails: (license: License) => void;
  onEdit: (license: License) => void;
  onDelete: (license: License) => void;
}

export const LicenseCard = ({ license, formatDate, index, onDetails, onEdit, onDelete }: LicenseCardProps) => {
  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'expiring_soon': return 'bg-orange-100 text-orange-700';
      case 'suspended': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'expiring_soon': return 'Por Vencer';
      case 'expired': return 'Vencida';
      case 'active': return 'Activa';
      case 'suspended': return 'Suspendida';
      default: return status;
    }
  };

  return (
    <div className={`card p-6 animate-fade-in ${license.status === 'expired' || license.status === 'expiring_soon' ? 'border-2 border-orange-300' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-heading font-bold text-secondary-900">{license.software_name}</h3>
              <p className="text-sm text-secondary-600">{license.provider}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getLicenseStatusColor(license.status)}`}>
              {getStatusText(license.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-secondary-600">Tipo</p>
              <p className="font-semibold text-secondary-900 capitalize">{license.license_type}</p>
            </div>
            <div>
              <p className="text-xs text-secondary-600">Licencias Usadas</p>
              <p className="font-semibold text-secondary-900">{license.seats_used}/{license.seats_total}</p>
            </div>
            <div>
              <p className="text-xs text-secondary-600">Costo Anual</p>
              <p className="font-semibold text-secondary-900">S/ {license.cost_annual.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-secondary-600">Vencimiento</p>
              <p className="font-semibold text-secondary-900">{formatDate(license.expiration_date)}</p>
            </div>
          </div>

          <div className="bg-secondary-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-secondary-600 mb-1">Clave de Licencia</p>
            <p className="font-mono text-sm text-secondary-900">{license.license_key}</p>
          </div>

          {license.notes && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
              <p className="text-sm text-secondary-700">{license.notes}</p>
            </div>
          )}

          <div className="mt-3 text-sm text-secondary-600">
            <p>
              <span className="font-semibold">Compra:</span> {formatDate(license.purchase_date)}
            </p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 lg:w-40">
          <button
            onClick={() => onDetails(license)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Detalles
          </button>
          <button
            onClick={() => onEdit(license)}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} />
            Editar
          </button>
          <button
            onClick={() => onDelete(license)}
            className="btn bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
