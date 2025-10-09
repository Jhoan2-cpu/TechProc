import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { CourseAnalytics } from '../types';

interface CourseAnalyticsCardProps {
  course: CourseAnalytics;
  index: number;
}

export const CourseAnalyticsCard = ({ course, index }: CourseAnalyticsCardProps) => {
  return (
    <div
      className="border border-secondary-200 rounded-lg p-4 hover:shadow-md hover:border-primary-500/20 transition-all duration-300 bg-secondary-600/50"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-lg text-white">
          {course.course_name}
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            <FontAwesomeIcon icon={faUsers} className="mr-1" />
            {course.active_students}/{course.total_students}
          </span>
          {course.at_risk_count > 0 && (
            <span className="text-red-600 font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {course.at_risk_count} en riesgo
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Asistencia</p>
          <p className="text-lg font-bold text-green-600">{course.average_attendance.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Rendimiento</p>
          <p className="text-lg font-bold text-primary-600">{course.average_performance.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Progreso</p>
          <p className="text-lg font-bold text-accent-600">{course.average_progress.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Completación</p>
          <p className="text-lg font-bold text-primary-700">{course.completion_rate.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Deserción</p>
          <p className="text-lg font-bold text-red-600">{course.dropout_rate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
