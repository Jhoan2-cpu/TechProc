import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faCalendar, faUser, faLaptop, faArrowRight, faSpinner, faClock } from '@fortawesome/free-solid-svg-icons';
import { websiteService, type CourseOffering } from '../../services/websiteService';

export const WebsiteCourses = () => {
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await websiteService.getPublicCourseOfferings();
        setCourses(data);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setError('No se pudieron cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDeliveryMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      regular: 'Presencial',
      online: 'En línea',
      intensive: 'Intensivo'
    };
    return labels[method] || method;
  };

  const getDeliveryMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      regular: 'bg-blue-500/20 text-blue-400',
      online: 'bg-green-500/20 text-green-400',
      intensive: 'bg-orange-500/20 text-orange-400'
    };
    return colors[method] || 'bg-gray-500/20 text-gray-400';
  };

  // Mostrar solo 6 cursos por defecto
  const displayedCourses = showAllCourses ? courses : courses.slice(0, 6);
  const hasMoreCourses = courses.length > 6;

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-primary-600/20 to-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-4 shadow-lg shadow-primary-500/30">
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Cursos Ofrecidos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre nuestra oferta académica del período actual
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-primary-400 text-4xl mb-4 animate-spin" />
            <p className="text-gray-300 text-lg">Cargando cursos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-primary-600/20 to-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-4 shadow-lg shadow-primary-500/30">
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Cursos Ofrecidos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre nuestra oferta académica del período actual
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-primary-600/20 to-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-4 shadow-lg shadow-primary-500/30">
            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Cursos Ofrecidos
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubre nuestra oferta académica del período actual
          </p>
          {courses.length > 0 && courses[0].academic_period && (
            <p className="mt-2 text-primary-400 font-semibold">
              Período: {courses[0].academic_period.name}
            </p>
          )}
        </div>

        {/* Courses Grid */}
        {displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header con nombre corto del curso */}
                <div className="bg-gradient-to-r from-primary-500/30 to-primary-600/30 p-4 border-b border-gray-700/30">
                  <h3 className="text-2xl font-heading font-bold text-white text-center">
                    {course.course.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Título completo */}
                  <h4 className="text-lg font-semibold text-white mb-4 line-clamp-2 min-h-[3.5rem]">
                    {course.course.title}
                  </h4>

                  {/* Delivery Method Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getDeliveryMethodColor(course.delivery_method)}`}>
                      {getDeliveryMethodLabel(course.delivery_method)}
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 text-gray-300 mb-3">
                    <FontAwesomeIcon icon={faUser} className="text-primary-400" />
                    <span className="text-sm">
                      {course.instructor.first_name} {course.instructor.last_name}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-2 text-gray-300 mb-3">
                    <FontAwesomeIcon icon={faClock} className="text-primary-400 mt-1" />
                    <span className="text-sm">
                      {course.schedule}
                    </span>
                  </div>

                  {/* Academic Period */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 pt-3 border-t border-gray-700/30">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>
                      {formatDate(course.academic_period.start_date)} - {formatDate(course.academic_period.end_date)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faLaptop} />
                    Más información
                    <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay cursos disponibles en este momento</p>
          </div>
        )}

        {/* View All Button - Solo mostrar si hay más de 6 cursos */}
        {hasMoreCourses && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-8 py-3 bg-secondary-600/50 border-2 border-primary-500/30 text-white font-semibold rounded-lg hover:bg-secondary-600 hover:border-primary-500/50 transition-all duration-300"
            >
              {showAllCourses ? 'Ver Menos Cursos' : 'Ver Más Cursos'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
