import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendar, faArrowRight, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { websiteService, type AnnouncementFromAPI } from '../../services/websiteService';

interface ViewAnnouncementDetailsModalProps {
  announcementId: number;
  onClose: () => void;
}

export const ViewAnnouncementDetailsModal = ({ announcementId, onClose }: ViewAnnouncementDetailsModalProps) => {
  const [announcement, setAnnouncement] = useState<AnnouncementFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await websiteService.getAnnouncementById(announcementId);
        setAnnouncement(data);
      } catch (err) {
        console.error('Error al cargar detalles del anuncio:', err);
        setError('No se pudieron cargar los detalles del anuncio');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [announcementId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Header del modal con botón cerrar */}
        <div className="sticky top-0 flex justify-between items-center p-6 bg-gradient-to-b from-secondary-500/98 to-transparent backdrop-blur-sm border-b border-gray-700/30 z-10">
          <h3 className="text-2xl font-heading font-bold text-white">Detalles del Anuncio</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-primary-400 text-4xl mb-4 animate-spin" />
              <p className="text-gray-300 text-lg">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Cerrar
              </button>
            </div>
          ) : announcement ? (
            <div className="space-y-6">
              {/* Imagen del anuncio */}
              {announcement.image_url && (
                <div className="w-full h-80 overflow-hidden rounded-xl">
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
              )}

              {/* Badge de tipo */}
              <div className="flex items-center gap-3">
                <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-orange-500/20 text-orange-400 uppercase">
                  {announcement.display_type}
                </span>
                <span className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-green-500/20 text-green-400">
                  {announcement.status}
                </span>
              </div>

              {/* Título */}
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
                {announcement.title}
              </h2>

              {/* Contenido */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-gray-700/50">
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faEye} className="text-primary-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vistas</p>
                    <p className="text-lg font-bold text-white">{announcement.views}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Fecha de inicio</p>
                    <p className="text-sm font-semibold text-white">{formatDate(announcement.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Fecha de fin</p>
                    <p className="text-sm font-semibold text-white">{formatDate(announcement.end_date)}</p>
                  </div>
                </div>
              </div>

              {/* Información del creador */}
              <div className="bg-secondary-700/50 rounded-xl p-6">
                <p className="text-xs text-gray-500 uppercase mb-3">Publicado por</p>
                <div className="flex items-center gap-4">
                  {announcement.creator.profile_photo ? (
                    <img
                      src={announcement.creator.profile_photo}
                      alt={announcement.creator.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement!;
                        parent.innerHTML = `<div class="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xl">${announcement.creator.first_name[0]}${announcement.creator.last_name[0]}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xl">
                      {announcement.creator.first_name[0]}{announcement.creator.last_name[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">{announcement.creator.full_name}</p>
                    <p className="text-sm text-gray-400">{announcement.creator.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                      Publicado el {formatDate(announcement.created_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de acción si existe */}
              {announcement.link_url && announcement.button_text && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all"
                >
                  {announcement.button_text}
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
