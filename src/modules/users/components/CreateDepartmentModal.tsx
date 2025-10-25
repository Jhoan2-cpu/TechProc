import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { CreateDepartmentData } from '../types';
import { createDepartment } from '../services';
import { useLockBodyScroll } from '../../../shared/hooks';
import { Portal } from '../../../shared/components/Portal';

interface CreateDepartmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDepartmentModal = ({ onClose, onSuccess }: CreateDepartmentModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useLockBodyScroll();

  const [formData, setFormData] = useState<CreateDepartmentData>({
    department_name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.department_name.trim()) {
      setError('El nombre del departamento es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    try {
      setLoading(true);
      const response = await createDepartment(formData);

      if (response.id) {
        alert(`Departamento creado exitosamente. ID: ${response.id}`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Error al crear departamento:', err);
      setError(err.message || 'Error al crear el departamento. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-md w-full border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-gradient">Crear Departamento</h2>
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

          <div className="space-y-4">
            {/* Nombre del Departamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nombre del Departamento <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.department_name}
                onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Ej: Recursos Humanos"
                disabled={loading}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Descripción <span className="text-danger">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                placeholder="Describe las funciones del departamento..."
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex gap-3 justify-end">
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
                  Crear Departamento
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
