import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Announcement } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
  formatDate: (dateString: string | null) => string;
  getStatusColor: (status: string) => string;
  getDisplayTypeColor: (type: string) => string;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onToggleStatus: (announcement: Announcement) => void;
}

export const AnnouncementCard = ({ 
  announcement, 
  index, 
  formatDate, 
  getStatusColor, 
  getDisplayTypeColor, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: AnnouncementCardProps) => {
  // Manejar valores undefined/null
  const views = announcement.views || 0;
  const clicks = announcement.clicks || 0;
  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';

  const getDisplayTypeLabel = (type: string) => {
    switch (type) {
      case 'banner': return 'Banner';
      case 'modal': return 'Modal';
      case 'popup': return 'Popup';
      case 'notification': return 'Notificación';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Borrador';
      case 'archived': return 'Archivado';
      default: return status;
    }
  };

  const getTargetPageLabel = (page: string) => {
    switch (page) {
      case 'home': return 'Inicio';
      case 'news': return 'Noticias';
      case 'events': return 'Eventos';
      case 'academic': return 'Académico';
      case 'admissions': return 'Admisiones';
      case 'research': return 'Investigación';
      case 'about': return 'Nosotros';
      case 'contact': return 'Contacto';
      default: return page.charAt(0).toUpperCase() + page.slice(1);
    }
  };

  return (
    <div
      className="card p-6 border-2 hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {announcement.image_url && (
        <div className="w-full h-40 bg-secondary-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          <img 
            src={announcement.image_url} 
            alt={announcement.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>';
              }
            }}
          />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-gray-400">ID: {announcement.id_announcement}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDisplayTypeColor(announcement.display_type)}`}>
                  {getDisplayTypeLabel(announcement.display_type)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(announcement.status)}`}>
                  {getStatusLabel(announcement.status)}
                </span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                {announcement.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">{announcement.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-400 text-xs">Página Objetivo</p>
              <p className="font-semibold text-white text-sm">{getTargetPageLabel(announcement.target_page)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Periodo</p>
              <p className="font-semibold text-white text-xs">
                {formatDate(announcement.start_date)} - {formatDate(announcement.end_date)}
              </p>
            </div>
          </div>

          {announcement.link_url && (
            <div className="mb-4 text-sm">
              <p className="text-gray-400 text-xs">Enlace</p>
              <p className="font-mono text-xs truncate text-primary-600" title={announcement.link_url}>
                {announcement.link_url}
              </p>
              {announcement.button_text && (
                <p className="text-gray-300 text-xs">Botón: {announcement.button_text}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-secondary-600/50 rounded p-2 text-center">
              <p className="text-xs text-gray-400">Vistas</p>
              <p className="text-lg font-bold text-white">{views.toLocaleString()}</p>
            </div>
            <div className="bg-secondary-600/50 rounded p-2 text-center">
              <p className="text-xs text-gray-400">Clics</p>
              <p className="text-lg font-bold text-white">{clicks.toLocaleString()}</p>
            </div>
            <div className="bg-purple-900/20 rounded p-2 text-center">
              <p className="text-xs text-gray-400">CTR</p>
              <p className="text-lg font-bold text-purple-600">{ctr}%</p>
            </div>
          </div>

          <div className="pt-3 border-t border-secondary-200">
            <p className="text-xs text-gray-400">
              Creado: {formatDate(announcement.created_date)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(announcement)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
            title="Editar anuncio"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          {announcement.status === 'draft' || announcement.status === 'archived' ? (
            <button
              onClick={() => onToggleStatus(announcement)}
              className="btn bg-green-600 hover:bg-green-700 text-white"
              title="Publicar anuncio"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(announcement)}
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white"
              title="Guardar como borrador"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button
            onClick={() => onDelete(announcement)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
            title="Eliminar anuncio"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};