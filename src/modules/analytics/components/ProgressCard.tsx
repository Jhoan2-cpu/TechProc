import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import type { StudentProgress } from '../types';

interface ProgressCardProps {
  progress: StudentProgress;
  index: number;
}

export const ProgressCard = ({ progress, index }: ProgressCardProps) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-primary-500';
    if (percentage >= 40) return 'bg-warning/20';
    return 'bg-red-600';
  };

  return (
    <div
      className="card p-6 hover:shadow-lg transition-shadow"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            {progress.student_name}
          </h3>
          <p className="text-sm text-gray-400">{progress.course_name}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-700">
            {progress.progress_percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-300">completado</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Módulo {progress.current_module} de {progress.total_modules}</span>
          <span>{progress.completed_modules} completados</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${getProgressColor(progress.progress_percentage)} transition-all duration-500`}
            style={{ width: `${progress.progress_percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
          <span className="text-gray-400">
            Promedio: <strong>{progress.average_time_per_module.toFixed(1)}h</strong> por módulo
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
          <span className="text-gray-400">
            Inscrito: <strong>{progress.enrollment_date}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400" />
          <span className="text-gray-400">
            Estimado: <strong>{progress.estimated_completion_date}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
