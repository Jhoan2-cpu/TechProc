import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faUserGroup,
  faBook,
  faExclamationTriangle,
  faCalendar,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import type { RiskStudent, AttendanceRiskLevel } from '../types';

interface RiskStudentCardProps {
  student: RiskStudent;
}

export const RiskStudentCard = ({ student }: RiskStudentCardProps) => {
  const getRiskColor = (level: AttendanceRiskLevel) => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: 'text-green-400',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          icon: 'text-orange-400',
        };
      case 'critical':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: 'text-red-400',
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: 'text-gray-400',
        };
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const colors = getRiskColor(student.risk_level);
  const attendanceRate = parseFloat(student.attendance_rate);

  return (
    <div
      className={`bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border ${colors.border} hover:border-primary-500/50 transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faUser} className="text-primary-400" />
            <h3 className="text-lg font-semibold text-white">{student.student_name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
            <span>{student.student_email}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FontAwesomeIcon icon={faUserGroup} className="text-xs" />
              <span>{student.group_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FontAwesomeIcon icon={faBook} className="text-xs" />
              <span>{student.course_title}</span>
            </div>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            Riesgo {getRiskLabel(student.risk_level)}
          </span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{student.total_classes}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-400">{student.classes_attended}</div>
          <div className="text-xs text-gray-400">Asistió</div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-400">{student.classes_missed}</div>
          <div className="text-xs text-gray-400">Faltas</div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className={`text-xl font-bold ${colors.text}`}>{attendanceRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Tasa</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-secondary-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
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

      {/* Last Attendance */}
      <div className="mb-4 flex items-center justify-between text-sm bg-secondary-700/30 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
          <span className="text-gray-300">Última asistencia</span>
        </div>
        <span className="text-white font-medium">{formatDate(student.last_attendance_date)}</span>
      </div>

      {/* Days Inactive Warning */}
      {student.days_since_last_attendance > 7 && (
        <div className={`mb-4 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className={colors.icon} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {student.days_since_last_attendance} días sin asistir
            </span>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {student.recommendations && student.recommendations.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faLightbulb} className="text-blue-400" />
            <h4 className="text-sm font-semibold text-blue-400">Recomendaciones</h4>
          </div>
          <ul className="space-y-1">
            {student.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
