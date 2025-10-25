import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGraduationCap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { websiteService, type AnnouncementFromAPI } from '../../services/websiteService';

export const WebsiteNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationAnnouncements, setNotificationAnnouncements] = useState<AnnouncementFromAPI[]>([]);

  useEffect(() => {
    let isMounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const fetchNotifications = async () => {
      try {
        const data = await websiteService.getPublicAnnouncements();

        if (!isMounted) return;

        // Filtrar solo notificaciones
        const notifications = data.filter(a => a.display_type === 'notification');

        // Mostrar notificaciones después de 2 segundos, una por una
        if (notifications.length > 0) {
          const initialTimeout = setTimeout(() => {
            notifications.forEach((notif, index) => {
              const showTimeout = setTimeout(() => {
                if (isMounted) {
                  setNotificationAnnouncements(prev => {
                    // Evitar duplicados verificando si ya existe
                    if (prev.some(n => n.id_announcement === notif.id_announcement)) {
                      return prev;
                    }
                    return [...prev, notif];
                  });

                  // Auto-ocultar después de 200 segundos
                  const hideTimeout = setTimeout(() => {
                    if (isMounted) {
                      setNotificationAnnouncements(prev =>
                        prev.filter(n => n.id_announcement !== notif.id_announcement)
                      );
                    }
                  }, 200000);
                  timeouts.push(hideTimeout);
                }
              }, index * 2500); // Espaciar notificaciones por 2.5 segundos
              timeouts.push(showTimeout);
            });
          }, 2000);
          timeouts.push(initialTimeout);
        }
      } catch (err) {
        console.error('Error al cargar notificaciones:', err);
      }
    };

    fetchNotifications();

    // Cleanup: cancelar todos los timeouts cuando el componente se desmonte
    return () => {
      isMounted = false;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-secondary-600/95 to-secondary-700/95 backdrop-blur-md shadow-xl border-b border-primary-500/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gradient">INCADEV</h1>
              <p className="text-xs text-gray-300 leading-tight">Instituto de Capacitación y Desarrollo Virtual</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Noticias
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Anuncios
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Contacto
            </button>
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Noticias
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Anuncios
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Contacto
            </button>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg font-medium mt-4"
            >
              Ingresar
            </Link>
          </div>
        )}
      </div>
    </nav>

    {/* Notifications (esquina superior derecha debajo del navbar) */}
    {notificationAnnouncements.length > 0 && (
      <div className="fixed top-24 right-4 z-40 space-y-3 max-w-md w-full sm:w-96">
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
    )}
    </>
  );
};
