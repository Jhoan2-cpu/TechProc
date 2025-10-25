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
  faFire,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { websiteService, type CourseOffering } from '../../services/websiteService';

export const WebsiteFeaturedCourses = () => {
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handlePrevious = () => {
    if (isAnimating || courses.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleNext = () => {
    if (isAnimating || courses.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const totalCards = courses.length;

    // Ajustar el diff para el carrusel circular
    let adjustedDiff = diff;
    if (Math.abs(diff) > totalCards / 2) {
      adjustedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
    }

    // Card central (activa)
    if (adjustedDiff === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)'
      };
    }

    // Cards a la izquierda
    if (adjustedDiff < 0) {
      const distance = Math.abs(adjustedDiff);
      return {
        transform: `translateX(-${80 + (distance - 1) * 40}%) scale(${0.75 - (distance - 1) * 0.15}) rotateY(25deg)`,
        zIndex: 30 - distance,
        opacity: distance === 1 ? 0.6 : 0.3,
        filter: distance === 1 ? 'brightness(0.7)' : 'brightness(0.4)'
      };
    }

    // Cards a la derecha
    const distance = adjustedDiff;
    return {
      transform: `translateX(${80 + (distance - 1) * 40}%) scale(${0.75 - (distance - 1) * 0.15}) rotateY(-25deg)`,
      zIndex: 30 - distance,
      opacity: distance === 1 ? 0.6 : 0.3,
      filter: distance === 1 ? 'brightness(0.7)' : 'brightness(0.4)'
    };
  };

  if (loading) {
    return null;
  }

  if (error || courses.length === 0) {
    return null;
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
        <div className="text-center mb-16 animate-fade-in">
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

        {/* 3D Carousel */}
        <div className="relative" style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}>
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-2xl hover:shadow-primary-500/50 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-white text-xl" />
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-2xl hover:shadow-primary-500/50 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-white text-xl" />
          </button>

          {/* Cards Container */}
          <div className="relative h-[700px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {courses.map((course, index) => {
              const cardStyle = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={course.id}
                  className="absolute w-full max-w-2xl transition-all duration-600 ease-out"
                  style={{
                    ...cardStyle,
                    transformStyle: 'preserve-3d',
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <div className={`relative bg-gradient-to-br from-secondary-500/90 to-secondary-600/90 backdrop-blur-sm rounded-2xl border-2 ${isActive ? 'border-primary-500/50' : 'border-gray-700/30'} shadow-2xl overflow-hidden`}>
                    {/* Badge "Destacado" */}
                    {isActive && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                          <FontAwesomeIcon icon={faStar} className="text-white animate-pulse" />
                          <span className="text-white font-bold text-sm">DESTACADO</span>
                        </div>
                      </div>
                    )}

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
                      {isActive && (
                        <a
                          href="#contact-enrollment"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = 'contact-enrollment';
                          }}
                          className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-400 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faLaptop} className="group-hover:scale-110 transition-transform" />
                          <span>¡Inscríbete Ahora!</span>
                          <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>

                    {/* Hover effect glow - solo en card activa */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 600);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-gradient-to-r from-primary-500 to-orange-500'
                    : 'w-2 bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-gray-300 mb-4">
            ¿Listo para transformar tu carrera profesional?
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary-600/50 border-2 border-primary-500/30 text-white font-semibold rounded-lg hover:bg-secondary-600 hover:border-primary-500/50 transition-all duration-300"
          >
            Ver todos los cursos disponibles
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
};
