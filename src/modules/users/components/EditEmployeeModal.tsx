import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Employee, Department, Position, UpdateEmployeeData } from '../types';
import { updateEmployee } from '../services/employeesService';
import { getDepartments } from '../services/departmentsService';
import { getPositionsByDepartment } from '../services/positionsService';

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditEmployeeModal = ({ employee, onClose, onSuccess }: EditEmployeeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [formData, setFormData] = useState<UpdateEmployeeData>({
    hire_date: employee.hire_date || '',
    position_id: employee.position_id || 0,
    department_id: employee.department_id || 0,
    employment_status: employee.employment_status || 'Active',
    schedule: employee.schedule || '',
    speciality: employee.speciality || '',
    salary: typeof employee.salary === 'number' ? employee.salary : parseFloat(employee.salary) || 0,
  });

  // Cargar departamentos al montar el componente
  useEffect(() => {
    loadDepartments();
  }, []);

  // Cargar posiciones cuando cambia el departamento
  useEffect(() => {
    if (formData.department_id > 0) {
      loadPositions(formData.department_id);
    }
  }, [formData.department_id]);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      console.error('Error al cargar departamentos:', err);
      setError('Error al cargar los departamentos');
    } finally {
      setLoadingDepartments(false);
    }
  };

  const loadPositions = async (departmentId: number) => {
    try {
      setLoadingPositions(true);
      const data = await getPositionsByDepartment(departmentId);
      setPositions(data);
    } catch (err: any) {
      console.error('Error al cargar posiciones:', err);
      setPositions([]);
    } finally {
      setLoadingPositions(false);
    }
  };

  const handleDepartmentChange = (departmentId: number) => {
    setFormData(prev => ({
      ...prev,
      department_id: departmentId,
      position_id: 0, // Resetear posición cuando cambia el departamento
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validaciones básicas
    if (!formData.hire_date) {
      setFieldErrors(prev => ({ ...prev, hire_date: 'La fecha de contratación es requerida' }));
      return;
    }

    if (formData.department_id === 0) {
      setFieldErrors(prev => ({ ...prev, department_id: 'Debe seleccionar un departamento' }));
      return;
    }

    if (formData.position_id === 0) {
      setFieldErrors(prev => ({ ...prev, position_id: 'Debe seleccionar un cargo' }));
      return;
    }

    if (!formData.schedule) {
      setFieldErrors(prev => ({ ...prev, schedule: 'El horario es requerido' }));
      return;
    }

    if (!formData.speciality) {
      setFieldErrors(prev => ({ ...prev, speciality: 'La especialidad es requerida' }));
      return;
    }

    if (formData.salary <= 0) {
      setFieldErrors(prev => ({ ...prev, salary: 'El salario debe ser mayor a 0' }));
      return;
    }

    try {
      setLoading(true);
      await updateEmployee(employee.id, formData);
      alert('Empleado actualizado exitosamente');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al actualizar empleado:', err);

      // Manejar errores del servidor
      if (err.errors) {
        const errors: Record<string, string> = {};
        Object.keys(err.errors).forEach(key => {
          errors[key] = err.errors[key].join(', ');
        });
        setFieldErrors(errors);
      }

      setError(err.message || 'Error al actualizar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl w-full max-w-2xl border border-primary-50/20 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            Editar Empleado: {employee.user?.full_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Error general */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Fecha de Contratación */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Contratación *
              </label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
                className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              {fieldErrors.hire_date && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.hire_date}</p>
              )}
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Departamento *
              </label>
              {loadingDepartments ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Cargando departamentos...</span>
                </div>
              ) : (
                <select
                  value={formData.department_id}
                  onChange={(e) => handleDepartmentChange(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Seleccionar departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              )}
              {fieldErrors.department_id && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.department_id}</p>
              )}
            </div>

            {/* Cargo/Posición */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cargo *
              </label>
              {loadingPositions ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Cargando cargos...</span>
                </div>
              ) : (
                <select
                  value={formData.position_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, position_id: Number(e.target.value) }))}
                  className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={formData.department_id === 0}
                >
                  <option value={0}>
                    {formData.department_id === 0
                      ? 'Primero seleccione un departamento'
                      : positions.length === 0
                        ? 'No hay cargos en este departamento'
                        : 'Seleccionar cargo'}
                  </option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.position_name}
                    </option>
                  ))}
                </select>
              )}
              {fieldErrors.position_id && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.position_id}</p>
              )}
            </div>

            {/* Estado de Empleo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado de Empleo *
              </label>
              <select
                value={formData.employment_status}
                onChange={(e) => setFormData(prev => ({ ...prev, employment_status: e.target.value }))}
                className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </select>
              {fieldErrors.employment_status && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.employment_status}</p>
              )}
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Especialidad *
              </label>
              <input
                type="text"
                value={formData.speciality}
                onChange={(e) => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
                className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Desarrollo de Software"
                required
              />
              {fieldErrors.speciality && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.speciality}</p>
              )}
            </div>

            {/* Salario */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Salario *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: 5000.00"
                required
              />
              {fieldErrors.salary && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.salary}</p>
              )}
            </div>

            {/* Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Horario *
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                className="w-full px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Lunes a Viernes 8:00-17:00"
                required
              />
              {fieldErrors.schedule && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.schedule}</p>
              )}
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg
                       transition-all duration-300 font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg
                       shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105
                       transition-all duration-300 font-medium flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
