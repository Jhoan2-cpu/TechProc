import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faBell,
  faBullhorn,
  faEnvelope,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';

interface WebDashboardStatsProps {
  publishedNews: number;
  activeAlerts: number;
  activeAnnouncements: number;
  pendingContacts: number;
  totalFAQs: number;
}

export const WebDashboardStats = ({
  publishedNews,
  activeAlerts,
  activeAnnouncements,
  pendingContacts,
  totalFAQs,
}: WebDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Noticias Publicadas */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Noticias Publicadas</p>
            <p className="text-3xl font-heading font-bold text-white">{publishedNews}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faNewspaper} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Alertas Activas */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Alertas Activas</p>
            <p className="text-3xl font-heading font-bold text-white">{activeAlerts}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faBell} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Anuncios Activos */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Anuncios Activos</p>
            <p className="text-3xl font-heading font-bold text-white">{activeAnnouncements}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FontAwesomeIcon icon={faBullhorn} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Consultas Pendientes */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Consultas Pendientes</p>
            <p className="text-3xl font-heading font-bold text-white">{pendingContacts}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FontAwesomeIcon icon={faEnvelope} className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* FAQs Chatbot */}
      <div
        className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '400ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">FAQs Chatbot</p>
            <p className="text-3xl font-heading font-bold text-white">{totalFAQs}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FontAwesomeIcon icon={faRobot} className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
