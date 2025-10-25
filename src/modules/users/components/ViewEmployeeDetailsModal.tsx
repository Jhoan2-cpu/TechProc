import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faMapMarkerAlt, faBriefcase, faCalendar, faDollarSign, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import type { Employee } from '../types';
import { useLockBodyScroll } from '../../../shared/hooks';
import { Portal } from '../../../shared/components/Portal';

interface ViewEmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
}

export const ViewEmployeeDetailsModal = ({ employee, onClose }: ViewEmployeeDetailsModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useLockBodyScroll();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: string) => {
    return `S/. ${parseFloat(salary).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full border-2 border-primary-500/30 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-3xl text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-gradient">{employee.user.full_name}</h2>
                <p className="text-gray-400">{employee.position.position_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Estado del Empleado */}
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full font-medium ${
              employee.employment_status === 'Active'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {employee.employment_status}
            </span>
            <span className="text-gray-400 text-sm">ID: {employee.employee_id}</span>
          </div>

          {/* Información Personal */}
          <div className="bg-secondary-700/50 rounded-lg p-5 border border-gray-700/50">
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-primary-400" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
                  {employee.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Teléfono</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-primary-400" />
                  {employee.user.phone_number || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">DNI</p>
                <p className="text-white">{employee.user.dni || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Fecha de Nacimiento</p>
                <p className="text-white">
                  {employee.user.birth_date ? formatDate(employee.user.birth_date) : 'No especificado'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Dirección</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-400" />
                  {employee.user.address || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="bg-secondary-700/50 rounded-lg p-5 border border-gray-700/50">
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} className="text-primary-400" />
              Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Cargo</p>
                <p className="text-white font-semibold">{employee.position.position_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Fecha de Contratación</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                  {formatDate(employee.hire_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Salario</p>
                <p className="text-white flex items-center gap-2 font-semibold">
                  <FontAwesomeIcon icon={faDollarSign} className="text-green-400" />
                  {formatSalary(employee.salary)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Especialidad</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-primary-400" />
                  {employee.speciality}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Horario</p>
                <p className="text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                  {employee.schedule}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="bg-secondary-700/50 rounded-lg p-5 border border-gray-700/50">
            <h3 className="text-lg font-heading font-bold text-white mb-4">Información del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {employee.user.role.map((role, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded border border-primary-500/30"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Estado de Usuario</p>
                <span className={`inline-block px-3 py-1 rounded-full ${
                  employee.user.status === 'active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {employee.user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Creado</p>
                <p className="text-white">{formatDate(employee.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Última Actualización</p>
                <p className="text-white">{formatDate(employee.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 bg-secondary-700/30">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
};
