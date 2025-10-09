import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faEdit, faTrash, faChartLine } from '@fortawesome/free-solid-svg-icons';
import type { Announcement } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
  getStatusColor: (status: string) => string;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onToggleStatus: (announcement: Announcement) => void;
}

export const AnnouncementCard = ({ announcement, index, getStatusColor, onEdit, onDelete, onToggleStatus }: AnnouncementCardProps) => {
  return (
    <div
      className="card p-6 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {announcement.image_url && (
        <div className="w-full h-40 bg-secondary-200 rounded-lg flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faImage} className="text-gray-400 text-4xl" />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-heading font-bold text-white">{announcement.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(announcement.status)}`}>
          {announcement.status}
        </span>
      </div>
      <p className="text-gray-300 mb-4">{announcement.content}</p>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Tipo</p>
          <p className="font-semibold capitalize">{announcement.display_type}</p>
        </div>
        <div>
          <p className="text-gray-400">Página</p>
          <p className="font-semibold capitalize">{announcement.target_page}</p>
        </div>
        <div>
          <p className="text-gray-400">Vistas</p>
          <p className="font-semibold">{announcement.views.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Clics</p>
          <p className="font-semibold">{announcement.clicks.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-secondary-600/50 rounded p-3 mb-4">
        <p className="text-xs text-gray-400 mb-1">CTR (Click-Through Rate)</p>
        <p className="text-2xl font-bold text-primary-600">
          {((announcement.clicks / announcement.views) * 100).toFixed(2)}%
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(announcement)}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1"
          title="Editar anuncio"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Editar
        </button>
        <button
          onClick={() => onToggleStatus(announcement)}
          className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300"
          title={`${announcement.status === 'active' ? 'Desactivar' : 'Activar'} anuncio`}
        >
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button
          onClick={() => onDelete(announcement)}
          className="btn bg-red-600 hover:bg-red-700 text-white"
          title="Eliminar anuncio"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};
