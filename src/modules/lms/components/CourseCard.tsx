import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faClock,
  faMoneyBill,
  faChalkboardTeacher,
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
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Curso';
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
            Ver
          </button>
          <button
            onClick={() => onEdit?.(course)}
            className="flex-1 btn bg-warning/20 text-warning hover:bg-warning/25 border border-warning/30 hover:border-warning py-2 text-sm transition-all duration-300"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            Editar
          </button>
          <button
            onClick={() => onDelete?.(course)}
            className="btn bg-danger/20 text-danger hover:bg-danger/30 border border-danger/30 hover:border-danger py-2 px-3 text-sm transition-all duration-300"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
