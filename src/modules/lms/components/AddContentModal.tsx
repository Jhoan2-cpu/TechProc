import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { courseContentsService } from '../services';
import type { CreateCourseContentData } from '../types';

interface AddContentModalProps {
  courseId: number;
  sessionNumber: number;
  existingContentsCount: number;
  onClose: () => void;
  onSave: () => void;
}

export const AddContentModal = ({
  courseId,
  sessionNumber,
  existingContentsCount,
  onClose,
  onSave,
}: AddContentModalProps) => {
  const [formData, setFormData] = useState<CreateCourseContentData>({
    course_id: courseId,
    session: sessionNumber,
    type: 'video',
    title: '',
    content: '',
    order_number: existingContentsCount + 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await courseContentsService.create(formData);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear el contenido');
      console.error('Error creating content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">
              Agregar Contenido
            </h2>
            <p className="text-sm text-gray-200 mt-1">
              Sesión {sessionNumber} - Orden {formData.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Tipo de Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Contenido *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="select"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="link">Enlace</option>
                <option value="anuncio">Anuncio</option>
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Contenido *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Ej: Routing en Laravel"
              />
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenido / Descripción *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input min-h-[120px]"
                placeholder="Describe el contenido o proporciona la URL del recurso..."
              />
              <p className="text-xs text-gray-400 mt-2">
                {formData.type === 'video' && 'Proporciona la URL del video o una descripción del mismo'}
                {formData.type === 'pdf' && 'Proporciona la URL del PDF o una descripción del documento'}
                {formData.type === 'link' && 'Proporciona la URL del enlace'}
                {formData.type === 'anuncio' && 'Escribe el contenido del anuncio'}
              </p>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número de Orden *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })}
                className="input"
              />
              <p className="text-xs text-gray-400 mt-2">
                Actualmente hay {existingContentsCount} contenido(s) en esta sesión
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-secondary-200 bg-secondary-600/50 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
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
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Agregar Contenido'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
