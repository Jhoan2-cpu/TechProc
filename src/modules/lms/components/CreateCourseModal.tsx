import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Course, CourseLevel, CreateCourseData, UpdateCourseData } from '../types';

interface CreateCourseModalProps {
  course?: Course;
  onClose: () => void;
  onSave: (courseData: CreateCourseData | UpdateCourseData) => Promise<void>;
}

export const CreateCourseModal = ({ course, onClose, onSave }: CreateCourseModalProps) => {
  const isEditing = !!course;

  // Determinar el estado inicial basado en si estamos editando o creando
  const getInitialStatus = (): boolean => {
    if (!course) return false; // Por defecto borrador para nuevo curso
    // Si course.status es string, convertir a boolean
    if (typeof course.status === 'string') {
      return course.status === 'publicado';
    }
    // Si ya es boolean, usarlo directamente
    return course.status as boolean;
  };

  const [formData, setFormData] = useState<CreateCourseData>({
    title: course?.title || '',
    name: '',
    description: course?.description || '',
    level: course?.level || 'basic',
    course_image: course?.course_image || '',
    video_url: '',
    duration: course?.duration || 0,
    sessions: course?.sessions || 0,
    selling_price: course?.selling_price || 0,
    discount_price: course?.discount_price || 0,
    prerequisites: '',
    certificate_name: false,
    certificate_issuer: '',
    bestseller: course?.bestseller || false,
    featured: course?.featured || false,
    highest_rated: false,
    status: getInitialStatus(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el curso');
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
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

            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título del Curso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Ej: Curso de Laravel desde cero"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Corto
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Ej: Laravel Masterclass"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Describe el curso..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nivel *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
                    className="select"
                  >
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                    className="select"
                  >
                    <option value="false">Borrador (Inactivo)</option>
                    <option value="true">Publicado (Activo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración (horas) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                    className="input"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de Sesiones *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.sessions}
                    onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) })}
                    className="input"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Precio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio de Venta (S/.) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) })}
                    className="input"
                    placeholder="399.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio con Descuento (S/.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_price || ''}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="input"
                    placeholder="299.99"
                  />
                </div>
              </div>
            </div>

            {/* Multimedia */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Multimedia
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.course_image || ''}
                    onChange={(e) => setFormData({ ...formData, course_image: e.target.value })}
                    className="input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL de Video
                  </label>
                  <input
                    type="url"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="input"
                    placeholder="https://youtube.com/watch?v=123"
                  />
                </div>
              </div>
            </div>

            {/* Etiquetas Especiales */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Etiquetas Especiales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={formData.bestseller || false}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-secondary-700 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="bestseller" className="text-sm font-medium text-gray-300">
                    Bestseller
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-secondary-700 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                    Destacado
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="highest_rated"
                    checked={formData.highest_rated || false}
                    onChange={(e) => setFormData({ ...formData, highest_rated: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-secondary-700 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="highest_rated" className="text-sm font-medium text-gray-300">
                    Mejor Valorado
                  </label>
                </div>
              </div>
            </div>

            {/* Requisitos y Certificación */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Requisitos y Certificación
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prerequisitos
                  </label>
                  <textarea
                    value={formData.prerequisites || ''}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Conocimientos básicos de PHP, HTML y CSS"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="certificate_name"
                    checked={formData.certificate_name || false}
                    onChange={(e) => setFormData({ ...formData, certificate_name: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-secondary-700 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="certificate_name" className="text-sm font-medium text-gray-300">
                    Otorga certificado
                  </label>
                </div>

                {formData.certificate_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emisor del Certificado
                    </label>
                    <input
                      type="text"
                      value={formData.certificate_issuer || ''}
                      onChange={(e) => setFormData({ ...formData, certificate_issuer: e.target.value })}
                      className="input"
                      placeholder="INCADEV"
                    />
                  </div>
                )}
              </div>
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
                isEditing ? 'Guardar Cambios' : 'Crear Curso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
