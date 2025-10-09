import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faGlobe,
  faCalendar,
  faCheckCircle,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import type { BlockedIP } from '../types';

interface BlockedIPCardProps {
  blockedIP: BlockedIP & {
    unblock_date?: string;
  };
  formatDate: (dateString: string) => string;
  onUnblock?: (id: number) => void;
}

export const BlockedIPCard = ({ blockedIP, formatDate, onUnblock }: BlockedIPCardProps) => {
  return (
    <div className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faBan} className="text-red-600 text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-red-600" />
                {blockedIP.ip_address}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  blockedIP.active
                    ? 'bg-danger/20 text-danger'
                    : 'bg-success/20 text-success'
                }`}
              >
                {blockedIP.active ? 'Bloqueada' : 'Desbloqueada'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              <span className="font-semibold">Razón:</span> {blockedIP.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-300 text-xs mb-1">Fecha de Bloqueo</p>
          <p className="text-white font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
            {formatDate(blockedIP.block_date)}
          </p>
        </div>
        {blockedIP.unblock_date && (
          <div>
            <p className="text-gray-300 text-xs mb-1">Fecha de Desbloqueo</p>
            <p className="text-white font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              {formatDate(blockedIP.unblock_date)}
            </p>
          </div>
        )}
      </div>

      {onUnblock && blockedIP.active && (
        <div className="pt-4 border-t border-secondary-200">
          <button
            onClick={() => onUnblock(blockedIP.id_blocked_ip)}
            className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlay} />
            Desbloquear IP
          </button>
        </div>
      )}
    </div>
  );
};
