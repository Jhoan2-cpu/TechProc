import type { Announcement } from '../types';

interface ActiveAnnouncementsSectionProps {
  announcements: Announcement[];
}

export const ActiveAnnouncementsSection = ({ announcements }: ActiveAnnouncementsSectionProps) => {
  // Filtrar anuncios activos y vigentes
  const publishedAnnouncements = announcements.filter(a => {
    if (a.status !== 'published') return false;
    
    const now = new Date();
    const startDate = new Date(a.start_date);
    const endDate = a.end_date ? new Date(a.end_date) : null;
    
    // Verificar que el anuncio esté dentro del rango de fechas
    const isStarted = startDate <= now;
    const notExpired = !endDate || endDate >= now;
    
    return isStarted && notExpired;
  });

  if (publishedAnnouncements.length === 0) {
    return (
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white mb-4">Anuncios Activos</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">No hay anuncios activos en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h2 className="text-xl font-heading font-bold text-white mb-4">
        Anuncios Activos ({publishedAnnouncements.length})
      </h2>
      <div className="space-y-3">
        {publishedAnnouncements.map((item) => {
          const ctr = item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : '0.0';
          
          return (
            <div
              key={item.id || item.id_announcement}
              className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-900/20 to-transparent p-3 rounded hover:from-purple-900/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.views} vistas • {item.clicks} clics • CTR: {ctr}%
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-purple-900/20 text-purple-400 border border-purple-500/30">
                      {item.display_type}
                    </span>
                    {item.target_page && (
                      <span className="px-2 py-0.5 rounded text-xs bg-purple-900/20 text-purple-400 border border-purple-500/30">
                        {item.target_page}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};