import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { FinancialFilters, RevenueSource } from '../types/financial';

interface FinancialFilterSectionProps {
  filters: FinancialFilters;
  revenueSources: RevenueSource[];
  onFilterChange: (filters: FinancialFilters) => void;
  onClearFilters: () => void;
}

export const FinancialFilterSection = ({
  filters,
  revenueSources,
  onFilterChange,
  onClearFilters
}: FinancialFilterSectionProps) => {
  // Filtrar fuentes de ingresos válidas
  const validRevenueSources = revenueSources.filter(source => 
    source && source.id && source.name
  );

  return (
    <div className="card p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          Filtros de Análisis
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

        {/* Fuente de ingresos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fuente de Ingresos
          </label>
          <select
            value={filters.revenue_source_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              revenue_source_id: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas las fuentes</option>
            {validRevenueSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};