import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCalendar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Announcement } from '../../modules/web/types';

interface WebsiteAnnouncementsProps {
  announcements: Announcement[];
}

export const WebsiteAnnouncements = ({ announcements }: WebsiteAnnouncementsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Filtrar solo anuncios activos
  const activeAnnouncements = announcements
    .filter(a => a.status === 'active')
    .slice(0, 4);

  return (
    <section id="announcements" className="py-20 bg-gradient-to-br from-smoky-600/50 to-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4 shadow-lg shadow-orange-500/30">
            <FontAwesomeIcon icon={faBullhorn} className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Anuncios Importantes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Entérate de las novedades, convocatorias y eventos especiales
          </p>
        </div>

        {/* Announcements Grid */}
        {activeAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAnnouncements.map((announcement, index) => (
              <div
                key={announcement.id_announcement}
                className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Display Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      announcement.display_type === 'popup'
                        ? 'bg-red-500/20 text-red-400'
                        : announcement.display_type === 'banner'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {announcement.display_type === 'popup' && 'Importante'}
                      {announcement.display_type === 'banner' && 'Destacado'}
                      {announcement.display_type === 'sidebar' && 'Informativo'}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>{formatDate(announcement.start_date)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-heading font-bold text-white mb-3">
                    {announcement.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-400 mb-6 line-clamp-4">
                    {announcement.content}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{announcement.views} visualizaciones</span>
                    <span>•</span>
                    <span>{announcement.clicks} clics</span>
                  </div>

                  {/* Action Button */}
                  {announcement.link_url && announcement.button_text && (
                    <a
                      href={announcement.link_url}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300"
                    >
                      {announcement.button_text}
                      <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay anuncios en este momento</p>
          </div>
        )}
      </div>
    </section>
  );
};
