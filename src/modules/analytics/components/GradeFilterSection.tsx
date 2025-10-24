// src/modules/analytics/components/GradeFilterSection.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { GradeFilters, FilterOptions } from '../types/grades';

interface GradeFilterSectionProps {
  filters: GradeFilters;
  filterOptions: FilterOptions;
  onFilterChange: (filters: GradeFilters) => void;
  onClearFilters: () => void;
}

export const GradeFilterSection = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters
}: GradeFilterSectionProps) => {
  const evaluationTypes = [
    'Quiz',
    'Exam',
    'Assignment',
    'Project',
    'Final'
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Curso
          </label>
          <select
            value={filters.course_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              course_id: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los cursos</option>
            {filterOptions.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Período Académico */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Período Académico
          </label>
          <select
            value={filters.academic_period_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              academic_period_id: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los períodos</option>
            {filterOptions.academicPeriods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>

        {/* Límite por página */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Registros por página
          </label>
          <select
            value={filters.limit || 15}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              limit: parseInt(e.target.value),
              page: 1 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              start_date: e.target.value || undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              end_date: e.target.value || undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};