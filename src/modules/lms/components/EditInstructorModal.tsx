import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Instructor, UpdateInstructorData, ApiStatus } from '../types';

interface EditInstructorModalProps {
  instructor: Instructor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateInstructorData) => Promise<void>;
}

export const EditInstructorModal = ({
  instructor,
  isOpen,
  onClose,
  onSave,
}: EditInstructorModalProps) => {
  const [formData, setFormData] = useState<UpdateInstructorData>({
    bio: '',
    expertise_area: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (instructor) {
      // Mapear el status del frontend al formato de la API
      let apiStatus: ApiStatus = 'active';
      if (instructor.status === 'inactivo') {
        apiStatus = 'inactive';
      }

      setFormData({
        bio: instructor.bio,
        expertise_area: instructor.expertise_area,
        status: apiStatus,
      });
      setError('');
    }
  }, [instructor]);

  if (!isOpen || !instructor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(instructor.id, formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el instructor');
      console.error('Error updating instructor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      bio: '',
      expertise_area: '',
      status: 'active',
    });
    setError('');
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Editar Instructor
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

          {/* Información no editable */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {instructor.first_name.charAt(0)}{instructor.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {instructor.name || `${instructor.first_name} ${instructor.last_name}`}
                </h3>
                <p className="text-gray-300 text-sm">{instructor.email}</p>
              </div>
            </div>
            <p className="text-sm text-blue-300">
              Los datos personales (nombre y email) no pueden ser editados desde aquí.
            </p>
          </div>

          <div className="space-y-4">
            {/* Área de Expertise */}
            <div>
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
                placeholder="Ej: JavaScript, React, Node.js, Python, Docker"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                Separa las áreas con comas
              </p>
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía *
              </label>
              <textarea
                name="bio"
                required
                value={formData.bio}
                onChange={handleChange}
                className="input min-h-[150px]"
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
