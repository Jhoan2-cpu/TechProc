import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEnvelope,
  faMapMarkerAlt,
  faCalendar,
  faCheckCircle,
  faTimesCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types';

interface ViewStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewStudentModal = ({
  student,
  isOpen,
  onClose,
}: ViewStudentModalProps) => {
  if (!isOpen || !student) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
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
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-700 bg-opacity-20 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">
                {student.first_name} {student.last_name}
              </h2>
              <p className="text-purple-100 text-sm">ID: {student.id}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="text-sm font-medium">Correo Electrónico</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{student.email}</p>
                {student.email_verified_at ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-success/20 px-2 py-1 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Verificado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-600 bg-danger/20 px-2 py-1 rounded-full">
                    <FontAwesomeIcon icon={faTimesCircle} />
                    No verificado
                  </span>
                )}
              </div>
            </div>

            {/* País */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span className="text-sm font-medium">País</span>
              </div>
              <p className="font-semibold text-white">{student.country_location}</p>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faUser} />
                <span className="text-sm font-medium">Estado</span>
              </div>
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

            {/* Último acceso */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faCalendar} />
                <span className="text-sm font-medium">Último Acceso</span>
              </div>
              <p className="font-semibold text-white">
                {formatDate(student.last_access)}
              </p>
            </div>

            {/* Email verificado en */}
            {student.email_verified_at && (
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span className="text-sm font-medium">Email Verificado El</span>
                </div>
                <p className="font-semibold text-white">
                  {formatDate(student.email_verified_at)}
                </p>
              </div>
            )}
          </div>

          {/* Estadísticas adicionales */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              Información Adicional
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card p-4 text-center bg-primary-900/20">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-blue-700 mt-1">Cursos Inscritos</p>
              </div>
              <div className="card p-4 text-center bg-success/20">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-green-700 mt-1">Cursos Completados</p>
              </div>
              <div className="card p-4 text-center bg-purple-900/20">
                <p className="text-2xl font-bold text-purple-600">0%</p>
                <p className="text-xs text-purple-700 mt-1">Progreso Promedio</p>
              </div>
            </div>
          </div>
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
