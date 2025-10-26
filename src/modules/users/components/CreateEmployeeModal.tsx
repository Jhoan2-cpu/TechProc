import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { CreateEmployeeWithUserData, Position } from '../types';
import { createEmployeeWithUser } from '../services';
import { useLockBodyScroll } from '../../../shared/hooks';
import { Portal } from '../../../shared/components/Portal';

interface CreateEmployeeModalProps {
  departmentId: number;
  departmentName: string;
  positions: Position[];
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEmployeeModal = ({ departmentId, departmentName, positions, onClose, onSuccess }: CreateEmployeeModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useLockBodyScroll();

  const [formData, setFormData] = useState<CreateEmployeeWithUserData>({
    user: {
      first_name: '',
      last_name: '',
      dni: '',
      email: '',
      password: '',
      phone_number: '',
      address: '',
      birth_date: '',
      role: ['employee'],
      gender: 'male',
      country: 'Peru',
      country_location: 'Lima',
      timezone: 'America/Lima',
      status: 'active',
    },
    employee: {
      hire_date: '',
      position_id: 0,
      department_id: departmentId,
      employment_status: 'Active',
      schedule: 'Lunes a Viernes 8:00-17:00',
      speciality: '',
      salary: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validaciones
    if (!formData.user.first_name.trim() || !formData.user.last_name.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }

    if (!formData.user.dni.trim()) {
      setError('El DNI es obligatorio');
      return;
    }

    if (!formData.user.email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    if (!formData.user.password.trim() || formData.user.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.employee.hire_date) {
      setError('La fecha de contratación es obligatoria');
      return;
    }

    if (!formData.employee.position_id) {
      setError('Debe seleccionar un cargo');
      return;
    }

    if (!formData.employee.speciality.trim()) {
      setError('La especialidad es obligatoria');
      return;
    }

    if (formData.employee.salary <= 0) {
      setError('El salario debe ser mayor a 0');
      return;
    }

    try {
      setLoading(true);
      const response = await createEmployeeWithUser(formData);

      if (response.success) {
        alert(`Empleado creado exitosamente: ${response.data.user.full_name}`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Error al crear empleado:', err);

      // Manejar errores de validación del servidor
      if (err.details && typeof err.details === 'object') {
        setValidationErrors(err.details);
        setError('Por favor, corrija los errores en el formulario');
      } else {
        setError(err.message || 'Error al crear el empleado. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string | null => {
    if (validationErrors[field] && validationErrors[field].length > 0) {
      return validationErrors[field][0];
    }
    return null;
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-4xl w-full my-8 border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gradient">Agregar Empleado</h2>
              <p className="text-sm text-gray-400 mt-1">Departamento: {departmentName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg animate-slide-down">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Sección: Información Personal */}
          <div className="mb-6">
            <h3 className="text-lg font-heading font-bold text-white mb-4 pb-2 border-b border-gray-700/50">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.user.first_name}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, first_name: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Carlos"
                  disabled={loading}
                />
                {getFieldError('user.first_name') && (
                  <p className="text-danger text-xs mt-1">{getFieldError('user.first_name')}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Apellido <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.user.last_name}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, last_name: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Rodríguez"
                  disabled={loading}
                />
                {getFieldError('user.last_name') && (
                  <p className="text-danger text-xs mt-1">{getFieldError('user.last_name')}</p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  DNI <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.user.dni}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, dni: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="12345678"
                  disabled={loading}
                />
                {getFieldError('user.dni') && (
                  <p className="text-danger text-xs mt-1">{getFieldError('user.dni')}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.user.email}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="carlos@techproc.com"
                  disabled={loading}
                />
                {getFieldError('user.email') && (
                  <p className="text-danger text-xs mt-1">{getFieldError('user.email')}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.user.password}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, password: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  disabled={loading}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.user.phone_number}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, phone_number: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="+51987654321"
                  disabled={loading}
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.user.birth_date}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, birth_date: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Género</label>
                <select
                  value={formData.user.gender}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, gender: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                  disabled={loading}
                >
                  <option value="male" className="bg-secondary-700">Masculino</option>
                  <option value="female" className="bg-secondary-700">Femenino</option>
                  <option value="other" className="bg-secondary-700">Otro</option>
                </select>
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Dirección</label>
                <input
                  type="text"
                  value={formData.user.address}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, address: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Av. Principal 123, Lima"
                  disabled={loading}
                />
              </div>

              {/* Roles */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Roles <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.user.role.join(', ')}
                  onChange={(e) => {
                    const rolesArray = e.target.value
                      .split(',')
                      .map(role => role.trim())
                      .filter(role => role.length > 0);
                    setFormData({ ...formData, user: { ...formData.user, role: rolesArray } });
                  }}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Ingrese roles separados por comas"
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Puede asignar múltiples roles separados por comas. Ejemplos: <span className="text-primary-400">admin</span>, <span className="text-primary-400">lms</span>, <span className="text-primary-400">student</span>, <span className="text-primary-400">instructor</span>, <span className="text-primary-400">seg</span>, <span className="text-primary-400">infra</span>, <span className="text-primary-400">web</span>, <span className="text-primary-400">data</span>
                </p>
                {getFieldError('user.role') && (
                  <p className="text-danger text-xs mt-1">{getFieldError('user.role')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Información Laboral */}
          <div className="mb-6">
            <h3 className="text-lg font-heading font-bold text-white mb-4 pb-2 border-b border-gray-700/50">
              Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Contratación */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Fecha de Contratación <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.employee.hire_date}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, hire_date: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  disabled={loading}
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Cargo <span className="text-danger">*</span>
                </label>
                <select
                  required
                  value={formData.employee.position_id}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, position_id: Number(e.target.value) } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                  disabled={loading}
                >
                  <option value="0" className="bg-secondary-700">Seleccione un cargo</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id} className="bg-secondary-700">
                      {position.position_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado de Empleo */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Estado de Empleo <span className="text-danger">*</span>
                </label>
                <select
                  value={formData.employee.employment_status}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, employment_status: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                  disabled={loading}
                >
                  <option value="Active" className="bg-secondary-700">Activo</option>
                  <option value="Inactive" className="bg-secondary-700">Inactivo</option>
                </select>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Especialidad <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employee.speciality}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, speciality: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Análisis Financiero"
                  disabled={loading}
                />
              </div>

              {/* Salario */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Salario <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.employee.salary}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, salary: Number(e.target.value) } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="6500.00"
                  disabled={loading}
                />
              </div>

              {/* Horario */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Horario <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employee.schedule}
                  onChange={(e) => setFormData({ ...formData, employee: { ...formData.employee, schedule: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Lunes a Viernes 8:00-17:00"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Crear Empleado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};
