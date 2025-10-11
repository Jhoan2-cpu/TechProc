import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faTrophy,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

interface AnalyticsDashboardStatsProps {
  activeStudents: number;
  totalStudents: number;
  averageAttendance: number;
  averagePerformance: number;
  atRiskStudents: number;
}

export const AnalyticsDashboardStats = ({
  activeStudents,
  totalStudents,
  averageAttendance,
  averagePerformance,
  atRiskStudents,
}: AnalyticsDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Estudiantes Activos */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">Estudiantes Activos</p>
            <p className="text-3xl font-heading font-bold text-white">{activeStudents}</p>
            <p className="text-xs text-gray-400 mt-1">de {totalStudents} totales</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faUsers} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Asistencia Promedio */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">Asistencia Promedio</p>
            <p className="text-3xl font-heading font-bold text-white">{averageAttendance.toFixed(1)}%</p>
            <p className="text-xs text-gray-400 mt-1">en todos los cursos</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faUserCheck} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Rendimiento Promedio */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">Rendimiento Promedio</p>
            <p className="text-3xl font-heading font-bold text-white">{averagePerformance.toFixed(1)}%</p>
            <p className="text-xs text-gray-400 mt-1">calificaciones</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FontAwesomeIcon icon={faTrophy} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Estudiantes en Riesgo */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">Estudiantes en Riesgo</p>
            <p className="text-3xl font-heading font-bold text-white">{atRiskStudents}</p>
            <p className="text-xs text-gray-400 mt-1">requieren atención</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
