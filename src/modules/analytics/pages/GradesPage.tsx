// src/modules/analytics/pages/GradesPage.tsx

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faChartBar,
  faTrophy,
  faUsers,
  faPercentage,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import type { GradeFilters } from '../types/grades';
import { GradeFilterSection } from '../components/GradeFilterSection';
import { GradeRecordCard } from '../components/GradeRecordCard';
import { GroupStatisticsCard } from '../components/GroupStatisticsCard';
import { TopPerformerCard } from '../components/TopPerformerCard';
import { useGrades } from '../hooks/useGrades';

export const GradesPage = () => {
  const [filters, setFilters] = useState<GradeFilters>({});

  const {
    statistics,
    gradeReport,
    topPerformers,
    filterOptions,
    loading,
    error,
    refreshData,
    fetchGradeReport
  } = useGrades(filters);

  const handleFilterChange = (newFilters: GradeFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    refreshData({});
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchGradeReport(newFilters);
  };

  if (loading && !statistics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de calificaciones...</div>
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
            <FontAwesomeIcon icon={faGraduationCap} className="text-primary-400" />
            Análisis de Calificaciones
          </h2>
          <p className="text-gray-400 mt-1">
            Reporte detallado del rendimiento académico de los estudiantes
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      {statistics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faClipboardCheck} className="text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.total_grades_recorded}
                  </p>
                  <p className="text-sm text-gray-300">Calificaciones Registradas</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faChartBar} className="text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.average_grade}
                  </p>
                  <p className="text-sm text-gray-300">Promedio General</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faPercentage} className="text-purple-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.passing_rate}%
                  </p>
                  <p className="text-sm text-gray-300">Tasa de Aprobación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <div className="card p-6 border border-gray-700/30">
              <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                Estudiantes Destacados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topPerformers.map((performer, index) => (
                  <TopPerformerCard
                    key={performer.user_id}
                    performer={performer}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas por grupo */}
          {statistics.by_group.length > 0 && (
            <div className="card p-6 border border-gray-700/30">
              <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
                Rendimiento por Grupo
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {statistics.by_group.map((group) => (
                  <GroupStatisticsCard key={group.group_id} group={group} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Filtros */}
      {filterOptions && (
        <GradeFilterSection
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Listado de calificaciones */}
      {gradeReport && gradeReport.data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="text-primary-400" />
              Registro de Calificaciones
            </h3>
            <span className="text-sm text-gray-400">
              Mostrando {gradeReport.from} - {gradeReport.to} de {gradeReport.total} registros
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gradeReport.data.map((record, index) => (
              <GradeRecordCard
                key={record.id}
                record={record}
                index={index}
              />
            ))}
          </div>

          {/* Paginación */}
          {gradeReport.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(gradeReport.current_page - 1)}
                disabled={gradeReport.current_page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Anterior
              </button>

              <span className="px-4 py-2 text-gray-300">
                Página {gradeReport.current_page} de {gradeReport.last_page}
              </span>

              <button
                onClick={() => handlePageChange(gradeReport.current_page + 1)}
                disabled={gradeReport.current_page === gradeReport.last_page}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sin calificaciones */}
      {gradeReport && gradeReport.data.length === 0 && (
        <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
          <FontAwesomeIcon icon={faClipboardCheck} className="text-gray-400 text-5xl mb-4" />
          <p className="text-xl text-gray-300">
            No se encontraron calificaciones con los filtros aplicados
          </p>
        </div>
      )}
    </div>
  );
};