import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { RecentCourse } from '../types';

interface RecentCourseCardProps {
  course: RecentCourse;
}

export const RecentCourseCard = ({ course }: RecentCourseCardProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      publicado: 'bg-green-100 text-green-700',
      borrador: 'bg-yellow-100 text-yellow-700',
      archivado: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.borrador;
  };

  return (
    <div className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-secondary-900 mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-secondary-600">
            Código: {course.code}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-secondary-500 mt-3">
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faChalkboardTeacher} />
          {course.instructor_name}
        </span>
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faClock} />
          {new Date(course.created_at).toLocaleDateString('es-ES')}
        </span>
      </div>
    </div>
  );
};
