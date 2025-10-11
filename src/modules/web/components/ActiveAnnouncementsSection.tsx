import type { Announcement } from '../types';

interface ActiveAnnouncementsSectionProps {
  announcements: Announcement[];
}

export const ActiveAnnouncementsSection = ({ announcements }: ActiveAnnouncementsSectionProps) => {
  const activeAnnouncements = announcements.filter(a => a.status === 'active');

  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h2 className="text-xl font-heading font-bold text-white mb-4">Anuncios Activos</h2>
      <div className="space-y-3">
        {activeAnnouncements.map((item) => (
          <div
            key={item.id_announcement}
            className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-900/20 to-transparent p-3 rounded hover:from-purple-900/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {item.views} vistas • {item.clicks} clics • CTR: {((item.clicks / item.views) * 100).toFixed(1)}%
                </p>
              </div>
              <span className="px-2 py-1 rounded text-xs bg-purple-900/20 text-purple-400 border border-purple-500/30">
                {item.display_type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
