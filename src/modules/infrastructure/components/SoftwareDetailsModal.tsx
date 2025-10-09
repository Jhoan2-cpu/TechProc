import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCog,
  faCalendar,
  faServer,
  faKey,
  faSyncAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';

interface SoftwareDetailsModalProps {
  isOpen: boolean;
  software: Software | null;
  onClose: () => void;
  formatDate: (dateString: string | null) => string;
}

export const SoftwareDetailsModal = ({ isOpen, software, onClose, formatDate }: SoftwareDetailsModalProps) => {
  if (!isOpen || !software) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCog} className="text-primary-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">
                {software.software_name}
              </h3>
              <p className="text-sm text-gray-400">Versión {software.version}</p>
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
          {/* Información General */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Información General
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Categoría</p>
                <span className="inline-block px-3 py-2 rounded-full text-sm font-bold bg-primary-900/20 text-blue-700">
                  {software.category}
                </span>
              </div>
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Proveedor</p>
                <p className="text-lg font-bold text-white">{software.vendor}</p>
              </div>
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Versión Actual</p>
                <p className="text-lg font-bold text-white">{software.version}</p>
              </div>
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Actualizaciones Automáticas</p>
                <span className={`inline-block px-3 py-2 rounded-full text-sm font-bold ${
                  software.auto_update
                    ? 'bg-success/20 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {software.auto_update ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
              Fechas Importantes
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha de Instalación</span>
                <span className="font-bold text-white">{formatDate(software.installation_date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Última Actualización</span>
                <span className="font-bold text-white">{formatDate(software.last_update)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  Soporte Vigente Hasta
                </span>
                <span className="font-bold text-white">{formatDate(software.support_until)}</span>
              </div>
            </div>
          </div>

          {/* Licencia Asociada */}
          {software.license_id && (
            <div className="card p-6 bg-purple-900/20 border-purple-200">
              <h4 className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="text-purple-600" />
                Licencia Asociada
              </h4>
              <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 border-2 border-purple-200">
                <p className="text-gray-300">
                  ID de Licencia: <span className="font-bold text-white">#{software.license_id}</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Este software está vinculado a una licencia activa en el sistema
                </p>
              </div>
            </div>
          )}

          {/* Servidores */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faServer} className="text-primary-600" />
              Servidores con esta Instalación
            </h4>
            {software.server_ids.length > 0 ? (
              <div>
                <p className="text-gray-400 mb-3">
                  Este software está instalado en <span className="font-bold text-white">{software.server_ids.length}</span> servidor(es)
                </p>
                <div className="flex flex-wrap gap-2">
                  {software.server_ids.map((serverId) => (
                    <div
                      key={serverId}
                      className="px-4 py-2 bg-primary-900/20 text-primary-700 font-medium rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faServer} />
                      Servidor #{serverId}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Advertencia:</span> Este software no está asociado a ningún servidor.
                </p>
              </div>
            )}
          </div>

          {/* Actualizaciones */}
          {software.auto_update && (
            <div className="card p-6 bg-success/20 border-green-200">
              <h4 className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faSyncAlt} className="text-green-600" />
                Actualizaciones Automáticas
              </h4>
              <p className="text-gray-300 mb-2">
                Este software tiene habilitadas las actualizaciones automáticas.
              </p>
              <p className="text-sm text-gray-400">
                El sistema verificará y aplicará actualizaciones de forma automática cuando estén disponibles.
              </p>
            </div>
          )}

          {/* Información GCP */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-2">
              Integración con Google Cloud Platform
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Este software puede ser gestionado a través de servicios de GCP:
            </p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>VM Manager para gestión de software en instancias de Compute Engine</li>
              <li>Cloud Operations para monitoreo de rendimiento</li>
              <li>OS Config para gestión de parches y actualizaciones</li>
              <li>Binary Authorization para verificación de imágenes</li>
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
