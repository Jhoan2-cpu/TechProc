import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faExclamationTriangle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { StudentAttendanceStats, PerformanceLevel, AttendanceRiskLevel } from '../types';

interface StudentStatsCardProps {
  student: StudentAttendanceStats;
}

export const StudentStatsCard = ({ student }: StudentStatsCardProps) => {
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

  const getRiskColor = (level: AttendanceRiskLevel) => {
    switch (level) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-orange-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
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

  const getRiskLabel = (level: AttendanceRiskLevel) => {
    switch (level) {
      case 'low':
        return 'Bajo';
      case 'medium':
        return 'Medio';
      case 'high':
        return 'Alto';
      case 'critical':
        return 'Crítico';
      default:
        return 'N/A';
    }
  };

  const attendanceRate = parseFloat(student.attendance_rate);
  const avgMinutes = parseFloat(student.avg_connected_minutes);

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/50 transition-all">
      {/* Header con información del estudiante */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faUser} className="text-primary-400" />
            <h3 className="text-lg font-semibold text-white">{student.student_name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
            <span>{student.student_email}</span>
          </div>
        </div>

        {/* Badge de Nivel de Rendimiento */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(
            student.performance_level
          )}`}
        >
          {getPerformanceLabel(student.performance_level)}
        </span>
      </div>

      {/* Estadísticas en Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total de Clases */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{student.total_classes}</div>
          <div className="text-xs text-gray-400">Total Clases</div>
        </div>

        {/* Asistidas */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{student.classes_attended}</div>
          <div className="text-xs text-gray-400">Asistidas</div>
        </div>

        {/* Faltas */}
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{student.classes_missed}</div>
          <div className="text-xs text-gray-400">Faltas</div>
        </div>

        {/* Tasa de Asistencia */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-400">{attendanceRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Tasa</div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-4">
        <div className="w-full bg-secondary-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              attendanceRate >= 90
                ? 'bg-green-500'
                : attendanceRate >= 75
                ? 'bg-blue-500'
                : attendanceRate >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(attendanceRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Info Adicional */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
          <span className="text-gray-300">{avgMinutes.toFixed(0)} min promedio</span>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={getRiskColor(student.risk_level)}
          />
          <span className={getRiskColor(student.risk_level)}>
            Riesgo: {getRiskLabel(student.risk_level)}
          </span>
        </div>
      </div>
    </div>
  );
};
