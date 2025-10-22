import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import type { News, NewsStatus, NewsCategory } from '../types';
import { NewsCard, NewsFormModal, DeleteNewsModal } from '../components';
import { newsService } from '../services/webService';

// Categorías predefinidas
const NEWS_CATEGORIES: NewsCategory[] = [
  'educación',
  'tecnología', 
  'eventos',
  'investigación',
  'noticias',
  'anuncios',
  'becas',
  'internacionalización',
  'desarrollo-estudiantil',
  'vinculación'
];

export const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewsFormModal, setShowNewsFormModal] = useState(false);
  const [showDeleteNewsModal, setShowDeleteNewsModal] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    category: '' as NewsCategory | '',
    status: '' as NewsStatus | '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [filters.category, filters.status]); // Solo se ejecuta cuando cambian categoría o estado

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preparar filtros para la API
      const apiFilters: any = {};
      if (filters.category) apiFilters.category = filters.category;
      if (filters.status) apiFilters.status = filters.status;
      if (filters.search) apiFilters.search = filters.search;

      const { news: newsData } = await newsService.getAll(apiFilters);
      setNews(newsData);
    } catch (err: any) {
      console.error('Error al cargar noticias:', err);
      setError(err.message || 'Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/20 text-green-700';
      case 'draft':
        return 'bg-warning/20 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

  const handleNewNews = () => {
    setNewsToEdit(null);
    setShowNewsFormModal(true);
  };

  const handleEditNews = (newsItem: News) => {
    setNewsToEdit(newsItem);
    setShowNewsFormModal(true);
  };

  const handleDeleteNews = (newsItem: News) => {
    setNewsToDelete(newsItem);
    setShowDeleteNewsModal(true);
  };

  const handlePublishNews = async (newsItem: News) => {
    try {
      await newsService.update(newsItem.id, { 
        status: 'published' as NewsStatus,
        published_date: new Date().toISOString().split('T')[0]
      });
      await fetchNews();
    } catch (err: any) {
      console.error('Error al publicar noticia:', err);
      alert('Error: ' + (err.message || 'No se pudo publicar la noticia'));
    }
  };

  const handleArchiveNews = async (newsItem: News) => {
    try {
      await newsService.update(newsItem.id, { status: 'archived' as NewsStatus });
      await fetchNews();
    } catch (err: any) {
      console.error('Error al archivar noticia:', err);
      alert('Error: ' + (err.message || 'No se pudo archivar la noticia'));
    }
  };

  const handleSaveNews = async (newsData: Partial<News>) => {
    try {
      if (newsToEdit) {
        await newsService.update(newsToEdit.id, newsData);
      } else {
        await newsService.create(newsData);
      }
      
      setShowNewsFormModal(false);
      setNewsToEdit(null);
      await fetchNews();
    } catch (error: any) {
      // Propagar el error al modal para que lo muestre
      throw error;
    }
  };

  const handleConfirmDeleteNews = async () => {
    if (newsToDelete) {
      try {
        await newsService.delete(newsToDelete.id);
        setShowDeleteNewsModal(false);
        setNewsToDelete(null);
        await fetchNews();
      } catch (err: any) {
        console.error('Error al eliminar noticia:', err);
        alert('Error: ' + (err.message || 'No se pudo eliminar la noticia'));
      }
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    // Ejecutar búsqueda cuando se presiona el botón
    fetchNews();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      search: ''
    });
    // No es necesario llamar fetchNews aquí porque los cambios en category/status lo dispararán automáticamente
  };

  const hasActiveFilters = filters.category || filters.status || filters.search;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Noticias</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn flex items-center gap-2 ${
              showFilters || hasActiveFilters 
                ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                : 'bg-secondary-200 hover:bg-secondary-300 text-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button
            onClick={handleNewNews}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva Noticia
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card p-6 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-bold text-white">Filtros</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn bg-gray-500 hover:bg-gray-600 text-white text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda con botón */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar en título/resumen
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input flex-1"
                  placeholder="Buscar en título, resumen..."
                />
                <button
                  onClick={handleSearch}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
                  title="Buscar"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>

            {/* Filtro por categoría (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input w-full"
              >
                <option value="">Todas las categorías</option>
                {NEWS_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input w-full"
              >
                <option value="">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {news.length} noticia{news.length !== 1 ? 's' : ''} encontrada{news.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' con filtros aplicados'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {hasActiveFilters 
                ? 'No hay noticias que coincidan con los filtros aplicados.' 
                : 'No hay noticias para mostrar.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn bg-primary-600 hover:bg-primary-700 text-white mt-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          news.map((item, index) => (
            <NewsCard
              key={item.id}
              news={item}
              index={index}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
              onPublish={handlePublishNews}
              onArchive={handleArchiveNews}
            />
          ))
        )}
      </div>

      <NewsFormModal
        isOpen={showNewsFormModal}
        news={newsToEdit}
        categories={NEWS_CATEGORIES}
        onSave={handleSaveNews}
        onCancel={() => {
          setShowNewsFormModal(false);
          setNewsToEdit(null);
        }}
      />

      <DeleteNewsModal
        isOpen={showDeleteNewsModal}
        news={newsToDelete}
        onConfirm={handleConfirmDeleteNews}
        onCancel={() => {
          setShowDeleteNewsModal(false);
          setNewsToDelete(null);
        }}
      />
    </div>
  );
};