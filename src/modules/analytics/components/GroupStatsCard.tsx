import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGroup,
  faBook,
  faUsers,
  faClipboardList,
  faCheck,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import type { GroupAttendanceStats, PerformanceLevel } from '../types';

interface GroupStatsCardProps {
  group: GroupAttendanceStats;
}

export const GroupStatsCard = ({ group }: GroupStatsCardProps) => {
  const getPerformanceColor = (level: PerformanceLevel) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'regular':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'poor':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'very_poor':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPerformanceLabel = (level: PerformanceLevel) => {
    switch (level) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'regular':
        return 'Regular';
      case 'poor':
        return 'Bajo';
      case 'very_poor':
        return 'Muy Bajo';
      default:
        return 'N/A';
    }
  };

  const attendanceRate = parseFloat(group.attendance_rate);

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faUserGroup} className="text-primary-400" />
            <h3 className="text-lg font-semibold text-white">{group.group_name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <FontAwesomeIcon icon={faBook} className="text-xs" />
            <span>{group.course_title}</span>
          </div>
          <p className="text-xs text-gray-500">Código: {group.group_code}</p>
        </div>

        {/* Badge de Nivel de Rendimiento */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(
            group.performance_level
          )}`}
        >
          {getPerformanceLabel(group.performance_level)}
        </span>
      </div>

      {/* Estadísticas Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Estudiantes */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{group.total_students}</div>
          <div className="text-xs text-gray-400">Estudiantes</div>
        </div>

        {/* Total Registros */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FontAwesomeIcon icon={faClipboardList} className="text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{group.total_records}</div>
          <div className="text-xs text-gray-400">Registros</div>
        </div>

        {/* Asistencias */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
          </div>
          <div className="text-xl font-bold text-white">{group.total_attended}</div>
          <div className="text-xs text-gray-400">Asistieron</div>
        </div>
      </div>

      {/* Tasa de Asistencia */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Tasa de Asistencia</span>
          <span className="text-lg font-bold text-primary-400">{attendanceRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-secondary-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              attendanceRate >= 80
                ? 'bg-green-500'
                : attendanceRate >= 70
                ? 'bg-blue-500'
                : attendanceRate >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(attendanceRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Promedio por Estudiante */}
      <div className="flex items-center justify-between text-sm bg-secondary-700/30 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
          <span className="text-gray-300">Promedio por estudiante</span>
        </div>
        <span className="text-white font-medium">{group.avg_attendance_per_student} clases</span>
      </div>
    </div>
  );
};
