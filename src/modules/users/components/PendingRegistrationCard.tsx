import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faEye,
  faEnvelope,
  faPhone,
  faBuilding,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import type { RegistrationRequest, PendingRegistrationCardProps } from '../types';
import { getRoleInfo } from '../utils/roleUtils';

export const PendingRegistrationCard = ({
  registration,
  isExpanded,
  onToggleExpand,
  onApprove,
  onReject,
}: PendingRegistrationCardProps) => {
  const roleInfo = getRoleInfo(registration.role as any);

  const getStatusBadge = () => {
    if (registration.status === 'pending') {
      return 'bg-warning/20 text-warning border-warning/30';
    } else if (registration.status === 'approved') {
      return 'bg-success/20 text-success border-success/30';
    } else {
      return 'bg-danger/20 text-danger border-danger/30';
    }
  };

  const getStatusLabel = () => {
    switch (registration.status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return registration.status;
    }
  };

  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-lg hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 hover:scale-[1.02] animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
              <FontAwesomeIcon icon={roleInfo.icon} className="text-xl text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-lg text-white">
                {registration.first_name} {registration.last_name}
              </h3>
              <p className="text-sm text-gray-300">{roleInfo.label}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold border ${getStatusBadge()}`}>
              {getStatusLabel()}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
              <span>{registration.email}</span>
            </div>
            {registration.phone_number && (
              <div className="flex items-center gap-2 text-gray-300">
                <FontAwesomeIcon icon={faPhone} className="text-primary-400" />
                <span>{registration.phone_number}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
              <span>{roleInfo.label}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
              <span>{new Date(registration.created_at).toLocaleString('es-ES')}</span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && registration.reason && (
            <div className="mt-4 p-4 bg-secondary-700/50 rounded-lg border border-gray-700/50 animate-slide-down">
              <p className="text-sm font-semibold text-primary-400 mb-2">Motivo de registro:</p>
              <p className="text-sm text-gray-300 leading-relaxed">{registration.reason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleExpand}
            className="p-2 bg-secondary-700/50 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
            title="Ver detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {registration.status === 'pending' && (
            <>
              <button
                onClick={onApprove}
                className="p-2 bg-success/20 hover:bg-success/30 text-success rounded-lg border border-success/30 hover:border-success/50 transition-all duration-300 hover:scale-110"
                title="Aprobar"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                onClick={onReject}
                className="p-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg border border-danger/30 hover:border-danger/50 transition-all duration-300 hover:scale-110"
                title="Rechazar"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
