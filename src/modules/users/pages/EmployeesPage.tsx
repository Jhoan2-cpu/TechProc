import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb } from '../../../shared/components/Breadcrumb';
import type { Department } from '../types';
import { getDepartments } from '../services';
import {
  DepartmentCard,
  CreateDepartmentModal,
} from '../components';

export const EmployeesPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      console.error('Error al cargar departamentos:', err);
      setError(err.message || 'Error al cargar los departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadDepartments();
  };

  const breadcrumbItems = [
    { label: 'Usuarios', path: '/users' },
    { label: 'Empleados', path: '/users/employees' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
                Gestión de Empleados
              </h1>
              <p className="text-gray-400">
                Administra los departamentos y empleados de la organización
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2 justify-center"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Crear Departamento</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-50/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1 font-medium">Total de Departamentos</p>
                <p className="text-4xl font-heading font-bold text-primary-400">{departments.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-white/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faBuilding} className="text-3xl text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="text-5xl text-primary-400 animate-spin" />
            <span className="ml-4 text-xl text-gray-400">Cargando departamentos...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger">{error}</p>
            <button
              onClick={loadDepartments}
              className="mt-4 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-all duration-300"
            >
              Reintentar
            </button>
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faBuilding} className="text-7xl text-gray-600 mb-6" />
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              No hay departamentos registrados
            </h3>
            <p className="text-gray-400 mb-6">
              Comienza creando tu primer departamento
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Crear Primer Departamento</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};
