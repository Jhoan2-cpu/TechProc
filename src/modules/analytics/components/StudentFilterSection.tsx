import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { StudentFilters } from '../types/student';

interface StudentFilterSectionProps {
  searchTerm: string;
  filters: StudentFilters;
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: StudentFilters) => void;
  onClearFilters: () => void;
}

export const StudentFilterSection = ({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters
}: StudentFilterSectionProps) => {
  return (
    <div className="card p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          Filtros de Búsqueda
        </h3>
        
        <button
          onClick={onClearFilters}
          className="btn bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2 text-sm"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Limpiar Filtros
        </button>
      </div>

      {/* Búsqueda principal */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Buscar estudiante
        </label>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, email o documento..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros avanzados */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>
    </div>
  );
};