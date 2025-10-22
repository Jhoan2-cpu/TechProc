import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faNewspaper, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { News, NewsStatus, NewsCategory } from '../types';

interface NewsFormModalProps {
  isOpen: boolean;
  news: News | null;
  categories: NewsCategory[];
  onSave: (news: Partial<News>) => Promise<void>;
  onCancel: () => void;
}

export const NewsFormModal = ({ isOpen, news, categories, onSave, onCancel }: NewsFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image: '',
    category: '' as NewsCategory,
    tags: [] as string[],
    status: 'draft' as NewsStatus,
    author_id: 1,
    seo_title: '',
    seo_description: '',
    published_date: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        published_date: news.published_date ? news.published_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        featured_image: '',
        category: categories[0] || 'noticias',
        tags: [],
        status: 'draft',
        author_id: 1,
        seo_title: '',
        seo_description: '',
        published_date: '',
      });
    }
    setErrors({});
  }, [news, isOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error: any) {
      if (error.details && typeof error.details === 'object') {
        setErrors(error.details);
      } else if (error.message) {
        setErrors({ general: [error.message] });
      }
    } finally {
      setIsSubmitting(false);
    }
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
                  className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Título de la noticia"
                />
                {errors.title && (
                  <p className="text-xs text-red-400 mt-1">{errors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className={`input w-full font-mono text-sm ${errors.slug ? 'border-red-500' : ''}`}
                  placeholder="url-amigable-de-la-noticia"
                />
                {errors.slug && (
                  <p className="text-xs text-red-400 mt-1">{errors.slug[0]}</p>
                )}
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
                  className={`input w-full ${errors.summary ? 'border-red-500' : ''}`}
                  rows={2}
                  placeholder="Breve resumen de la noticia (10-500 caracteres)"
                  minLength={10}
                  maxLength={500}
                />
                {errors.summary && (
                  <p className="text-xs text-red-400 mt-1">{errors.summary[0]}</p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {formData.summary.length}/500 caracteres
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
                  className={`input w-full ${errors.content ? 'border-red-500' : ''}`}
                  rows={6}
                  placeholder="Contenido completo de la noticia (mínimo 50 caracteres)"
                  minLength={50}
                />
                {errors.content && (
                  <p className="text-xs text-red-400 mt-1">{errors.content[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsCategory })}
                    className={`input w-full ${errors.category ? 'border-red-500' : ''}`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-400 mt-1">{errors.category[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsStatus })}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de Imagen Destacada
                </label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className={`input w-full ${errors.featured_image ? 'border-red-500' : ''}`}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  maxLength={500}
                />
                {errors.featured_image && (
                  <p className="text-xs text-red-400 mt-1">{errors.featured_image[0]}</p>
                )}
              </div>

              {formData.status === 'published' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className={`input w-full ${errors.published_date ? 'border-red-500' : ''}`}
                  />
                  {errors.published_date && (
                    <p className="text-xs text-red-400 mt-1">{errors.published_date[0]}</p>
                  )}
                </div>
              )}
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
                  placeholder="Agregar etiqueta (máx. 50 caracteres)"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Agregar
                </button>
              </div>
              {errors.tags && (
                <p className="text-xs text-red-400 mt-1">{errors.tags[0]}</p>
              )}
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
                  className={`input w-full ${errors.seo_title ? 'border-red-500' : ''}`}
                  placeholder="Título optimizado para motores de búsqueda"
                  maxLength={255}
                />
                {errors.seo_title && (
                  <p className="text-xs text-red-400 mt-1">{errors.seo_title[0]}</p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {formData.seo_title.length}/255 caracteres (recomendado: 50-60)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción SEO
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className={`input w-full ${errors.seo_description ? 'border-red-500' : ''}`}
                  rows={2}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={500}
                />
                {errors.seo_description && (
                  <p className="text-xs text-red-400 mt-1">{errors.seo_description[0]}</p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {formData.seo_description.length}/500 caracteres (recomendado: 150-160)
                </p>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3">
              Vista Previa
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.status === 'published' ? 'bg-success/20 text-green-700' :
                  formData.status === 'draft' ? 'bg-warning/20 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {formData.status === 'published' ? 'Publicado' : 
                   formData.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
                <span className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">
                  {formData.category ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1) : 'Sin categoría'}
                </span>
              </div>
              <h5 className="text-lg font-bold text-white">
                {formData.title || 'Título de la noticia...'}
              </h5>
              <p className="text-sm text-gray-300">
                {formData.summary || 'Resumen de la noticia...'}
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary-100/90 text-primary-800 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
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
              {isSubmitting ? 'Guardando...' : (news ? 'Guardar Cambios' : 'Crear Noticia')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};