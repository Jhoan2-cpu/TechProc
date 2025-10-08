import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import type { Announcement, AnnouncementStatus } from '../types';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  announcement: Announcement | null;
  onSave: (announcement: Partial<Announcement>) => void;
  onCancel: () => void;
}

export const AnnouncementFormModal = ({ isOpen, announcement, onSave, onCancel }: AnnouncementFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    display_type: 'banner' as 'popup' | 'banner' | 'sidebar',
    target_page: 'all',
    link_url: '',
    button_text: '',
    status: 'active' as AnnouncementStatus,
    start_date: '',
    end_date: '',
    created_by: 1,
  });

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
        start_date: announcement.start_date,
        end_date: announcement.end_date || '',
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
        status: 'active',
        start_date: today,
        end_date: '',
        created_by: 1,
      });
    }
  }, [announcement, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faBullhorn} className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-secondary-900">
              {announcement ? 'Editar Anuncio' : 'Nuevo Anuncio'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contenido del Anuncio */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
              Contenido del Anuncio
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="Título del anuncio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Contenido *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input w-full"
                  rows={4}
                  placeholder="Contenido del anuncio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="input w-full"
                  placeholder="/images/banners/anuncio.png"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Visualización */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
              Configuración de Visualización
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tipo de Visualización *
                </label>
                <select
                  required
                  value={formData.display_type}
                  onChange={(e) => setFormData({ ...formData, display_type: e.target.value as any })}
                  className="input w-full"
                >
                  <option value="popup">Pop-up</option>
                  <option value="banner">Banner</option>
                  <option value="sidebar">Barra Lateral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Página Objetivo *
                </label>
                <select
                  required
                  value={formData.target_page}
                  onChange={(e) => setFormData({ ...formData, target_page: e.target.value })}
                  className="input w-full"
                >
                  <option value="all">Todas las páginas</option>
                  <option value="home">Página de inicio</option>
                  <option value="courses">Cursos</option>
                  <option value="blog">Blog</option>
                  <option value="contact">Contacto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  URL del Enlace
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="input w-full"
                  placeholder="/cursos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="input w-full"
                  placeholder="Ver más"
                />
              </div>
            </div>
          </div>

          {/* Estado y Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
              Estado y Vigencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AnnouncementStatus })}
                  className="input w-full"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-purple-50 border-purple-200">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-3">
              Vista Previa ({formData.display_type})
            </h4>
            <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-2">
                {formData.title || 'Título del anuncio'}
              </h3>
              <p className="text-secondary-700 mb-4">
                {formData.content || 'Contenido del anuncio aparecerá aquí...'}
              </p>
              {formData.link_url && formData.button_text && (
                <button className="btn bg-purple-600 text-white">
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
              className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {announcement ? 'Guardar Cambios' : 'Crear Anuncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
