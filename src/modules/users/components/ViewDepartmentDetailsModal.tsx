import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBuilding, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Department, DepartmentDetailsResponse, Employee } from '../types';
import { getDepartmentById } from '../services';
import { EmployeeCard } from './EmployeeCard';
import { ViewEmployeeDetailsModal } from './ViewEmployeeDetailsModal';
import { useLockBodyScroll } from '../../../shared/hooks';
import { Portal } from '../../../shared/components/Portal';

interface ViewDepartmentDetailsModalProps {
  department: Department;
  onClose: () => void;
}

export const ViewDepartmentDetailsModal = ({ department, onClose }: ViewDepartmentDetailsModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useLockBodyScroll();

  const [departmentDetails, setDepartmentDetails] = useState<DepartmentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadDepartmentDetails();
  }, [department.id]);

  const loadDepartmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartmentById(department.id);
      setDepartmentDetails(data);
    } catch (err: any) {
      console.error('Error al cargar detalles del departamento:', err);
      setError(err.message || 'Error al cargar los detalles del departamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBuilding} className="text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gradient">{department.department_name}</h2>
                  <p className="text-gray-400 text-sm">ID: {department.id}</p>
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
          <div className="p-6">
            {/* Descripción */}
            <div className="bg-secondary-700/50 rounded-lg p-5 border border-gray-700/50 mb-6">
              <h3 className="text-lg font-heading font-bold text-white mb-3">Descripción</h3>
              <p className="text-gray-300">{department.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Fecha de Creación</p>
                  <p className="text-white">{new Date(department.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Última Actualización</p>
                  <p className="text-white">{new Date(department.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Lista de Empleados */}
            <div className="bg-secondary-700/50 rounded-lg p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
                  Empleados del Departamento
                </h3>
                {departmentDetails && departmentDetails.employees && (
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium border border-primary-500/30">
                    {departmentDetails.employees.length} empleados
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary-400 animate-spin" />
                  <span className="ml-3 text-gray-400">Cargando empleados...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              ) : departmentDetails && departmentDetails.employees && departmentDetails.employees.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {departmentDetails.employees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onViewDetails={setSelectedEmployee}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faUsers} className="text-5xl text-gray-600 mb-3" />
                  <p className="text-gray-400">No hay empleados en este departamento</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700/50 bg-secondary-700/30">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Empleado */}
      {selectedEmployee && (
        <ViewEmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
    </Portal>
  );
};
