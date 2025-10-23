import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { AttendanceFilters, FilterOptions } from '../types';

interface AttendanceFiltersProps {
  filters: AttendanceFilters;
  filterOptions: FilterOptions | null;
  onFilterChange: (filters: AttendanceFilters) => void;
  onClear: () => void;
}

export const AttendanceFiltersComponent = ({
  filters,
  filterOptions,
  onFilterChange,
  onClear,
}: AttendanceFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<AttendanceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field: keyof AttendanceFilters, value: any) => {
    const newFilters = { ...localFilters, [field]: value || undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const emptyFilters: AttendanceFilters = {};
    setLocalFilters(emptyFilters);
    onClear();
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => localFilters[key as keyof AttendanceFilters] !== undefined
  );

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Grupo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grupo
          </label>
          <select
            value={localFilters.group_id || ''}
            onChange={(e) => handleChange('group_id', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los grupos</option>
            {filterOptions?.groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Curso
          </label>
          <select
            value={localFilters.course_id || ''}
            onChange={(e) => handleChange('course_id', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los cursos</option>
            {filterOptions?.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Asistencia */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Asistencia
          </label>
          <select
            value={localFilters.attended || ''}
            onChange={(e) => handleChange('attended', e.target.value || undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="YES">Asistió</option>
            <option value="NO">No asistió</option>
          </select>
        </div>

        {/* Filtro por Calidad de Conexión */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Calidad de Conexión
          </label>
          <select
            value={localFilters.connection_quality || ''}
            onChange={(e) => handleChange('connection_quality', e.target.value || undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="EXCELLENT">Excelente</option>
            <option value="GOOD">Buena</option>
            <option value="FAIR">Regular</option>
            <option value="POOR">Mala</option>
          </select>
        </div>

        {/* Filtro por Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha Desde
          </label>
          <input
            type="date"
            value={localFilters.date_from || ''}
            onChange={(e) => handleChange('date_from', e.target.value || undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filtro por Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={localFilters.date_to || ''}
            onChange={(e) => handleChange('date_to', e.target.value || undefined)}
            className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
