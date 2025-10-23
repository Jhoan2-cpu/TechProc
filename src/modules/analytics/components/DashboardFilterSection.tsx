import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { DashboardFilters } from '../types/dashboard';

interface DashboardFilterSectionProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  onClearFilters: () => void;
}

export const DashboardFilterSection = ({
  filters,
  onFilterChange,
  onClearFilters
}: DashboardFilterSectionProps) => {
  return (
    <div className="card p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          Filtros del Dashboard
        </h3>

        <button
          onClick={onClearFilters}
          className="btn bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2 text-sm"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFilterChange({ ...filters, start_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Fecha de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFilterChange({ ...filters, end_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* ID de Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ID de Empresa
          </label>
          <input
            type="number"
            value={filters.company_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              company_id: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="Filtrar por empresa"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Período académico */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ID de Período Académico
        </label>
        <input
          type="number"
          value={filters.academic_period_id || ''}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            academic_period_id: e.target.value ? parseInt(e.target.value) : undefined 
          })}
          placeholder="Filtrar por período académico"
          className="w-full md:w-1/3 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};