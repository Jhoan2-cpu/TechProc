import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUsers, faSpinner, faArrowLeft, faCalendar, faInfoCircle, faBriefcase, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb } from '../../../shared/components/Breadcrumb';
import type { DepartmentDetailsResponse, Employee, Position } from '../types';
import { getDepartmentById, getPositionsByDepartment } from '../services';
import { EmployeeCard, ViewEmployeeDetailsModal, PositionCard, CreatePositionModal, EditPositionModal } from '../components';

export const DepartmentDetailsPage = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [departmentDetails, setDepartmentDetails] = useState<DepartmentDetailsResponse | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCreatePositionModal, setShowCreatePositionModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (departmentId) {
      loadDepartmentDetails();
      loadPositions();
    }
  }, [departmentId]);

  const loadDepartmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartmentById(Number(departmentId));
      setDepartmentDetails(data);
    } catch (err: any) {
      console.error('Error al cargar detalles del departamento:', err);
      setError(err.message || 'Error al cargar los detalles del departamento');
    } finally {
      setLoading(false);
    }
  };

  const loadPositions = async () => {
    try {
      setLoadingPositions(true);
      const data = await getPositionsByDepartment(Number(departmentId));
      setPositions(data);
    } catch (err: any) {
      console.error('Error al cargar posiciones:', err);
    } finally {
      setLoadingPositions(false);
    }
  };

  const handlePositionSuccess = () => {
    loadPositions();
  };

  const breadcrumbItems = [
    { label: 'Usuarios', path: '/users' },
    { label: 'Empleados', path: '/users/employees' },
    { label: departmentDetails?.department_name || 'Departamento', path: `/users/employees/department/${departmentId}` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="text-5xl text-primary-400 animate-spin" />
            <span className="ml-4 text-xl text-gray-400">Cargando detalles del departamento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !departmentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 p-6 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger">{error || 'Departamento no encontrado'}</p>
            <button
              onClick={() => navigate('/users/employees')}
              className="mt-4 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-all duration-300"
            >
              Volver a Empleados
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />

          <button
            onClick={() => navigate('/users/employees')}
            className="mt-6 mb-4 px-4 py-2 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver a Empleados</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-3xl text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
                {departmentDetails.department_name}
              </h1>
              <p className="text-gray-400 text-sm">ID: {departmentDetails.id}</p>
            </div>
          </div>
        </div>

        {/* Información del Departamento */}
        <div className="mb-8 bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-50/30 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faInfoCircle} className="text-primary-400 text-xl" />
            <h2 className="text-2xl font-heading font-bold text-white">Descripción</h2>
          </div>
          <p className="text-gray-300 mb-6">{departmentDetails.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-400 text-lg" />
              <div>
                <p className="text-sm text-gray-400">Fecha de Creación</p>
                <p className="text-white font-medium">
                  {new Date(departmentDetails.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-400 text-lg" />
              <div>
                <p className="text-sm text-gray-400">Última Actualización</p>
                <p className="text-white font-medium">
                  {new Date(departmentDetails.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUsers} className="text-primary-400 text-lg" />
              <div>
                <p className="text-sm text-gray-400">Total de Empleados</p>
                <p className="text-white font-medium text-2xl">
                  {departmentDetails.employees?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Cargos/Posiciones */}
        <div className="mb-8 bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-50/30 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faBriefcase} className="text-purple-400" />
              Cargos del Departamento
            </h2>
            <button
              onClick={() => setShowCreatePositionModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Crear Cargo</span>
            </button>
          </div>

          {loadingPositions ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary-400 animate-spin" />
              <span className="ml-3 text-gray-400">Cargando cargos...</span>
            </div>
          ) : positions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {positions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  onEdit={setSelectedPosition}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBriefcase} className="text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">No hay cargos definidos en este departamento</p>
              <button
                onClick={() => setShowCreatePositionModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium inline-flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Crear Primer Cargo</span>
              </button>
            </div>
          )}
        </div>

        {/* Lista de Empleados */}
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-50/30 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
              Empleados del Departamento
            </h2>
            {departmentDetails.employees && departmentDetails.employees.length > 0 && (
              <span className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium border border-primary-500/30">
                {departmentDetails.employees.length} empleado{departmentDetails.employees.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {departmentDetails.employees && departmentDetails.employees.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No hay empleados en este departamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles del Empleado */}
      {selectedEmployee && (
        <ViewEmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Modal de Crear Cargo */}
      {showCreatePositionModal && departmentDetails && (
        <CreatePositionModal
          departmentId={departmentDetails.id}
          departmentName={departmentDetails.department_name}
          onClose={() => setShowCreatePositionModal(false)}
          onSuccess={handlePositionSuccess}
        />
      )}

      {/* Modal de Editar Cargo */}
      {selectedPosition && departmentDetails && (
        <EditPositionModal
          position={selectedPosition}
          departmentId={departmentDetails.id}
          departmentName={departmentDetails.department_name}
          onClose={() => setSelectedPosition(null)}
          onSuccess={handlePositionSuccess}
        />
      )}
    </div>
  );
};
