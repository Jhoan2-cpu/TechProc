import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faCalendar, faEye, faTag, faTimes, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { News } from '../../modules/web/types';
import { newsService } from '../../modules/web/services/webService';

interface WebsiteNewsProps {
  news: News[];
}

export const WebsiteNews = ({ news }: WebsiteNewsProps) => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [loadingNewsDetail, setLoadingNewsDetail] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleReadMore = async (newsItem: News) => {
    try {
      setLoadingNewsDetail(true);
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';

      // Cargar los detalles completos desde la API
      const newsDetail = await newsService.getPublicNewsById(newsItem.id);
      setSelectedNews(newsDetail);
    } catch (error) {
      console.error('Error al cargar detalles de la noticia:', error);
      // En caso de error, usar los datos que ya tenemos
      setSelectedNews(newsItem);
    } finally {
      setLoadingNewsDetail(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

  // El endpoint público ya devuelve solo noticias publicadas
  // Limitar a 6 noticias por si acaso
  const publishedNews = news.slice(0, 6);

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-dark-600/50 to-smoky-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
            <FontAwesomeIcon icon={faNewspaper} className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Últimas Noticias
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Mantente informado sobre nuestros eventos, logros y novedades
          </p>
        </div>

        {/* News Grid */}
        {publishedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedNews.map((newsItem, index) => (
              <div
                key={newsItem.id_news}
                className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  {newsItem.featured_image ? (
                    <img
                      src={newsItem.featured_image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback si la imagen no carga
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary-500/20', 'to-primary-600/20', 'flex', 'items-center', 'justify-center');
                        const icon = document.createElement('i');
                        icon.className = 'fas fa-newspaper text-primary-400 text-5xl';
                        e.currentTarget.parentElement!.appendChild(icon);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                      <FontAwesomeIcon icon={faNewspaper} className="text-primary-400 text-5xl" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <span className="inline-block px-3 py-1 bg-primary-600/30 text-primary-400 text-xs font-semibold rounded-full mb-3">
                    {newsItem.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-white mb-3 line-clamp-2">
                    {newsItem.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {newsItem.summary}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>{formatDate(newsItem.published_date || newsItem.created_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEye} />
                      <span>{newsItem.views}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {newsItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newsItem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-700/50 text-gray-400 text-xs rounded"
                        >
                          <FontAwesomeIcon icon={faTag} className="text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <button
                    onClick={() => handleReadMore(newsItem)}
                    className="w-full px-4 py-2 bg-primary-600/30 hover:bg-primary-600 text-primary-400 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm"
                  >
                    Leer más
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay noticias publicadas en este momento</p>
          </div>
        )}

        {/* View All Button */}
        {publishedNews.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-secondary-600/50 border-2 border-primary-500/30 text-white font-semibold rounded-lg hover:bg-secondary-600 hover:border-primary-500/50 transition-all duration-300">
              Ver Todas las Noticias
            </button>
          </div>
        )}
      </div>

      {/* Modal para mostrar noticia completa */}
      {(selectedNews || loadingNewsDetail) && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          {loadingNewsDetail ? (
            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-12 shadow-2xl border border-gray-700/50">
              <div className="flex flex-col items-center gap-4">
                <FontAwesomeIcon icon={faSpinner} className="text-primary-400 text-5xl animate-spin" />
                <p className="text-white text-lg">Cargando noticia...</p>
              </div>
            </div>
          ) : selectedNews ? (
          <div
            className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-secondary-500 to-secondary-600 border-b border-gray-700/50 p-6 flex items-start justify-between z-10">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-primary-600/30 text-primary-400 text-xs font-semibold rounded-full mb-2">
                  {selectedNews.category}
                </span>
                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                  {selectedNews.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatDate(selectedNews.published_date || selectedNews.created_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEye} />
                    <span>{selectedNews.views} vistas</span>
                  </div>
                  {selectedNews.author_name && (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} />
                      <span>{selectedNews.author_name}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-white text-xl" />
              </button>
            </div>

            {/* Imagen destacada */}
            {selectedNews.featured_image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={selectedNews.featured_image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Contenido */}
            <div className="p-6 md:p-8">
              {/* Resumen */}
              <div className="mb-6">
                <p className="text-xl text-gray-300 font-medium leading-relaxed">
                  {selectedNews.summary}
                </p>
              </div>

              {/* Contenido completo */}
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                  style={{ wordBreak: 'break-word' }}
                >
                  {selectedNews.content}
                </div>
              </div>

              {/* Tags */}
              {selectedNews.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600/20 text-primary-400 text-sm rounded-full border border-primary-500/30"
                      >
                        <FontAwesomeIcon icon={faTag} className="text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : null}
        </div>
      )}
    </section>
  );
};
