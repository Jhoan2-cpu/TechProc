import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faBook, 
  faTrophy,
  faUsers,
  faCheckCircle,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import type { CourseFilters } from '../types/course';
import { CourseFilterSection } from '../components/CourseFilterSection';
import { CourseCard } from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';

export const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CourseFilters>({});

  const {
    courses,
    statistics,
    loading,
    error,
    pagination,
    refreshData
  } = useCourses(filters);

  // Aplicar filtro de búsqueda local
  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.name.toLowerCase().includes(searchLower) ||
      (course.description && course.description.toLowerCase().includes(searchLower))
    );
  });

  const handleFilterChange = (newFilters: CourseFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
    refreshData({});
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de cursos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => refreshData(filters)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faBook} className="text-primary-400" />
            Análisis de Cursos
          </h2>
          <p className="text-gray-400 mt-1">
            Reporte detallado de cursos y estadísticas de matriculación
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-primary-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_courses}</p>
                <p className="text-sm text-gray-300">Total de Cursos</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.active_courses}</p>
                <p className="text-sm text-gray-300">Cursos Activos</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.inactive_courses}</p>
                <p className="text-sm text-gray-300">Cursos Inactivos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribución por nivel */}
      {statistics && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartBar} className="text-primary-400" />
            Distribución por Nivel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Básico</p>
                  <p className="text-3xl font-bold text-green-400">{statistics.by_level.basic}</p>
                </div>
                <div className="text-green-400 text-4xl opacity-20">
                  <FontAwesomeIcon icon={faBook} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Intermedio</p>
                  <p className="text-3xl font-bold text-yellow-400">{statistics.by_level.intermediate}</p>
                </div>
                <div className="text-yellow-400 text-4xl opacity-20">
                  <FontAwesomeIcon icon={faBook} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-lg border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avanzado</p>
                  <p className="text-3xl font-bold text-red-400">{statistics.by_level.advanced}</p>
                </div>
                <div className="text-red-400 text-4xl opacity-20">
                  <FontAwesomeIcon icon={faBook} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cursos más matriculados */}
      {statistics && statistics.most_enrolled.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
            Cursos Más Matriculados
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Posición</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Curso</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Matrículas</th>
                </tr>
              </thead>
              <tbody>
                {statistics.most_enrolled.map((course, index) => (
                  <tr key={course.course_id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{course.course_title}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-blue-400 font-bold">{course.enrollments}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bestsellers */}
      {statistics && statistics.bestsellers.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Cursos Bestsellers (Mayores Ingresos)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Posición</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Curso</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {statistics.bestsellers.map((course, index) => (
                  <tr key={course.course_id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{course.course_title}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-400 font-bold">
                        S/ {parseFloat(course.revenue.toString()).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtros */}
      <CourseFilterSection
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>
          Mostrando {filteredCourses.length} de {pagination.total_records} cursos
        </span>
        <span>
          Página {pagination.current_page} de {pagination.total_pages}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">
              No se encontraron cursos para los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page - 1 })}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Anterior
          </button>
          
          <span className="px-4 py-2 text-gray-300">
            Página {pagination.current_page} de {pagination.total_pages}
          </span>
          
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page + 1 })}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};