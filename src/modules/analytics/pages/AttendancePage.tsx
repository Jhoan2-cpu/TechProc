// src/modules/analytics/pages/AttendancePage.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileCsv, 
  faChartBar, 
  faUserCheck, 
  faChartLine,
  faPercentage,
  faUsers,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import type { AttendanceFilters } from '../types/attendance';
import { AttendanceFilterSection } from '../components/AttendanceFilterSection';
import { AttendanceCard } from '../components/AttendanceCard';
import { useAttendances } from '../hooks/useAttendances';

export const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AttendanceFilters>({});

  const {
    attendances,
    statistics,
    trend,
    filterOptions,
    loading,
    error,
    pagination,
    refreshData
  } = useAttendances(filters);

  // Aplicar filtro de búsqueda local
  const filteredAttendances = attendances.filter(attendance => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attendance.student.first_name.toLowerCase().includes(searchLower) ||
      attendance.student.last_name.toLowerCase().includes(searchLower) ||
      attendance.student.email.toLowerCase().includes(searchLower) ||
      attendance.class.group.course.title.toLowerCase().includes(searchLower)
    );
  });

  const handleFilterChange = (newFilters: AttendanceFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
    refreshData({});
  };

  if (loading && attendances.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de asistencia...</div>
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
            <FontAwesomeIcon icon={faUserCheck} className="text-primary-400" />
            Análisis de Asistencia
          </h2>
          <p className="text-gray-400 mt-1">
            Reporte detallado de asistencia y participación de estudiantes
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_classes}</p>
                <p className="text-sm text-gray-300">Total de Clases</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-blue-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_attendances_recorded}</p>
                <p className="text-sm text-gray-300">Registros de Asistencia</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FontAwesomeIcon icon={faUserCheck} className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.present_attendances}</p>
                <p className="text-sm text-gray-300">Asistencias Presentes</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FontAwesomeIcon icon={faPercentage} className="text-purple-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.average_attendance_rate.toFixed(1)}%</p>
                <p className="text-sm text-gray-300">Tasa de Asistencia</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tendencia de Asistencia */}
      {trend.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
            Tendencia de Asistencia
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {trend.map((item) => (
                <div 
                  key={item.date}
                  className="flex-shrink-0 w-24 text-center"
                >
                  <div className="mb-2">
                    <div 
                      className="w-full bg-gray-700 rounded-t"
                      style={{ 
                        height: '120px',
                        display: 'flex',
                        alignItems: 'flex-end'
                      }}
                    >
                      <div 
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t transition-all"
                        style={{ 
                          height: `${item.attendance_rate}%`,
                          minHeight: '8px'
                        }}
                      />
                    </div>
                    <div className="text-xs text-primary-400 font-bold mt-1">
                      {item.attendance_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.date).toLocaleDateString('es-PE', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.present_count}/{item.attendance_count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas por grupo */}
      {statistics && statistics.by_group.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
            Asistencia por Grupo
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Grupo</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Curso</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Clases</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Registros</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Presentes</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Tasa</th>
                </tr>
              </thead>
              <tbody>
                {statistics.by_group.slice(0, 8).map((group) => {
                  const rate = parseFloat(group.attendance_rate);
                  return (
                    <tr key={group.group_id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3 px-4 text-white">{group.group_name}</td>
                      <td className="py-3 px-4 text-gray-300">{group.course_name}</td>
                      <td className="py-3 px-4 text-center text-white">{group.total_classes}</td>
                      <td className="py-3 px-4 text-center text-white">{group.total_attendances}</td>
                      <td className="py-3 px-4 text-center text-green-400">{group.present_count}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${
                          rate >= 80 ? 'text-green-400' :
                          rate >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtros */}
      <AttendanceFilterSection
        searchTerm={searchTerm}
        filters={filters}
        filterOptions={filterOptions}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>
          Mostrando {filteredAttendances.length} de {pagination.total_records} registros
        </span>
        <span>
          Página {pagination.current_page} de {pagination.total_pages}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAttendances.length > 0 ? (
          filteredAttendances.map((attendance, index) => (
            <AttendanceCard
              key={attendance.id}
              attendance={attendance}
              index={index}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">
              No se encontraron registros de asistencia para los filtros aplicados
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