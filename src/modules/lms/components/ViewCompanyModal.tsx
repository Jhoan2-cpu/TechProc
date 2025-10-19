import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBuilding,
  faIndustry,
  faUser,
  faEnvelope,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import type { Company } from '../types';

interface ViewCompanyModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewCompanyModal = ({
  company,
  isOpen,
  onClose,
}: ViewCompanyModalProps) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">
                Detalles de la Compañía
              </h2>
              <p className="text-sm text-blue-100">ID: {company.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2">
              Información General
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faBuilding} className="w-4" />
                  <span>Nombre de la Compañía</span>
                </div>
                <p className="text-white font-medium pl-6">{company.name}</p>
              </div>

              {/* Industria */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faIndustry} className="w-4" />
                  <span>Industria</span>
                </div>
                <p className="text-white font-medium pl-6">{company.industry}</p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de Contacto */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faUser} className="w-4" />
                  <span>Nombre de Contacto</span>
                </div>
                <p className="text-white font-medium pl-6">{company.contact_name}</p>
              </div>

              {/* Email de Contacto */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4" />
                  <span>Email de Contacto</span>
                </div>
                <p className="text-white font-medium pl-6">
                  <a
                    href={`mailto:${company.contact_email}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {company.contact_email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2">
              Información del Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Creación */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faCalendar} className="w-4" />
                  <span>Fecha de Creación</span>
                </div>
                <p className="text-white font-medium pl-6">
                  {new Date(company.created_at).toLocaleString('es-ES', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              {/* Última Actualización */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faCalendar} className="w-4" />
                  <span>Última Actualización</span>
                </div>
                <p className="text-white font-medium pl-6">
                  {new Date(company.updated_at).toLocaleString('es-ES', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200 flex justify-end">
          <button
            onClick={onClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
