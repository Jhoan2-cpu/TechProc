import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKey, faCalendar, faUsers, faDollarSign, faFileContract } from '@fortawesome/free-solid-svg-icons';
import type { License } from '../types';

interface LicenseDetailsModalProps {
  isOpen: boolean;
  license: License | null;
  onClose: () => void;
  formatDate: (dateString: string | null) => string;
}

export const LicenseDetailsModal = ({ isOpen, license, onClose, formatDate }: LicenseDetailsModalProps) => {
  if (!isOpen || !license) return null;

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-green-700';
      case 'expired': return 'bg-danger/20 text-red-700';
      case 'expiring_soon': return 'bg-orange-900/20 text-orange-700';
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

  const getLicenseTypeText = (type: string) => {
    switch (type) {
      case 'perpetua': return 'Perpetua';
      case 'suscripcion': return 'Suscripción';
      case 'trial': return 'Prueba';
      default: return type;
    }
  };

  const seatsPercentage = (license.seats_used / license.seats_total) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-primary-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">
                {license.software_name}
              </h3>
              <p className="text-sm text-gray-400">{license.provider}</p>
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
          <div className="card p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">Estado de la Licencia</p>
            <span className={`px-6 py-3 rounded-full text-lg font-bold inline-block ${getLicenseStatusColor(license.status)}`}>
              {getStatusText(license.status)}
            </span>
          </div>

          {/* Información Principal */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileContract} className="text-primary-600" />
              Información de la Licencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Tipo de Licencia</p>
                <p className="text-lg font-bold text-white">{getLicenseTypeText(license.license_type)}</p>
              </div>
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Proveedor</p>
                <p className="text-lg font-bold text-white">{license.provider}</p>
              </div>
            </div>
          </div>

          {/* Clave de Licencia */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} className="text-blue-600" />
              Clave de Licencia
            </h4>
            <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 border-2 border-blue-200">
              <p className="font-mono text-lg text-center text-white select-all">
                {license.license_key}
              </p>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Haz clic para copiar la clave
            </p>
          </div>

          {/* Uso de Licencias */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-primary-600" />
              Uso de Licencias
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Licencias en Uso</span>
                <span className="text-2xl font-bold text-white">
                  {license.seats_used} / {license.seats_total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full transition-all ${
                    seatsPercentage >= 90 ? 'bg-danger/20' :
                    seatsPercentage >= 75 ? 'bg-orange-500' :
                    'bg-success/20'
                  }`}
                  style={{ width: `${seatsPercentage}%` }}
                >
                  <span className="flex items-center justify-center h-full text-white text-xs font-bold">
                    {Math.round(seatsPercentage)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {license.seats_total - license.seats_used} licencias disponibles
              </p>
            </div>
          </div>

          {/* Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
              Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Fecha de Compra</p>
                <p className="font-bold text-white">{formatDate(license.purchase_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Fecha de Vencimiento</p>
                <p className="font-bold text-white">{formatDate(license.expiration_date)}</p>
              </div>
            </div>
          </div>

          {/* Costo */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faDollarSign} className="text-primary-600" />
              Información Financiera
            </h4>
            <div className="bg-secondary-600/50 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Costo Anual</p>
              <p className="text-3xl font-bold text-white">
                S/ {license.cost_annual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Notas */}
          {license.notes && (
            <div className="card p-6 bg-amber-50 border-amber-200">
              <h4 className="text-lg font-heading font-bold text-white mb-3">
                Notas Adicionales
              </h4>
              <p className="text-gray-300">{license.notes}</p>
            </div>
          )}

          {/* Información GCP */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-2">
              Integración con Google Cloud Platform
            </h4>
            <p className="text-sm text-gray-400">
              Esta licencia puede ser monitoreada y gestionada a través de GCP para control de costos y auditoría.
            </p>
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
