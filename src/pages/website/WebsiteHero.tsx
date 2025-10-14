import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faUsers,
  faCertificate,
  faLaptopCode,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import type { Alert } from '../../modules/web/types';

interface WebsiteHeroProps {
  activeAlerts: Alert[];
}

export const WebsiteHero = ({ activeAlerts }: WebsiteHeroProps) => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNews = () => {
    const element = document.getElementById('news');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-400 text-green-300';
      case 'warning': return 'bg-yellow-500/20 border-yellow-400 text-yellow-300';
      case 'error': return 'bg-red-500/20 border-red-400 text-red-300';
      default: return 'bg-blue-500/20 border-blue-400 text-blue-300';
    }
  };

  return (
    <section id="hero" className="mt-4 relative min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-600 to-smoky-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 md:pb-32 text-center">
        {/* Active Alerts - Now inside content area */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 sm:mb-8 md:mb-12">
            <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
              {activeAlerts.slice(0, 2).map((alert, index) => (
                <div
                  key={alert.id_alert}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border sm:border-2 ${getAlertColor(alert.type)} backdrop-blur-md shadow-lg animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <p className="text-xs sm:text-sm md:text-base font-medium text-center sm:text-left break-words max-w-full">
                      {alert.message}
                    </p>
                    {alert.link_url && alert.link_text && (
                      <a
                        href={alert.link_url}
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 flex-shrink-0"
                      >
                        {alert.link_text}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="animate-fade-in">
          {/* Main Title */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 sm:mb-6 px-2 leading-tight">
            Bienvenido a <span className="text-gradient">INCADEV</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Instituto de Capacitación y Desarrollo Virtual
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
            Formamos profesionales en tecnología con programas especializados y certificaciones reconocidas internacionalmente
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 md:mb-16 px-4">
            <button
              onClick={scrollToContact}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Comienza Ahora
            </button>
            <button
              onClick={scrollToNews}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-secondary-600/50 border-2 border-primary-500/30 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-secondary-600 hover:border-primary-500/50 transition-all duration-300"
            >
              Ver Noticias
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <FontAwesomeIcon icon={faUsers} className="text-primary-400 text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">1,250+</p>
              <p className="text-xs sm:text-sm text-gray-400">Estudiantes</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <FontAwesomeIcon icon={faLaptopCode} className="text-primary-400 text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">24+</p>
              <p className="text-xs sm:text-sm text-gray-400">Cursos</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <FontAwesomeIcon icon={faCertificate} className="text-primary-400 text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">95%</p>
              <p className="text-xs sm:text-sm text-gray-400">Satisfacción</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <FontAwesomeIcon icon={faRocket} className="text-primary-400 text-2xl sm:text-3xl mb-1 sm:mb-2" />
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">100%</p>
              <p className="text-xs sm:text-sm text-gray-400">Online</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FontAwesomeIcon icon={faChevronDown} className="text-primary-400 text-xl sm:text-2xl" />
        </div>
      </div>
    </section>
  );
};
