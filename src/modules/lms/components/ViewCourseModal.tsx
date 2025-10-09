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
} from '@fortawesome/free-solid-svg-icons';
import type { Course, Enrollment } from '../types';
import { enrollmentsService } from '../services';

interface ViewCourseModalProps {
  course: Course;
  onClose: () => void;
}

export const ViewCourseModal = ({ course, onClose }: ViewCourseModalProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => {
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

    fetchEnrollments();
  }, [course.id]);

  const getStatusBadge = (status: string) => {
    const styles = {
      publicado: 'bg-success/20 text-green-700',
      borrador: 'bg-warning/20 text-yellow-700',
      archivado: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.borrador;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold text-white">
              {course.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Detalles del curso
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-400 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda - Detalles del Curso */}
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-semibold text-white border-b pb-2">
                Detalles del Curso
              </h3>

              {/* Información básica */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faCode} className="text-primary-600" />
                    Código del Curso
                  </label>
                  <div className="p-3 bg-secondary-600/50 rounded-lg">
                    <p className="text-white font-semibold">{course.code}</p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600" />
                    Instructor
                  </label>
                  <div className="p-3 bg-secondary-600/50 rounded-lg">
                    <p className="text-white">
                      {course.instructor
                        ? `${course.instructor.first_name} ${course.instructor.last_name}`
                        : 'No asignado'}
                    </p>
                    {course.instructor?.email && (
                      <p className="text-sm text-gray-400 mt-1">{course.instructor.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                      Duración
                    </label>
                    <div className="p-3 bg-secondary-600/50 rounded-lg">
                      <p className="text-white font-semibold">{course.duration_weeks} sesiones</p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
                      Precio
                    </label>
                    <div className="p-3 bg-secondary-600/50 rounded-lg">
                      <p className="text-white font-semibold">S/. {course.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-orange-600" />
                    Descripción
                  </label>
                  <div className="p-4 bg-secondary-600/50 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{course.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
                      Creación
                    </label>
                    <p className="text-sm text-white">{formatDate(course.created_at)}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
                      Actualización
                    </label>
                    <p className="text-sm text-white">{formatDate(course.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Estudiantes Inscritos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
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
                <div className="text-center py-12 bg-secondary-600/50 rounded-lg">
                  <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-400">No hay estudiantes inscritos</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-4 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary-500/20"
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