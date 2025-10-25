import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Position, UpdatePositionData } from '../types';
import { updatePosition } from '../services';

interface EditPositionModalProps {
  position: Position;
  departmentId: number;
  departmentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditPositionModal = ({ position, departmentId, departmentName, onClose, onSuccess }: EditPositionModalProps) => {
  const [formData, setFormData] = useState<UpdatePositionData>({
    position_name: position.position_name,
    department_id: departmentId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.position_name.trim()) {
      setError('El nombre del cargo es obligatorio');
      return;
    }

    try {
      setLoading(true);
      const response = await updatePosition(position.id, formData);

      if (response.id) {
        alert(`Cargo actualizado exitosamente: ${response.position_name}`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('Error al actualizar cargo:', err);
      setError(err.message || 'Error al actualizar el cargo. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-md w-full border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gradient">Editar Cargo</h2>
              <p className="text-sm text-gray-400 mt-1">Para: {departmentName}</p>
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

          <div className="space-y-4">
            {/* ID del Cargo */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                ID del Cargo
              </label>
              <input
                type="text"
                value={position.id}
                className="w-full px-4 py-3 bg-secondary-700/80 border border-gray-700/50 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Nombre del Cargo */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nombre del Cargo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.position_name}
                onChange={(e) => setFormData({ ...formData, position_name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Ej: Desarrollador Senior"
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
                  Guardando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
