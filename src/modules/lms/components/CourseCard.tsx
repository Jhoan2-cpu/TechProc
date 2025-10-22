import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faClock,
  faMoneyBill,
  faStar,
  faFire,
  faBookOpen,
  faSignal,
} from '@fortawesome/free-solid-svg-icons';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index?: number;
  onView?: (course: Course) => void;
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

  const getLevelLabel = (level?: string) => {
    const labels = {
      basic: 'Básico',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return level ? labels[level as keyof typeof labels] || level : 'N/A';
  };

  const getLevelColor = (level?: string) => {
    const colors = {
      basic: 'text-green-600',
      intermediate: 'text-yellow-600',
      advanced: 'text-red-600',
    };
    return level ? colors[level as keyof typeof colors] || 'text-gray-600' : 'text-gray-600';
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-out animate-slide-up border-2 border-secondary-500/30 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/30 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-primary-500/0 before:via-primary-500/0 before:to-primary-500/0 hover:before:from-primary-500/50 hover:before:via-primary-400/50 hover:before:to-primary-500/50 before:transition-all before:duration-500 before:-z-10 before:blur-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Imagen del curso */}
      {course.course_image && (
        <div className="w-full h-40 overflow-hidden bg-secondary-500">
          <img
            src={course.course_image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/png;base64,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';
            }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Badges superiores */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
          {course.bestseller && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faFire} />
              Bestseller
            </span>
          )}
          {course.featured && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} />
              Destacado
            </span>
          )}
          {course.highest_rated && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} />
              Mejor Valorado
            </span>
          )}
        </div>

        {/* Header del card */}
        <div className="mb-3">
          <h3 className="font-heading font-bold text-lg text-white mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-400">
            Código: <span className="font-semibold">{course.code}</span>
          </p>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Info del curso */}
        <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
          {course.level && (
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faSignal} className={getLevelColor(course.level)} />
              <span className="text-gray-300">{getLevelLabel(course.level)}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FontAwesomeIcon icon={faClock} className="text-purple-600" />
              <span>{course.duration} horas</span>
            </div>
          )}
          {course.sessions && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
              <span>{course.sessions} sesiones</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
            <div className="flex items-center gap-2">
              {course.discount_price && course.discount_price < (course.selling_price || 0) ? (
                <>
                  <span className="font-semibold text-green-400">S/. {course.discount_price.toFixed(2)}</span>
                  <span className="text-gray-500 line-through text-xs">S/. {course.selling_price?.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-semibold text-green-400">S/. {(course.selling_price || course.price).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(course)}
            className="flex-1 btn bg-primary-300/20 text-primary-300 hover:bg-primary-500/30 border border-primary-500/30 hover:border-primary-500 py-2 text-sm transition-all duration-300"
          >
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            Detalles
          </button>
          <button
            onClick={() => onDelete?.(course)}
            className="btn bg-danger/20 text-danger hover:bg-danger/30 border border-danger/30 hover:border-danger py-2 px-4 text-sm transition-all duration-300"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
