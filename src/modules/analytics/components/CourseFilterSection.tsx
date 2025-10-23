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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Buscar curso
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
            placeholder="Buscar por título, nombre o descripción..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nivel
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => onFilterChange({ ...filters, level: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los niveles</option>
            <option value="basic">Básico</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={filters.status === undefined ? '' : filters.status.toString()}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              status: e.target.value === '' ? undefined : e.target.value === 'true' 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        {/* Bestseller */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bestseller
          </label>
          <select
            value={filters.bestseller === undefined ? '' : filters.bestseller.toString()}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              bestseller: e.target.value === '' ? undefined : e.target.value === 'true' 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Destacado */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Destacado
          </label>
          <select
            value={filters.featured === undefined ? '' : filters.featured.toString()}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              featured: e.target.value === '' ? undefined : e.target.value === 'true' 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFilterChange({ ...filters, start_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de fin
          </label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFilterChange({ ...filters, end_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};