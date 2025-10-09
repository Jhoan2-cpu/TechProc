import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faClock,
  faMoneyBill,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index?: number;
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export const CourseCard = ({
  course,
  index = 0,
  onView,
  onEdit,
  onDelete,
}: CourseCardProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      publicado: 'bg-success/20 text-green-700',
      borrador: 'bg-warning/20 text-yellow-700',
      archivado: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.borrador;
  };

  return (
    <div
      className="card p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header del card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-heading font-bold text-lg text-white mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            Código: <span className="font-semibold">{course.code}</span>
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Info del curso */}
      <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
        {course.instructor && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600" />
            <span>{course.instructor.first_name} {course.instructor.last_name}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <FontAwesomeIcon icon={faClock} className="text-purple-600" />
          <span>{course.duration_weeks} sesiones</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
          <span className="font-semibold">S/. {course.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={() => onView?.(course)}
          className="flex-1 btn bg-primary-900/20 text-blue-700 hover:bg-blue-200 py-2 text-sm"
        >
          <FontAwesomeIcon icon={faEye} className="mr-1" />
          Ver
        </button>
        <button
          onClick={() => onEdit?.(course)}
          className="flex-1 btn bg-orange-900/20 text-orange-700 hover:bg-orange-200 py-2 text-sm"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-1" />
          Editar
        </button>
        <button
          onClick={() => onDelete?.(course)}
          className="btn bg-danger/20 text-red-700 hover:bg-red-200 py-2 px-3 text-sm"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};
