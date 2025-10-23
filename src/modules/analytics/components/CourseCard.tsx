import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faUsers, 
  faClock, 
  faChalkboardTeacher,
  faCalendar,
  faDollarSign,
  faLayerGroup,
  faStar,
  faTrophy,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import type { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
  index: number;
}

export const CourseCard = ({ course, index }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    const colors = {
      'basic': 'text-green-400 bg-green-500/20 border-green-500/30',
      'intermediate': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'advanced': 'text-red-400 bg-red-500/20 border-red-500/30'
    };
    return colors[level as keyof typeof colors] || 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      'basic': 'Básico',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-heading font-bold text-lg text-white">
              {course.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs border ${getLevelColor(course.level)}`}>
              {getLevelLabel(course.level)}
            </span>
            {course.status ? (
              <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3" />
                Activo
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30 flex items-center gap-1">
                <FontAwesomeIcon icon={faTimesCircle} className="w-3" />
                Inactivo
              </span>
            )}
          </div>
          
          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faBook} className="w-4 text-primary-400" />
              <span className="font-medium">{course.name}</span>
            </div>

            {course.description && (
              <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
            )}

            {course.instructors_data && course.instructors_data.length > 0 && (
              <div className="flex items-center gap-2 text-gray-300">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="w-4 text-primary-400" />
                <span>
                  {course.instructors_data.map(ci => 
                    `${ci.instructor.user.first_name} ${ci.instructor.user.last_name}`
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Badges especiales */}
          <div className="flex flex-wrap gap-2 mb-3">
            {course.bestseller && (
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                <FontAwesomeIcon icon={faTrophy} className="w-3" />
                Bestseller
              </span>
            )}
            {course.featured && (
              <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="w-3" />
                Destacado
              </span>
            )}
            {course.highest_rated && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="w-3" />
                Mejor Valorado
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right ml-4">
          <p className="text-3xl font-bold text-primary-400">
            {course.enrollments_count}
          </p>
          <p className="text-xs text-gray-400">Matrículas</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-primary-900/20 rounded">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faClock} className="text-primary-400 text-sm" />
            <p className="text-xs text-gray-400">Duración</p>
          </div>
          <p className="text-sm text-white font-medium">{parseFloat(course.duration).toFixed(0)}h</p>
        </div>
        
        <div className="p-3 bg-primary-900/20 rounded">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faCalendar} className="text-primary-400 text-sm" />
            <p className="text-xs text-gray-400">Sesiones</p>
          </div>
          <p className="text-sm text-white font-medium">{course.sessions}</p>
        </div>

        <div className="p-3 bg-primary-900/20 rounded">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faLayerGroup} className="text-primary-400 text-sm" />
            <p className="text-xs text-gray-400">Grupos</p>
          </div>
          <p className="text-sm text-white font-medium">{course.groups_count}</p>
        </div>

        <div className="p-3 bg-primary-900/20 rounded">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faUsers} className="text-primary-400 text-sm" />
            <p className="text-xs text-gray-400">Ofertas</p>
          </div>
          <p className="text-sm text-white font-medium">{course.course_offerings_count}</p>
        </div>
      </div>

      {/* Precios y fecha de creación */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between items-center text-sm flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faDollarSign} className="text-green-400" />
            <div className="flex items-center gap-2">
              {parseFloat(course.discount_price) < parseFloat(course.selling_price) && (
                <span className="text-gray-400 line-through">
                  S/ {parseFloat(course.selling_price).toFixed(2)}
                </span>
              )}
              <span className="text-green-400 font-bold">
                S/ {parseFloat(course.discount_price).toFixed(2)}
              </span>
            </div>
          </div>
          
          <span className="text-gray-400">
            Creado: {new Date(course.created_at).toLocaleDateString('es-PE')}
          </span>
        </div>
      </div>
    </div>
  );
};