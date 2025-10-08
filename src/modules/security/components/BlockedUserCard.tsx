import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendar,
  faCheckCircle,
  faPlay,
  faEnvelope,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import type { BlockedUser } from '../types';

interface BlockedUserCardProps {
  blockedUser: BlockedUser;
  formatDate: (dateString: string) => string;
  onUnblock?: (id: number) => void;
}

export const BlockedUserCard = ({ blockedUser, formatDate, onUnblock }: BlockedUserCardProps) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-red-600 text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-heading font-bold text-lg text-secondary-900">
                {blockedUser.user_name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  blockedUser.active
                    ? 'bg-red-100 text-red-900'
                    : 'bg-green-100 text-green-900'
                }`}
              >
                {blockedUser.active ? 'Bloqueado' : 'Desbloqueado'}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mt-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-secondary-400" />
              {blockedUser.user_email}
            </p>
            <p className="text-sm text-secondary-600 mt-2">
              <span className="font-semibold">Razón:</span> {blockedUser.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-secondary-500 text-xs mb-1">Fecha de Bloqueo</p>
          <p className="text-secondary-900 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
            {formatDate(blockedUser.block_date)}
          </p>
        </div>
        {blockedUser.unblock_date && (
          <div>
            <p className="text-secondary-500 text-xs mb-1">Fecha de Desbloqueo</p>
            <p className="text-secondary-900 font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              {formatDate(blockedUser.unblock_date)}
            </p>
          </div>
        )}
      </div>

      <div className="text-sm">
        <p className="text-secondary-500 text-xs mb-1">Bloqueado por</p>
        <p className="text-secondary-900 font-medium flex items-center gap-1">
          <FontAwesomeIcon icon={faUserShield} className="text-accent-600" />
          {blockedUser.blocked_by_name}
        </p>
      </div>

      {onUnblock && blockedUser.active && (
        <div className="pt-4 border-t border-secondary-200 mt-4">
          <button
            onClick={() => onUnblock(blockedUser.id_blocked_user)}
            className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlay} />
            Desbloquear Usuario
          </button>
        </div>
      )}
    </div>
  );
};
