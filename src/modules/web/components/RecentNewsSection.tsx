import type { News } from '../types';

interface RecentNewsSectionProps {
  news: News[];
  getStatusColor: (status: string) => string;
}

export const RecentNewsSection = ({ news, getStatusColor }: RecentNewsSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h2 className="text-xl font-heading font-bold text-white mb-4">Noticias Recientes</h2>
      <div className="space-y-3">
        {news.slice(0, 3).map((item) => (
          <div
            key={item.id_news}
            className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-900/20 to-transparent p-3 rounded hover:from-blue-900/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.category} • {item.views} vistas</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
