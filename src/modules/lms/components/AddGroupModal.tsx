import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faUsers, faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { CreateGroupData, GroupStatus } from '../types';
import { groupService } from '../services';

interface AddGroupModalProps {
  courseId: number;
  onClose: () => void;
  onSave: () => void;
}

export const AddGroupModal = ({ courseId, onClose, onSave }: AddGroupModalProps) => {
  const [formData, setFormData] = useState<CreateGroupData>({
    course_id: courseId,
    code: '',
    name: '',
    start_date: '',
    end_date: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.code.trim()) {
      setError('El código del grupo es requerido');
      return;
    }

    if (!formData.name.trim()) {
      setError('El nombre del grupo es requerido');
      return;
    }

    if (!formData.start_date) {
      setError('La fecha de inicio es requerida');
      return;
    }

    if (!formData.end_date) {
      setError('La fecha de fin es requerida');
      return;
    }

    // Validar que end_date sea posterior a start_date
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      setLoading(true);
      await groupService.create(formData);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateGroupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-2xl font-heading font-bold text-white">
            Crear Nuevo Grupo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Código del Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código del Grupo *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="Ej: GRP-TARDE-01, GRP-NOCHE-A"
                required
              />
            </div>

            {/* Nombre del Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary-400" />
                Nombre del Grupo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="Ej: Grupo Tarde - Turno A"
                required
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 text-primary-400" />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="input w-full bg-secondary-500 border-secondary-400 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 text-primary-400" />
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="input w-full bg-secondary-500 border-secondary-400 text-white"
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as GroupStatus)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white"
                required
              >
                <option value="draft">Borrador</option>
                <option value="approved">Aprobado</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-600/50">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btn bg-primary-600 text-white hover:bg-primary-700"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Guardando...' : 'Crear Grupo'}
          </button>
        </div>
      </div>
    </div>
  );
};
