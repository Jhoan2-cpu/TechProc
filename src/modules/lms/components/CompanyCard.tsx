import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faBuilding,
  faIndustry,
  faUser,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  index: number;
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export const CompanyCard = ({
  company,
  index,
  onView,
  onEdit,
  onDelete,
}: CompanyCardProps) => {
  return (
    <div
      className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faBuilding} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-white">
              {company.name}
            </h3>
            <p className="text-xs text-gray-400">ID: {company.id}</p>
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faIndustry} className="text-gray-400 text-sm w-4" />
          <span className="text-sm text-gray-300">{company.industry}</span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm w-4" />
          <span className="text-sm text-gray-300">{company.contact_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm w-4" />
          <span className="text-sm text-gray-300">{company.contact_email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
        <span className="text-xs text-gray-400">
          Creado: {new Date(company.created_at).toLocaleDateString('es-ES')}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onView(company)}
            className="text-blue-600 hover:bg-primary-900/20 p-2 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onEdit(company)}
            className="text-orange-600 hover:bg-orange-900/20 p-2 rounded-lg transition-colors"
            title="Editar"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(company)}
            className="text-red-600 hover:bg-danger/20 p-2 rounded-lg transition-colors"
            title="Eliminar"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
