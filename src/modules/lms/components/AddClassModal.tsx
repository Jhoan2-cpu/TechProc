import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faVideo, faCalendar, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import type { CreateClassData, ClassStatus, Group } from '../types';
import { classService, groupService } from '../services';

interface AddClassModalProps {
  groupId?: number;
  courseId?: number;
  onClose: () => void;
  onSave: () => void;
}

export const AddClassModal = ({ groupId, courseId, onClose, onSave }: AddClassModalProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [formData, setFormData] = useState<CreateClassData>({
    group_id: groupId || 0,
    class_name: '',
    meeting_url: '',
    description: '',
    class_date: '',
    start_time: '',
    end_time: '',
    class_status: 'SCHEDULED',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId && !groupId) {
      fetchGroups();
    }
  }, [courseId, groupId]);

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const groupsData = await groupService.getByCourseId(courseId!);
      setGroups(groupsData);
      if (groupsData.length > 0 && !groupId) {
        setFormData(prev => ({ ...prev, group_id: groupsData[0].id }));
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.class_name.trim()) {
      setError('El nombre de la clase es requerido');
      return;
    }

    if (!formData.meeting_url.trim()) {
      setError('La URL de la reunión es requerida');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!formData.class_date) {
      setError('La fecha de la clase es requerida');
      return;
    }

    if (!formData.start_time) {
      setError('La hora de inicio es requerida');
      return;
    }

    if (!formData.end_time) {
      setError('La hora de fin es requerida');
      return;
    }

    try {
      setLoading(true);
      await classService.create(formData);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear la clase');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateClassData, value: string) => {
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
            Agregar Nueva Clase
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
            {/* Selector de Grupo */}
            {courseId && !groupId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary-400" />
                  Grupo *
                </label>
                {loadingGroups ? (
                  <div className="text-center py-2">
                    <p className="text-gray-400 text-sm">Cargando grupos...</p>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm">No hay grupos disponibles para este curso</p>
                  </div>
                ) : (
                  <select
                    value={formData.group_id}
                    onChange={(e) => handleChange('group_id', e.target.value)}
                    className="input w-full bg-secondary-500 border-secondary-400 text-white"
                    required
                  >
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name} ({group.code})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Nombre de la clase */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la Clase *
              </label>
              <input
                type="text"
                value={formData.class_name}
                onChange={(e) => handleChange('class_name', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="Ej: Sesión 1: Introducción a Laravel"
                required
              />
            </div>

            {/* URL de la reunión */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faVideo} className="mr-2 text-primary-400" />
                URL de la Reunión *
              </label>
              <input
                type="url"
                value={formData.meeting_url}
                onChange={(e) => handleChange('meeting_url', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="https://meet.google.com/abc-defg-hij"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="Describe el contenido de esta clase..."
                rows={4}
                required
              />
            </div>

            {/* Fecha de la clase */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-2 text-primary-400" />
                Fecha de la Clase *
              </label>
              <input
                type="date"
                value={formData.class_date}
                onChange={(e) => handleChange('class_date', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white"
                required
              />
            </div>

            {/* Horario */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-primary-400" />
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className="input w-full bg-secondary-500 border-secondary-400 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-primary-400" />
                  Hora de Fin *
                </label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
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
                value={formData.class_status}
                onChange={(e) => handleChange('class_status', e.target.value as ClassStatus)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white"
                required
              >
                <option value="SCHEDULED">Programada</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
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
            {loading ? 'Guardando...' : 'Guardar Clase'}
          </button>
        </div>
      </div>
    </div>
  );
};
