import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faExclamationTriangle,
  faChartLine,
  faUsers,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAttendanceRecords,
  getAttendanceSummary,
  getStatsByStudent,
  getStatsByGroup,
  getAttendanceTrend,
  getRiskAnalysis,
  getFilterOptions,
} from '../services';
import type {
  AttendanceRecord,
  AttendanceSummary,
  StudentAttendanceStats,
  GroupAttendanceStats,
  TrendPeriod,
  TrendAnalysis,
  RiskStudent,
  FilterOptions,
  AttendanceFilters,
} from '../types';
import {
  AttendanceFiltersComponent,
  AttendanceRecordCard,
  AttendanceSummaryCards,
  StudentStatsCard,
  GroupStatsCard,
  TrendChart,
  RiskStudentCard,
} from '../components';

type ViewMode = 'records' | 'students' | 'groups' | 'trend' | 'risk';

export const AttendanceAnalyticsPage = () => {
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('records');

  // Datos
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentStats, setStudentStats] = useState<StudentAttendanceStats[]>([]);
  const [groupStats, setGroupStats] = useState<GroupAttendanceStats[]>([]);
  const [trendData, setTrendData] = useState<TrendPeriod[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  // Filtros
  const [filters, setFilters] = useState<AttendanceFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar opciones de filtros al montar
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Cargar datos cuando cambian los filtros o la vista
  useEffect(() => {
    loadData();
  }, [filters, viewMode, currentPage]);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (err: any) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Siempre cargar el resumen
      const summaryResponse = await getAttendanceSummary(filters);
      setSummary(summaryResponse.data);

      // Cargar datos específicos según la vista
      switch (viewMode) {
        case 'records':
          await loadRecords();
          break;
        case 'students':
          await loadStudentStats();
          break;
        case 'groups':
          await loadGroupStats();
          break;
        case 'trend':
          await loadTrend();
          break;
        case 'risk':
          await loadRiskAnalysis();
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async () => {
    const response = await getAttendanceRecords({
      ...filters,
      page: currentPage,
      per_page: 20,
    });
    setRecords(response.data.data);
    setTotalPages(response.data.pagination.last_page);
  };

  const loadStudentStats = async () => {
    const response = await getStatsByStudent(filters);
    setStudentStats(response.data);
  };

  const loadGroupStats = async () => {
    const response = await getStatsByGroup(filters);
    setGroupStats(response.data);
  };

  const loadTrend = async () => {
    const response = await getAttendanceTrend(filters);
    setTrendData(response.data);
    setTrendAnalysis(response.analysis);
  };

  const loadRiskAnalysis = async () => {
    const response = await getRiskAnalysis(70, filters);
    setRiskStudents(response.data.students);
  };

  const handleFilterChange = (newFilters: AttendanceFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Renderizar contenido según la vista
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary-400 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-400 mb-4" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'records':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Mostrando {records.length} registros - Página {currentPage} de {totalPages}
            </div>
            {records.map((record) => (
              <AttendanceRecordCard key={record.id} record={record} />
            ))}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'students':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Mostrando {studentStats.length} estudiantes
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {studentStats.map((student) => (
                <StudentStatsCard key={student.student_id} student={student} />
              ))}
            </div>
          </div>
        );

      case 'groups':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">Mostrando {groupStats.length} grupos</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {groupStats.map((group) => (
                <GroupStatsCard key={group.group_id} group={group} />
              ))}
            </div>
          </div>
        );

      case 'trend':
        return trendAnalysis ? (
          <TrendChart data={trendData} analysis={trendAnalysis} />
        ) : (
          <div className="text-center text-gray-400 py-12">No hay datos de tendencia disponibles</div>
        );

      case 'risk':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Estudiantes en riesgo: {riskStudents.length}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {riskStudents.map((student) => (
                <RiskStudentCard key={student.student_id} student={student} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">Análisis de Asistencia</h2>
      </div>

      {/* Resumen de Estadísticas */}
      {summary && <AttendanceSummaryCards summary={summary} />}

      {/* Tabs de Vista */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setViewMode('records')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            viewMode === 'records'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Registros
        </button>
        <button
          onClick={() => setViewMode('students')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            viewMode === 'students'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
          }`}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Por Estudiante
        </button>
        <button
          onClick={() => setViewMode('groups')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            viewMode === 'groups'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
          }`}
        >
          <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
          Por Grupo
        </button>
        <button
          onClick={() => setViewMode('trend')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            viewMode === 'trend'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Tendencias
        </button>
        <button
          onClick={() => setViewMode('risk')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            viewMode === 'risk'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-700 text-gray-300 hover:bg-secondary-600'
          }`}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          En Riesgo
        </button>
      </div>

      {/* Filtros */}
      <AttendanceFiltersComponent
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Contenido */}
      {renderContent()}
    </div>
  );
};
