import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faTasks,
  faCheckCircle,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import type { AnalyticsDashboard, CourseAnalytics } from '../types';
import {
  AnalyticsDashboardStats,
  ProgressChart,
  PieChart,
  CourseAnalyticsCard,
} from '../components';

interface AnalyticsDashboardPageProps {
  dashboard: AnalyticsDashboard;
  courseAnalytics: CourseAnalytics[];
}

export const AnalyticsDashboardPage = ({
  dashboard,
  courseAnalytics,
}: AnalyticsDashboardPageProps) => {
  return (
    <div className="space-y-6">
      {/* Métricas Generales */}
      <AnalyticsDashboardStats
        activeStudents={dashboard.active_students}
        totalStudents={dashboard.total_students}
        averageAttendance={dashboard.average_attendance}
        averagePerformance={dashboard.average_performance}
        atRiskStudents={dashboard.at_risk_students}
      />

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-2xl text-blue-400" />
            <h3 className="text-lg font-heading font-bold text-white">Cursos Activos</h3>
          </div>
          <p className="text-4xl font-bold text-white">{dashboard.total_courses}</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faTasks} className="text-2xl text-green-400" />
            <h3 className="text-lg font-heading font-bold text-white">Progreso Promedio</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {dashboard.average_progress.toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-purple-400" />
            <h3 className="text-lg font-heading font-bold text-white">Tasa de Completación</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {dashboard.completion_rate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Gráficos de Visualización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Progreso por Curso */}
        <div className="card p-6">
          <ProgressChart
            title="Progreso Promedio por Curso"
            data={courseAnalytics.map(course => ({
              label: course.course_name,
              value: course.average_progress,
              color: course.average_progress >= 70 ? 'bg-green-600' : course.average_progress >= 50 ? 'bg-primary-500' : 'bg-warning/20',
            }))}
          />
        </div>

        {/* Gráfico de Distribución de Estudiantes */}
        <div className="card p-6">
          <PieChart
            title="Distribución de Estudiantes por Curso"
            data={courseAnalytics.map((course, index) => {
              const colors = ['bg-primary-500', 'bg-primary-500', 'bg-green-600', 'bg-warning/20'];
              return {
                label: course.course_name,
                value: course.total_students,
                color: colors[index % colors.length],
              };
            })}
          />
        </div>
      </div>

      {/* Análisis por Curso */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartBar} className="text-blue-400" />
          Análisis por Curso
        </h2>
        <div className="space-y-4">
          {courseAnalytics.map((course, index) => (
            <CourseAnalyticsCard
              key={course.course_id}
              course={course}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
