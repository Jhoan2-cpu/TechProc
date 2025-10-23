// src/modules/analytics/components/AttendanceFilterSection.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import type { AttendanceFilters, AttendanceFilterOptions } from '../types/attendance';

interface AttendanceFilterSectionProps {
  searchTerm: string;
  filters: AttendanceFilters;
  filterOptions: AttendanceFilterOptions | null;
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: AttendanceFilters) => void;
  onClearFilters: () => void;
}

export const AttendanceFilterSection = ({
  searchTerm,
  filters,
  filterOptions,
  onSearchChange,
  onFilterChange,
  onClearFilters
}: AttendanceFilterSectionProps) => {
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
            placeholder="Buscar por nombre o email del estudiante..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Curso
          </label>
          <select
            value={filters.course_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              course_id: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los cursos</option>
            {filterOptions?.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estudiante */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estudiante
          </label>
          <select
            value={filters.student_id || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              student_id: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estudiantes</option>
            {filterOptions?.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado de Asistencia */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado de Asistencia
          </label>
          <select
            value={filters.attendance_status || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              attendance_status: e.target.value as 'YES' | 'NO' | undefined
            })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="YES">Presente</option>
            <option value="NO">Ausente</option>
          </select>
        </div>

        {/* Filtro por Fecha de Inicio */}
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

        {/* Filtro por Fecha de Fin */}
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