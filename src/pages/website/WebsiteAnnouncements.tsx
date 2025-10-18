import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCalendar, faArrowRight, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { websiteService, type AnnouncementFromAPI } from '../../services/websiteService';

export const WebsiteAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar la visualización de cada tipo
  const [modalAnnouncement, setModalAnnouncement] = useState<AnnouncementFromAPI | null>(null);
  const [popupAnnouncement, setPopupAnnouncement] = useState<AnnouncementFromAPI | null>(null);
  const [notificationAnnouncements, setNotificationAnnouncements] = useState<AnnouncementFromAPI[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await websiteService.getPublicAnnouncements();
        setAnnouncements(data);
        setError(null);

        // Separar anuncios por tipo para mostrarlos de forma diferente
        const modal = data.find(a => a.display_type === 'modal');
        const popup = data.find(a => a.display_type === 'popup');
        const notifications = data.filter(a => a.display_type === 'notification');

        // Mostrar modal primero (más importante) después de 1 segundo
        if (modal) {
          setTimeout(() => setModalAnnouncement(modal), 1000);
        }

        // Mostrar popup después de 3 segundos (o después de cerrar el modal)
        if (popup) {
          setTimeout(() => {
            if (!modal) setPopupAnnouncement(popup);
          }, 3000);
        }

        // Mostrar notificaciones después de 2 segundos, una por una
        if (notifications.length > 0) {
          setTimeout(() => {
            notifications.forEach((notif, index) => {
              setTimeout(() => {
                setNotificationAnnouncements(prev => [...prev, notif]);
                // Auto-ocultar después de 8 segundos
                setTimeout(() => {
                  setNotificationAnnouncements(prev => prev.filter(n => n.id_announcement !== notif.id_announcement));
                }, 8000);
              }, index * 2500); // Espaciar notificaciones por 2.5 segundos
            });
          }, 2000);
        }
      } catch (err) {
        console.error('Error al cargar anuncios:', err);
        setError('No se pudieron cargar los anuncios');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Cuando se cierra el modal, mostrar el popup si existe
  const handleCloseModal = () => {
    setModalAnnouncement(null);
    const popup = announcements.find(a => a.display_type === 'popup');
    if (popup) {
      setTimeout(() => setPopupAnnouncement(popup), 500);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Filtrar solo anuncios tipo banner para las tarjetas
  const bannerAnnouncements = announcements
    .filter(a => a.status === 'published' && a.display_type === 'banner')
    .slice(0, 6);

  // Mostrar estado de carga
  if (loading) {
    return (
      <section id="announcements" className="py-20 bg-gradient-to-br from-smoky-600/50 to-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Cargando anuncios...</p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <section id="announcements" className="py-20 bg-gradient-to-br from-smoky-600/50 to-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Modal (Más importante - Full screen) */}
      {modalAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-br from-primary-500/10 via-secondary-500 to-secondary-600 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-scale-up border-2 border-primary-500/30">
            {/* Botón cerrar */}
            <div className="sticky top-0 flex justify-end p-6 bg-gradient-to-b from-secondary-500/98 to-transparent z-10">
              <button
                onClick={handleCloseModal}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/30 hover:bg-red-500/50 text-red-300 hover:text-white transition-all shadow-lg"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="px-10 pb-10 -mt-8">
              <img
                src={modalAnnouncement.image_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&auto=format&fit=crop'}
                alt={modalAnnouncement.title}
                className="w-full h-80 object-cover rounded-2xl mb-8 shadow-2xl"
                onError={(e) => {
                  // Si falla la imagen original, usar imagen por defecto
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&auto=format&fit=crop';
                }}
              />

              <div className="mb-6">
                <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
                  MODAL - DESTACADO
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                {modalAnnouncement.title}
              </h2>

              <p className="text-gray-200 mb-8 text-xl leading-relaxed">
                {modalAnnouncement.content}
              </p>

              {/* Info del creador */}
              <div className="border-t border-gray-700/50 pt-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-600/30 flex items-center justify-center text-primary-300 font-bold text-lg border-2 border-primary-500/30">
                  {modalAnnouncement.creator.first_name[0]}{modalAnnouncement.creator.last_name[0]}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{modalAnnouncement.creator.full_name}</p>
                  <p className="text-sm text-gray-400">{formatDate(modalAnnouncement.created_date)}</p>
                </div>
              </div>

              {modalAnnouncement.link_url && modalAnnouncement.button_text && (
                <a
                  href={modalAnnouncement.link_url}
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all"
                >
                  {modalAnnouncement.button_text}
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup (Menos prominente que Modal) */}
      {popupAnnouncement && !modalAnnouncement && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-up">
            {/* Botón cerrar */}
            <div className="sticky top-0 flex justify-end p-4 bg-gradient-to-b from-secondary-500/95 to-transparent">
              <button
                onClick={() => setPopupAnnouncement(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Contenido del popup */}
            <div className="px-8 pb-8 -mt-6">
              <img
                src={popupAnnouncement.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop'}
                alt={popupAnnouncement.title}
                className="w-full h-56 object-cover rounded-xl mb-6"
                onError={(e) => {
                  // Si falla la imagen original, usar imagen por defecto
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop';
                }}
              />

              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                  POPUP
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                {popupAnnouncement.title}
              </h2>

              <p className="text-gray-300 mb-6 text-base leading-relaxed">
                {popupAnnouncement.content}
              </p>

              {/* Info del creador */}
              <div className="border-t border-gray-700/50 pt-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold">
                  {popupAnnouncement.creator.first_name[0]}{popupAnnouncement.creator.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{popupAnnouncement.creator.full_name}</p>
                  <p className="text-xs text-gray-400">{formatDate(popupAnnouncement.created_date)}</p>
                </div>
              </div>

              {popupAnnouncement.link_url && popupAnnouncement.button_text && (
                <a
                  href={popupAnnouncement.link_url}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  {popupAnnouncement.button_text}
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications (Toasts) */}
      <div className="fixed top-4 right-4 z-40 space-y-3 max-w-md">
        {notificationAnnouncements.map((notification, index) => (
          <div
            key={`notification-${notification.id_announcement}-${index}`}
            className="bg-gradient-to-r from-blue-500/95 to-blue-600/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 animate-slide-in-right border border-blue-400/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">{notification.title}</h4>
                <p className="text-sm text-white/95 mb-2 line-clamp-2">{notification.content}</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-semibold">
                    {notification.creator.first_name[0]}{notification.creator.last_name[0]}
                  </div>
                  <p className="text-xs text-white/80">{notification.creator.full_name}</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationAnnouncements(prev => prev.filter(n => n.id_announcement !== notification.id_announcement))}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sección principal con tarjetas de tipo Banner */}
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

          {/* Announcements Grid - Solo Banners */}
          {bannerAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannerAnnouncements.map((announcement, index) => (
              <div
                key={announcement.id_announcement}
                className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Imagen del anuncio */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={announcement.image_url || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop'}
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Si falla la imagen original, usar imagen por defecto
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop';
                    }}
                  />
                </div>

                <div className="p-6">
                  {/* Display Type Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400">
                      BANNER
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-heading font-bold text-white mb-3">
                    {announcement.title}
                  </h3>

                  {/* Contenido */}
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {announcement.content}
                  </p>

                  {/* Información del creador y fecha */}
                  <div className="border-t border-gray-700/50 pt-4 mt-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar del creador */}
                      <div className="flex-shrink-0">
                        {announcement.creator.profile_photo ? (
                          <img
                            src={announcement.creator.profile_photo}
                            alt={announcement.creator.full_name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30"
                            onError={(e) => {
                              // Si falla la imagen, mostrar iniciales
                              const parent = e.currentTarget.parentElement!;
                              parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold text-sm">${announcement.creator.first_name[0]}${announcement.creator.last_name[0]}</div>`;
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-semibold text-sm">
                            {announcement.creator.first_name[0]}{announcement.creator.last_name[0]}
                          </div>
                        )}
                      </div>

                      {/* Info del creador */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {announcement.creator.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {announcement.creator.role.join(', ')}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                          <span>{formatDate(announcement.created_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No hay anuncios tipo banner en este momento</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
