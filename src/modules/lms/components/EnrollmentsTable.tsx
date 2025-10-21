import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

// Tipo temporal para el diseño
interface Enrollment {
  id: string;
  student_name: string;
  academic_period: string;
  courses_count: number;
  instructor: string;
}

interface EnrollmentsTableProps {
  enrollments: Enrollment[];
  loading: boolean;
  onView?: (enrollment: Enrollment) => void;
  onEdit?: (enrollment: Enrollment) => void;
  onDelete?: (enrollment: Enrollment) => void;
}

export const EnrollmentsTable = ({
  enrollments,
  loading,
  onView,
  onEdit,
  onDelete
}: EnrollmentsTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando matrículas...</p>
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400 text-lg">No hay matrículas registradas</p>
        <p className="text-gray-500 text-sm mt-2">Haz clic en "Matricular" para comenzar</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-primary-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Período Académico
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Cantidad de Cursos
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Docente
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {enrollments.map((enrollment, index) => (
              <tr
                key={enrollment.id}
                className="hover:bg-primary-500/10 hover:shadow-md transition-all duration-200 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {enrollment.student_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {enrollment.academic_period}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-500/20 text-blue-400">
                    {enrollment.courses_count} {enrollment.courses_count === 1 ? 'curso' : 'cursos'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {enrollment.instructor}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(enrollment);
                        }}
                        className="p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all duration-200 hover:scale-110"
                        title="Ver detalles"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(enrollment);
                        }}
                        className="p-2 rounded-lg text-yellow-400 hover:text-white hover:bg-yellow-500/20 transition-all duration-200 hover:scale-110"
                        title="Editar matrícula"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(enrollment);
                        }}
                        className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                        title="Eliminar matrícula"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
