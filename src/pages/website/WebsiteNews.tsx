import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faCalendar, faEye, faTag } from '@fortawesome/free-solid-svg-icons';
import type { News } from '../../modules/web/types';

interface WebsiteNewsProps {
  news: News[];
}

export const WebsiteNews = ({ news }: WebsiteNewsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Mostrar solo noticias publicadas
  const publishedNews = news.filter(n => n.status === 'published').slice(0, 6);

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
                {newsItem.featured_image && (
                  <div className="h-48 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faNewspaper} className="text-primary-400 text-5xl" />
                  </div>
                )}

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
                  <button className="w-full px-4 py-2 bg-primary-600/30 hover:bg-primary-600 text-primary-400 hover:text-white rounded-lg transition-all duration-300 font-medium text-sm">
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
    </section>
  );
};
