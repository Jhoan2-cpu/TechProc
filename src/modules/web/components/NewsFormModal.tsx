import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import type { News, NewsStatus } from '../types';

interface NewsFormModalProps {
  isOpen: boolean;
  news: News | null;
  onSave: (news: Partial<News>) => void;
  onCancel: () => void;
}

export const NewsFormModal = ({ isOpen, news, onSave, onCancel }: NewsFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as NewsStatus,
    author_id: 1,
    seo_title: '',
    seo_description: '',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        slug: news.slug,
        summary: news.summary,
        content: news.content,
        featured_image: news.featured_image || '',
        category: news.category,
        tags: news.tags,
        status: news.status,
        author_id: news.author_id,
        seo_title: news.seo_title || '',
        seo_description: news.seo_description || '',
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        featured_image: '',
        category: '',
        tags: [],
        status: 'draft',
        author_id: 1,
        seo_title: '',
        seo_description: '',
      });
    }
  }, [news, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
        <div className="flex-shrink-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {news ? 'Editar Noticia' : 'Nueva Noticia'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Información Básica */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Información Básica
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
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input w-full"
                  placeholder="Título de la noticia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input w-full font-mono text-sm"
                  placeholder="url-amigable-de-la-noticia"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Se genera automáticamente del título
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resumen *
                </label>
                <textarea
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="input w-full"
                  rows={2}
                  placeholder="Breve resumen de la noticia"
                  maxLength={200}
                />
                <p className="text-xs text-gray-300 mt-1">
                  {formData.summary.length}/200 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenido Completo *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input w-full"
                  rows={6}
                  placeholder="Contenido completo de la noticia..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input w-full"
                    placeholder="Ej: Educación, Tecnología, Eventos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsStatus })}
                    className="input w-full"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de Imagen Destacada
                </label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="input w-full"
                  placeholder="/images/news/imagen.jpg"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Etiquetas
            </h4>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="input flex-1"
                  placeholder="Agregar etiqueta"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Agregar
                </button>
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-900/20 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-700 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="card p-6 bg-purple-900/20 border-purple-200">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              SEO (Opcional)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título SEO
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="input w-full"
                  placeholder="Título optimizado para motores de búsqueda"
                  maxLength={60}
                />
                <p className="text-xs text-gray-300 mt-1">
                  {formData.seo_title.length}/60 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción SEO
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="input w-full"
                  rows={2}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={160}
                />
                <p className="text-xs text-gray-300 mt-1">
                  {formData.seo_description.length}/160 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {news ? 'Guardar Cambios' : 'Crear Noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
