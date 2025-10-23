import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faBook,
  faUserGroup,
  faChartLine,
  faClipboardCheck,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { StudentProgressData, ProgressLevelType } from '../types';

interface StudentProgressCardProps {
  student: StudentProgressData;
}

export const StudentProgressCard = ({ student }: StudentProgressCardProps) => {
  const getProgressLevelColor = (level: ProgressLevelType) => {
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

  const getProgressLevelLabel = (level: ProgressLevelType) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'text-green-400';
      case 'Failed':
        return 'text-red-400';
      case 'in_progress':
        return 'text-blue-400';
      case 'dropped':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'Aprobado';
      case 'Failed':
        return 'Reprobado';
      case 'in_progress':
        return 'En Progreso';
      case 'dropped':
        return 'Abandonado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faUser} className="text-primary-400" />
            <h3 className="text-lg font-semibold text-white">{student.student_name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
            <span>{student.student_email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <FontAwesomeIcon icon={faBook} className="text-xs" />
            <span>{student.course_title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FontAwesomeIcon icon={faUserGroup} className="text-xs" />
            <span>{student.group_name}</span>
          </div>
        </div>

        {/* Progress Level Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getProgressLevelColor(
            student.progress_level
          )}`}
        >
          {getProgressLevelLabel(student.progress_level)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progreso General</span>
          <span className="text-lg font-bold text-primary-400">{student.overall_progress}%</span>
        </div>
        <div className="w-full bg-secondary-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              student.overall_progress >= 80
                ? 'bg-green-500'
                : student.overall_progress >= 60
                ? 'bg-blue-500'
                : student.overall_progress >= 40
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(student.overall_progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Calificación Final */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{student.final_grade.toFixed(2)}</div>
          <div className="text-xs text-gray-400">Nota Final</div>
        </div>

        {/* Promedio */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{student.average_grade.toFixed(2)}</div>
          <div className="text-xs text-gray-400">Promedio</div>
        </div>

        {/* Asistencia */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-400">
            {student.attendance.attended}/{student.attendance.total_classes}
          </div>
          <div className="text-xs text-gray-400">Asistencia</div>
        </div>

        {/* Evaluaciones */}
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-400">
            {student.evaluations.completed}/{student.evaluations.total}
          </div>
          <div className="text-xs text-gray-400">Evaluaciones</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {/* Attendance Rate */}
        <div className="flex items-center gap-2 bg-secondary-700/30 rounded-lg p-3">
          <FontAwesomeIcon icon={faClipboardCheck} className="text-blue-400" />
          <div>
            <div className="text-gray-400">Asistencia</div>
            <div className="font-medium text-white">{student.attendance.rate.toFixed(1)}%</div>
          </div>
        </div>

        {/* Evaluation Rate */}
        <div className="flex items-center gap-2 bg-secondary-700/30 rounded-lg p-3">
          <FontAwesomeIcon icon={faGraduationCap} className="text-purple-400" />
          <div>
            <div className="text-gray-400">Evaluaciones</div>
            <div className="font-medium text-white">{student.evaluations.rate.toFixed(1)}%</div>
          </div>
        </div>

        {/* Program Status */}
        <div className="flex items-center gap-2 bg-secondary-700/30 rounded-lg p-3">
          <FontAwesomeIcon icon={faChartLine} className={getStatusColor(student.program_status)} />
          <div>
            <div className="text-gray-400">Estado</div>
            <div className={`font-medium ${getStatusColor(student.program_status)}`}>
              {getStatusLabel(student.program_status)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
