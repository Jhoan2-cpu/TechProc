import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faGlobe,
  faDesktop,
  faCalendar,
  faClock,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { ActiveSession } from '../types';

interface SessionCardProps {
  session: ActiveSession & {
    user_name: string;
    user_email: string;
    last_activity: string;
    location?: string;
  };
  onTerminate?: (sessionId: number) => void;
  formatDate: (dateString: string) => string;
  compact?: boolean; // Para vista resumida en dashboard
}

export const SessionCard = ({
  session,
  onTerminate,
  formatDate,
  compact = false,
}: SessionCardProps) => {
  if (compact) {
    // Vista compacta para el dashboard
    return (
      <div className="border border-secondary-200 rounded-lg p-4 bg-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{session.user_name}</p>
              <p className="text-sm text-gray-400">{session.user_email}</p>
              <div className="flex gap-4 text-xs text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faGlobe} />
                  {session.ip_address}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faDesktop} />
                  {session.device}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-400">Última actividad:</p>
            <p className="font-medium text-white">{formatDate(session.last_activity)}</p>
          </div>
        </div>
      </div>
    );
  }

  // Vista completa para la página de sesiones
  return (
    <div className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
          </div>
          <div>
            <p className="font-heading font-bold text-lg text-white">
              {session.user_name}
            </p>
            <p className="text-sm text-gray-400">{session.user_email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm flex-1">
          <div>
            <p className="text-gray-300 text-xs mb-1">IP Address</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faGlobe} className="text-primary-600" />
              {session.ip_address}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-xs mb-1">Dispositivo</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faDesktop} className="text-primary-600" />
              {session.device}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-xs mb-1">Inicio</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
              {formatDate(session.start_date)}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-xs mb-1">Última Actividad</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-primary-600" />
              {formatDate(session.last_activity)}
            </p>
          </div>
        </div>

        {onTerminate && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-success/20 text-green-700 rounded-full text-sm font-semibold">
              Activa
            </span>
            <button
              onClick={() => onTerminate(session.session_id)}
              className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              Terminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
