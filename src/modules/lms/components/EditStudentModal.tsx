import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Student, UpdateStudentData, Company } from '../types';
import { companiesService } from '../services';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentId: string, data: UpdateStudentData) => Promise<void>;
}

export const EditStudentModal = ({
  student,
  isOpen,
  onClose,
  onSave,
}: EditStudentModalProps) => {
  const [formData, setFormData] = useState<UpdateStudentData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    document_number: '',
    company_id: undefined,
    status: 'active',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar compañías y datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (isOpen && student) {
      loadCompanies();
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone || '',
        document_number: student.document_number || '',
        company_id: student.company?.id,
        status: student.state === 'activo' ? 'active' : 'inactive',
      });
    }
  }, [isOpen, student]);

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await companiesService.getAll();
      setCompanies(response.companies);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Error al cargar las compañías');
    } finally {
      setLoadingCompanies(false);
    }
  };

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(student.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estudiante');
      console.error('Error updating student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convertir company_id a número si existe
    if (name === 'company_id') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Editar Estudiante
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input"
                placeholder="Nombre del estudiante"
                disabled={loading}
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                placeholder="Apellido del estudiante"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+51 999999999"
                disabled={loading}
              />
            </div>

            {/* Número de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número de Documento
              </label>
              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                className="input"
                placeholder="DNI, Pasaporte, etc."
                disabled={loading}
              />
            </div>

            {/* Compañía */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Compañía
              </label>
              <select
                name="company_id"
                value={formData.company_id || ''}
                onChange={handleChange}
                className="select"
                disabled={loading || loadingCompanies}
              >
                <option value="">Sin compañía</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {loadingCompanies && (
                <p className="text-xs text-gray-400 mt-1">Cargando compañías...</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select"
                disabled={loading}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-400">
              <strong>Nota:</strong> Los campos que no modifiques mantendrán sus valores actuales.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </span>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
