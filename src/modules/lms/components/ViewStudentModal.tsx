import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEnvelope,
  faCalendar,
  faUser,
  faPhone,
  faBuilding,
  faIdCard,
  faIndustry,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types';
import { studentsService } from '../services';

interface ViewStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewStudentModal = ({
  student: initialStudent,
  isOpen,
  onClose,
}: ViewStudentModalProps) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && initialStudent) {
      loadStudentDetails();
    }
  }, [isOpen, initialStudent]);

  const loadStudentDetails = async () => {
    if (!initialStudent) return;

    try {
      setLoading(true);
      setError('');
      // Cargar los detalles completos del estudiante desde la API
      const studentDetails = await studentsService.getById(initialStudent.id);
      setStudent(studentDetails);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los detalles del estudiante');
      console.error('Error loading student details:', err);
      // Si falla, usar los datos iniciales
      setStudent(initialStudent);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !initialStudent) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-700 bg-opacity-20 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {student?.first_name.charAt(0) || initialStudent.first_name.charAt(0)}
                {student?.last_name.charAt(0) || initialStudent.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">
                {student?.first_name || initialStudent.first_name} {student?.last_name || initialStudent.last_name}
              </h2>
              <p className="text-purple-100 text-sm">ID: {student?.id || initialStudent.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-400">Cargando detalles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : null}

          {student && (
            <>
              {/* Información Personal */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2 mb-4">
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="font-semibold text-white pl-6">{student.email}</p>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FontAwesomeIcon icon={faPhone} />
                      <span className="text-sm font-medium">Teléfono</span>
                    </div>
                    <p className="font-semibold text-white pl-6">{student.phone || 'No registrado'}</p>
                  </div>

                  {/* Documento */}
                  {student.document_number && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FontAwesomeIcon icon={faIdCard} />
                        <span className="text-sm font-medium">Número de Documento</span>
                      </div>
                      <p className="font-semibold text-white pl-6">{student.document_number}</p>
                    </div>
                  )}

                  {/* Estado */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FontAwesomeIcon icon={faUser} />
                      <span className="text-sm font-medium">Estado</span>
                    </div>
                    <div className="pl-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          student.state === 'activo'
                            ? 'bg-success/20 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {student.state.charAt(0).toUpperCase() + student.state.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de la Compañía */}
              {student.company && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2 mb-4">
                    Información de la Compañía
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre de la compañía */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FontAwesomeIcon icon={faBuilding} />
                        <span className="text-sm font-medium">Compañía</span>
                      </div>
                      <p className="font-semibold text-white pl-6">{student.company.name}</p>
                    </div>

                    {/* Industria */}
                    {student.company.industry && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FontAwesomeIcon icon={faIndustry} />
                          <span className="text-sm font-medium">Industria</span>
                        </div>
                        <p className="font-semibold text-white pl-6">{student.company.industry}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Inscripciones */}
              {student.enrollments && student.enrollments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2 mb-4">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                    Cursos Inscritos ({student.enrollments.length})
                  </h3>
                  <div className="space-y-3">
                    {student.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.enrollment_id}
                        className="bg-secondary-600/30 rounded-lg p-4 border border-secondary-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">{enrollment.course_title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                                <span>
                                  {new Date(enrollment.enrollment_date).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  enrollment.status === 'active'
                                    ? 'bg-success/20 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {enrollment.status === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fechas del sistema */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white border-b border-secondary-200 pb-2 mb-4">
                  Información del Sistema
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span className="text-sm font-medium">Fecha de Registro</span>
                  </div>
                  <p className="font-semibold text-white pl-6">
                    {formatDate(student.created_at)}
                  </p>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card p-4 text-center bg-primary-900/20">
                  <p className="text-2xl font-bold text-blue-600">
                    {student.enrollments?.length || 0}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Cursos Inscritos</p>
                </div>
                <div className="card p-4 text-center bg-success/20">
                  <p className="text-2xl font-bold text-green-600">
                    {student.enrollments?.filter(e => e.status === 'completed').length || 0}
                  </p>
                  <p className="text-xs text-green-700 mt-1">Cursos Completados</p>
                </div>
                <div className="card p-4 text-center bg-purple-900/20">
                  <p className="text-2xl font-bold text-purple-600">
                    {student.state === 'activo' ? 'Activo' : 'Inactivo'}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Estado Actual</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200 bg-secondary-600/50 flex justify-end">
          <button
            onClick={onClose}
            className="btn bg-secondary-600 text-white hover:bg-secondary-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
