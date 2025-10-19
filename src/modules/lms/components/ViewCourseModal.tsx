import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faClock,
  faMoneyBill,
  faChalkboardTeacher,
  faCalendar,
  faCode,
  faFileAlt,
  faUsers,
  faEnvelope,
  faVideo,
  faImage,
  faStar,
  faAward,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { Course, CourseDetail, Enrollment } from '../types';
import { enrollmentsService, coursesService } from '../services';

interface ViewCourseModalProps {
  course: Course;
  onClose: () => void;
}

export const ViewCourseModal = ({ course, onClose }: ViewCourseModalProps) => {
  const [courseDetails, setCourseDetails] = useState<CourseDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoadingCourse(true);
        setError('');
        const details = await coursesService.getDetailById(course.course_id || course.id);
        setCourseDetails(details);
      } catch (err: any) {
        setError(err.message || 'Error al cargar detalles del curso');
        console.error('Error fetching course details:', err);
      } finally {
        setLoadingCourse(false);
      }
    };

    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const data = await enrollmentsService.getByCourse(course.id);
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoadingEnrollments(false);
      }
    };

    fetchCourseDetails();
    fetchEnrollments();
  }, [course.id, course.course_id]);

  const getStatusBadge = (status: boolean) => {
    return status
      ? 'bg-success/20 text-green-700'
      : 'bg-warning/20 text-yellow-700';
  };

  const getStatusLabel = (status: boolean) => {
    return status ? 'Publicado' : 'Borrador';
  };

  const getLevelBadge = (level?: string) => {
    const styles = {
      basic: 'bg-blue-500/20 text-blue-700',
      intermediate: 'bg-orange-500/20 text-orange-700',
      advanced: 'bg-red-500/20 text-red-700',
    };
    return styles[level as keyof typeof styles] || styles.basic;
  };

  const getLevelLabel = (level?: string) => {
    const labels = {
      basic: 'Básico',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[level as keyof typeof labels] || 'Básico';
  };

  const getEnrollmentStatusBadge = (status: string) => {
    const styles = {
      activo: 'bg-primary-900/20 text-blue-700',
      completado: 'bg-success/20 text-green-700',
      abandonado: 'bg-danger/20 text-red-700',
    };
    return styles[status as keyof typeof styles] || styles.activo;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loadingCourse) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-white">Cargando detalles del curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Error al cargar el curso</h3>
            <p className="text-gray-300 mb-6">{error || 'No se pudo cargar la información del curso'}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold text-white">
              {courseDetails.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Detalles del curso
            </p>
          </div>
          <div className="flex items-center gap-2">
            {courseDetails.bestseller && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-600">
                <FontAwesomeIcon icon={faStar} className="mr-1" />
                Bestseller
              </span>
            )}
            {courseDetails.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-600">
                <FontAwesomeIcon icon={faAward} className="mr-1" />
                Destacado
              </span>
            )}
            {courseDetails.highest_rated && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600">
                <FontAwesomeIcon icon={faStar} className="mr-1" />
                Top Rated
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadge(courseDetails.level)}`}>
              {getLevelLabel(courseDetails.level)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(courseDetails.status)}`}>
              {getStatusLabel(courseDetails.status)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-2"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Imagen del curso */}
            {courseDetails.course_image && (
              <div className="w-full max-w-3xl mx-auto">
                <img
                  src={courseDetails.course_image}
                  alt={courseDetails.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Descripción */}
            <div className="bg-secondary-600/50 rounded-lg p-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-orange-500" />
                Descripción
              </h3>
              <p className="text-white whitespace-pre-wrap leading-relaxed">{courseDetails.description}</p>
            </div>

            {/* Grid de información principal - 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCode} className="text-primary-600" />
                  ID del Curso
                </label>
                <p className="text-white font-semibold text-lg">{courseDetails.course_id}</p>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                  Duración
                </label>
                <p className="text-white font-semibold text-lg">{courseDetails.duration} horas</p>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faListAlt} className="text-blue-600" />
                  Sesiones
                </label>
                <p className="text-white font-semibold text-lg">{courseDetails.sessions}</p>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
                  Precio de Venta
                </label>
                <p className="text-white font-semibold text-lg">S/. {courseDetails.selling_price?.toFixed(2)}</p>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-yellow-600" />
                  Precio con Descuento
                </label>
                <p className="text-white font-semibold text-lg">
                  {courseDetails.discount_price ? `S/. ${courseDetails.discount_price.toFixed(2)}` : 'Sin descuento'}
                </p>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
                  Fecha de Creación
                </label>
                <p className="text-white font-semibold">{formatDate(courseDetails.created_at)}</p>
              </div>
            </div>

            {/* Prerequisitos */}
            {courseDetails.prerequisites && (
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-white mb-3">
                  Prerequisitos
                </h3>
                <p className="text-white whitespace-pre-wrap">{courseDetails.prerequisites}</p>
              </div>
            )}

            {/* Certificación */}
            {courseDetails.certificate_name && (
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-white mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faAward} className="text-yellow-500" />
                  Certificación
                </h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-300">Este curso otorga certificado</span>
                  </p>
                  {courseDetails.certificate_issuer && (
                    <p className="text-white">
                      <span className="text-gray-300">Emisor:</span> {courseDetails.certificate_issuer}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Video URL */}
            {courseDetails.video_url && (
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-white mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faVideo} className="text-red-500" />
                  Video del Curso
                </h3>
                <a
                  href={courseDetails.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 underline break-all"
                >
                  {courseDetails.video_url}
                </a>
              </div>
            )}

            {/* Grid de 2 columnas para categorías, instructores y contenidos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categorías */}
              {courseDetails.categories && courseDetails.categories.length > 0 && (
                <div className="bg-secondary-600/50 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faListAlt} className="text-primary-600" />
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    {courseDetails.categories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2 text-white">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructores */}
              {courseDetails.instructors && courseDetails.instructors.length > 0 && (
                <div className="bg-secondary-600/50 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600" />
                    Instructores
                  </h3>
                  <div className="space-y-3">
                    {courseDetails.instructors.map((instructor, index) => (
                      <div key={index} className="p-3 bg-secondary-700/50 rounded-lg">
                        <p className="text-white font-semibold">
                          {instructor.name}
                        </p>
                        {instructor.expertise_area && (
                          <p className="text-sm text-gray-300 mt-1">
                            <span className="text-gray-400">Área de expertise:</span> {instructor.expertise_area}
                          </p>
                        )}
                        {instructor.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                            <span>{instructor.email}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contenidos del Curso */}
            {courseDetails.contents && courseDetails.contents.length > 0 && (
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faListAlt} className="text-green-600" />
                  Contenidos del Curso
                </h3>
                <div className="space-y-3">
                  {courseDetails.contents.map((content, index) => (
                    <div key={content.id || index} className="p-4 bg-secondary-700/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 font-semibold text-sm">
                          {content.order_number || (index + 1)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold">{content.title}</h4>
                            <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                              {content.type}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs">Sesión {content.session}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estudiantes Inscritos */}
            <div className="bg-secondary-600/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-primary-600" />
                  Estudiantes Inscritos
                </h3>
                <span className="text-sm bg-primary-900/20 text-primary-700 px-3 py-1 rounded-full font-semibold">
                  {enrollments.length}
                </span>
              </div>

              {loadingEnrollments ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-3 text-sm text-gray-400">Cargando estudiantes...</p>
                  </div>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-400">No hay estudiantes inscritos</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-4 bg-secondary-700/50 rounded-lg hover:bg-secondary-700/70 transition-all duration-300 border border-transparent hover:border-primary-500/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {enrollment.student?.first_name} {enrollment.student?.last_name}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                            <span>{enrollment.student?.email}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnrollmentStatusBadge(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Progreso</span>
                            <span className="font-semibold">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                        Inscrito: {formatDate(enrollment.enrolled_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-600/50">
          <button
            onClick={onClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};