import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { CourseFilters } from '../types/course';

interface CourseFilterSectionProps {
  searchTerm: string;
  filters: CourseFilters;
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: CourseFilters) => void;
  onClearFilters: () => void;
}

export const CourseFilterSection = ({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters
}: CourseFilterSectionProps) => {
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
        <div className="flex items-center gap-4">
          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar curso por título, nombre o descripción..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Select de nivel */}
          <select
            value={filters.level || ''}
            onChange={(e) => onFilterChange({ ...filters, level: e.target.value || undefined })}
            className="w-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los niveles</option>
            <option value="basic">Básico</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>
    </div>
  );
};