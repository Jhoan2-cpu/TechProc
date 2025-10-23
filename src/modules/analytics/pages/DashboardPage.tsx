import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBook,
  faUserCheck,
  faChartLine,
  faMoneyBillWave,
  faHeadset,
  faShieldAlt,
  faGraduationCap,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import type { DashboardFilters } from '../types/dashboard';
import { DashboardFilterSection } from '../components/DashboardFilterSection';
import { MetricCard } from '../components/MetricCard';
import { RecentActivities } from '../components/RecentActivities';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardPage = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});

  const {
    summary,
    studentMetrics,
    financialMetrics,
    recentActivities,
    loading,
    error,
    refreshData
  } = useDashboard(filters);

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    refreshData({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando dashboard...</div>
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
            <FontAwesomeIcon icon={faChartBar} className="text-primary-400" />
            Dashboard de Analytics
          </h2>
          <p className="text-gray-400 mt-1">
            Resumen completo de métricas y actividades del sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <DashboardFilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Estadísticas principales */}
      {summary && (
        <>
          {/* Primera fila - Estudiantes y Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Estudiantes"
              value={summary.students.total}
              icon={faUsers}
              color="blue"
              subtitle={`${summary.students.active} activos`}
              trend={summary.students.growth_rate}
            />

            <MetricCard
              title="Cursos Activos"
              value={summary.courses.active}
              icon={faBook}
              color="green"
              subtitle={`${summary.courses.total} totales`}
            />

            <MetricCard
              title="Tasa de Asistencia"
              value={`${summary.attendance.average_rate}%`}
              icon={faUserCheck}
              color="purple"
              trend={summary.attendance.trend === 'up' ? 5 : -5}
            />

            <MetricCard
              title="Rendimiento Promedio"
              value={`${summary.performance.average_grade}%`}
              icon={faGraduationCap}
              color="yellow"
              subtitle={`${summary.performance.passing_rate}% aprobados`}
            />
          </div>

          {/* Segunda fila - Finanzas, Soporte y Seguridad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Ingresos Totales"
              value={formatCurrency(summary.revenue.total)}
              icon={faMoneyBillWave}
              color="green"
              trend={summary.revenue.growth_rate}
            />

            <MetricCard
              title="Tickets Abiertos"
              value={summary.support.open_tickets}
              icon={faHeadset}
              color="orange"
              subtitle={`${summary.support.average_resolution_time_hours}h resolución`}
            />

            <MetricCard
              title="Alertas de Seguridad"
              value={summary.security.active_alerts}
              icon={faShieldAlt}
              color="red"
              subtitle={`${summary.security.blocked_ips} IPs bloqueadas`}
            />
          </div>

          {/* Actividades Recientes */}
          <RecentActivities activities={recentActivities} />
        </>
      )}

      {/* Métricas detalladas de estudiantes */}
      {studentMetrics && studentMetrics.by_company.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
            Estudiantes por Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentMetrics.by_company.map((company) => (
              <div
                key={company.company_id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{company.company_name}</p>
                    <p className="text-gray-400 text-sm">ID: {company.company_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-400">
                      {company.student_count}
                    </p>
                    <p className="text-xs text-gray-400">estudiantes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Métricas financieras detalladas */}
      {financialMetrics && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
            Tendencias Financieras
          </h3>
          
          {/* Fuentes de ingresos */}
          {financialMetrics.revenue_sources.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Fuentes de Ingresos</h4>
              <div className="space-y-2">
                {financialMetrics.revenue_sources.map((source) => (
                  <div key={source.source_id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                    <span className="text-white">{source.source_name}</span>
                    <div className="text-right">
                      <p className="text-primary-400 font-medium">
                        {formatCurrency(source.amount)}
                      </p>
                      <p className="text-gray-400 text-sm">{source.percentage}% del total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tendencia mensual */}
          {financialMetrics.monthly_trend.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Tendencia Mensual</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Mes</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialMetrics.monthly_trend.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-4 text-white">{item.month}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-green-400 font-medium">
                            {formatCurrency(item.revenue)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};