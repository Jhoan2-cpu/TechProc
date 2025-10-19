import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CreateInstructorData } from '../types';

interface CreateInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateInstructorData) => Promise<void>;
}

export const CreateInstructorModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateInstructorModalProps) => {
  const [formData, setFormData] = useState<CreateInstructorData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    document_number: '',
    bio: '',
    expertise_area: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el instructor');
      console.error('Error creating instructor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone_number: '',
      document_number: '',
      bio: '',
      expertise_area: '',
      status: 'active',
    });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Agregar Nuevo Instructor
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
                Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="input"
                placeholder="Nombre del instructor"
                disabled={loading}
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                placeholder="Apellido del instructor"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Mínimo 6 caracteres"
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
                name="phone_number"
                value={formData.phone_number}
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

            {/* Área de Expertise */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Área de Expertise *
              </label>
              <input
                type="text"
                name="expertise_area"
                required
                value={formData.expertise_area}
                onChange={handleChange}
                className="input"
                placeholder="Ej: JavaScript, React, Node.js"
                disabled={loading}
              />
            </div>

            {/* Biografía */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía *
              </label>
              <textarea
                name="bio"
                required
                value={formData.bio}
                onChange={handleChange}
                className="input min-h-[120px]"
                placeholder="Describe la experiencia, especialidades y logros del instructor..."
                disabled={loading}
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado *
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

          <div className="bg-primary-900/20 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Se creará un usuario con las credenciales proporcionadas. El instructor podrá iniciar sesión con el email y contraseña ingresados.
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
                  Creando...
                </span>
              ) : (
                'Crear Instructor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
