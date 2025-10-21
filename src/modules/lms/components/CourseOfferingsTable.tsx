import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { CourseOffering } from '../types';

interface CourseOfferingsTableProps {
  offerings: CourseOffering[];
  loading: boolean;
  onDelete: (offering: CourseOffering) => void;
}

export const CourseOfferingsTable = ({ offerings, loading, onDelete }: CourseOfferingsTableProps) => {
  const getDeliveryMethodText = (method: string) => {
    switch (method) {
      case 'regular': return 'Presencial';
      case 'online': return 'En línea';
      case 'hybrid': return 'Híbrido';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (offerings.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400 text-lg">No hay ofertas de cursos registradas</p>
        <p className="text-gray-500 text-sm mt-2">Haz clic en "Crear Oferta" para comenzar</p>
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
                Curso
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Periodo
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Modalidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {offerings.map((offering, index) => (
              <tr
                key={offering.id}
                className="hover:bg-primary-500/10 hover:shadow-md transition-all duration-200 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {offering.course?.title || 'Curso sin título'}
                    </div>
                    <div className="text-sm text-gray-400">
                      ID: {offering.course?.id || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {offering.academic_period?.name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {offering.instructor && offering.instructor.first_name && offering.instructor.last_name
                      ? `${offering.instructor.first_name} ${offering.instructor.last_name}`
                      : 'Sin asignar'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300">
                    {offering.schedule || 'No especificado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    offering.delivery_method === 'regular'
                      ? 'bg-blue-500/20 text-blue-400'
                      : offering.delivery_method === 'online'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {getDeliveryMethodText(offering.delivery_method)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(offering);
                    }}
                    className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                    title="Eliminar oferta"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
