import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faEdit, faTrash, faChartLine } from '@fortawesome/free-solid-svg-icons';
import type { Announcement } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
  getStatusColor: (status: string) => string;
}

export const AnnouncementCard = ({ announcement, index, getStatusColor }: AnnouncementCardProps) => {
  return (
    <div
      className="card p-6 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {announcement.image_url && (
        <div className="w-full h-40 bg-secondary-200 rounded-lg flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faImage} className="text-secondary-400 text-4xl" />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-heading font-bold text-secondary-900">{announcement.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(announcement.status)}`}>
          {announcement.status}
        </span>
      </div>
      <p className="text-secondary-700 mb-4">{announcement.content}</p>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-secondary-600">Tipo</p>
          <p className="font-semibold capitalize">{announcement.display_type}</p>
        </div>
        <div>
          <p className="text-secondary-600">Página</p>
          <p className="font-semibold capitalize">{announcement.target_page}</p>
        </div>
        <div>
          <p className="text-secondary-600">Vistas</p>
          <p className="font-semibold">{announcement.views.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-secondary-600">Clics</p>
          <p className="font-semibold">{announcement.clicks.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-secondary-50 rounded p-3 mb-4">
        <p className="text-xs text-secondary-600 mb-1">CTR (Click-Through Rate)</p>
        <p className="text-2xl font-bold text-primary-600">
          {((announcement.clicks / announcement.views) * 100).toFixed(2)}%
        </p>
      </div>
      <div className="flex gap-2">
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1">
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Editar
        </button>
        <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button className="btn bg-red-600 hover:bg-red-700 text-white">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};
