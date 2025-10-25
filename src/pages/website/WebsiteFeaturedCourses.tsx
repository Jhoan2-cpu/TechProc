import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faUser,
  faClock,
  faCalendar,
  faArrowRight,
  faLaptop,
  faCheck,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { websiteService, type CourseOffering } from '../../services/websiteService';

export const WebsiteFeaturedCourses = () => {
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await websiteService.getPublicCourseOfferings();

        // Filtrar solo los cursos destacados
        let featuredCourses = data.filter(course => course.featured === true);

        // Si no hay cursos destacados, tomar los primeros 2 cursos como destacados por defecto
        if (featuredCourses.length === 0 && data.length > 0) {
          featuredCourses = data.slice(0, 2);
          console.log('No hay cursos con featured=true, mostrando los primeros 2 cursos');
        }

        console.log('Cursos destacados encontrados:', featuredCourses.length);
        setCourses(featuredCourses);
      } catch (err) {
        console.error('Error al cargar cursos destacados:', err);
        setError('No se pudieron cargar los cursos destacados');
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

  if (loading) {
    return null; // No mostrar nada mientras carga
  }

  if (error || courses.length === 0) {
    return null; // No mostrar nada si hay error o no hay cursos destacados
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600/30 via-orange-600/20 to-primary-600/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-primary-500/20 rounded-full mb-4 border border-orange-500/30">
            <FontAwesomeIcon icon={faFire} className="text-orange-400 animate-pulse" />
            <span className="text-orange-300 font-bold text-sm uppercase tracking-wide">
              Cursos Destacados
            </span>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            ¡No Te Pierdas Nuestros Mejores Cursos!
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Los programas más populares y completos, elegidos por miles de estudiantes
          </p>
        </div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-gradient-to-br from-secondary-500/90 to-secondary-600/90 backdrop-blur-sm rounded-2xl border-2 border-primary-500/50 shadow-2xl hover:shadow-primary-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Badge "Destacado" */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-white animate-pulse" />
                  <span className="text-white font-bold text-sm">DESTACADO</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Course name tag */}
                <div className="inline-block bg-primary-500/30 px-4 py-1 rounded-full border border-primary-400/30 mb-4">
                  <span className="text-primary-300 font-bold text-sm">{course.course.name}</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-heading font-bold text-white mb-4 leading-tight">
                  {course.course.title}
                </h3>

                {/* Period info */}
                <div className="bg-secondary-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                      <span className="font-semibold">Período:</span>
                      <span className="text-white">{course.academic_period.name}</span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-400/30">
                      <span className="text-green-300 font-semibold text-xs">
                        {getDeliveryMethodLabel(course.delivery_method)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Instructor */}
                  <div className="bg-secondary-700/30 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faUser} className="text-primary-400 text-sm" />
                      <span className="text-gray-400 text-xs">Instructor</span>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {course.instructor.first_name} {course.instructor.last_name}
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="bg-secondary-700/30 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faClock} className="text-primary-400 text-sm" />
                      <span className="text-gray-400 text-xs">Horario</span>
                    </div>
                    <p className="text-white font-semibold text-sm line-clamp-1">
                      {course.schedule}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gradient-to-r from-primary-500/10 to-orange-500/10 rounded-lg p-4 mb-6 border border-primary-500/20">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <div>
                      <span className="text-gray-400">Inicio:</span>{' '}
                      <span className="text-white font-semibold">
                        {formatDate(course.academic_period.start_date)}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-600"></div>
                    <div>
                      <span className="text-gray-400">Fin:</span>{' '}
                      <span className="text-white font-semibold">
                        {formatDate(course.academic_period.end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FontAwesomeIcon icon={faCheck} className="text-green-400 text-sm" />
                    <span className="text-sm">Certificado al finalizar</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FontAwesomeIcon icon={faCheck} className="text-green-400 text-sm" />
                    <span className="text-sm">Material de estudio incluido</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FontAwesomeIcon icon={faCheck} className="text-green-400 text-sm" />
                    <span className="text-sm">Soporte del instructor</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#contact-enrollment"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = 'contact-enrollment';
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 via-orange-500 to-primary-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <FontAwesomeIcon icon={faLaptop} className="group-hover:scale-110 transition-transform" />
                  <span>¡Inscríbete Ahora!</span>
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Hover effect glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {courses.length > 0 && (
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-gray-300 mb-4">
              ¿Listo para transformar tu carrera profesional?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-secondary-600/50 border-2 border-primary-500/30 text-white font-semibold rounded-lg hover:bg-secondary-600 hover:border-primary-500/50 transition-all duration-300"
            >
              Ver todos los cursos disponibles
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
