import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBullhorn, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Announcement, AnnouncementStatus } from '../types';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  announcement: Announcement | null;
  onSave: (announcement: Partial<Announcement>) => Promise<void>;
  onCancel: () => void;
}

export const AnnouncementFormModal = ({ isOpen, announcement, onSave, onCancel }: AnnouncementFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    display_type: 'banner' as 'banner' | 'modal' | 'popup' | 'notification',
    target_page: 'all',
    link_url: '',
    button_text: '',
    status: 'published' as AnnouncementStatus,
    start_date: '',
    end_date: '',
    created_by: 1,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        image_url: announcement.image_url || '',
        display_type: announcement.display_type,
        target_page: announcement.target_page,
        link_url: announcement.link_url || '',
        button_text: announcement.button_text || '',
        status: announcement.status,
        start_date: announcement.start_date.split('T')[0],
        end_date: announcement.end_date ? announcement.end_date.split('T')[0] : '',
        created_by: announcement.created_by,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        content: '',
        image_url: '',
        display_type: 'banner',
        target_page: 'all',
        link_url: '',
        button_text: '',
        status: 'published',
        start_date: today,
        end_date: '',
        created_by: 1,
      });
    }
    setErrors({});
  }, [announcement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error: any) {
      // Capturar errores de validación del backend
      if (error.details && typeof error.details === 'object') {
        setErrors(error.details);
      } else if (error.message) {
        setErrors({ general: [error.message] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faBullhorn} className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {announcement ? 'Editar Anuncio' : 'Nuevo Anuncio'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Errores Generales */}
          {errors.general && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                <div>
                  {errors.general.map((error, idx) => (
                    <p key={idx} className="text-sm text-red-300">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contenido del Anuncio */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Contenido del Anuncio
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Título del anuncio"
                />
                {errors.title && (
                  <p className="text-xs text-red-400 mt-1">{errors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenido *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`input w-full ${errors.content ? 'border-red-500' : ''}`}
                  rows={4}
                  placeholder="Contenido del anuncio..."
                />
                {errors.content && (
                  <p className="text-xs text-red-400 mt-1">{errors.content[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className={`input w-full ${errors.image_url ? 'border-red-500' : ''}`}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.image_url && (
                  <p className="text-xs text-red-400 mt-1">{errors.image_url[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Configuración de Visualización */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración de Visualización
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Visualización *
                </label>
                <select
                  required
                  value={formData.display_type}
                  onChange={(e) => setFormData({ ...formData, display_type: e.target.value as any })}
                  className={`input w-full ${errors.display_type ? 'border-red-500' : ''}`}
                >
                  <option value="banner">Banner</option>
                  <option value="modal">Modal</option>
                  <option value="popup">Pop-up</option>
                  <option value="notification">Notificación</option>
                </select>
                {errors.display_type && (
                  <p className="text-xs text-red-400 mt-1">{errors.display_type[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Página Objetivo *
                </label>
                <select
                  required
                  value={formData.target_page}
                  onChange={(e) => setFormData({ ...formData, target_page: e.target.value })}
                  className={`input w-full ${errors.target_page ? 'border-red-500' : ''}`}
                >
                  <option value="all">Todas las páginas</option>
                  <option value="home">Página de inicio</option>
                  <option value="about">Nosotros</option>
                  <option value="services">Servicios</option>
                  <option value="courses">Cursos</option>
                  <option value="blog">Blog</option>
                  <option value="news">Noticias</option>
                  <option value="contact">Contacto</option>
                  <option value="login">Iniciar sesión</option>
                  <option value="register">Registro</option>
                </select>
                {errors.target_page && (
                  <p className="text-xs text-red-400 mt-1">{errors.target_page[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL del Enlace
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className={`input w-full ${errors.link_url ? 'border-red-500' : ''}`}
                  placeholder="https://ejemplo.com/pagina"
                />
                {errors.link_url && (
                  <p className="text-xs text-red-400 mt-1">{errors.link_url[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className={`input w-full ${errors.button_text ? 'border-red-500' : ''}`}
                  placeholder="Ver más"
                />
                {errors.button_text && (
                  <p className="text-xs text-red-400 mt-1">{errors.button_text[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Estado y Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Estado y Vigencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AnnouncementStatus })}
                  className={`input w-full ${errors.status ? 'border-red-500' : ''}`}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-400 mt-1">{errors.status[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`input w-full ${errors.start_date ? 'border-red-500' : ''}`}
                />
                {errors.start_date && (
                  <p className="text-xs text-red-400 mt-1">{errors.start_date[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`input w-full ${errors.end_date ? 'border-red-500' : ''}`}
                />
                {errors.end_date && (
                  <p className="text-xs text-red-400 mt-1">{errors.end_date[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-purple-900/20 border-purple-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3">
              Vista Previa ({formData.display_type})
            </h4>
            <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 border-2 border-purple-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {formData.title || 'Título del anuncio'}
              </h3>
              <p className="text-gray-300 mb-4">
                {formData.content || 'Contenido del anuncio aparecerá aquí...'}
              </p>
              {formData.link_url && formData.button_text && (
                <button type="button" className="btn bg-purple-600 text-white">
                  {formData.button_text}
                </button>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : (announcement ? 'Guardar Cambios' : 'Crear Anuncio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};