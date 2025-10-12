import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserClock,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

interface PendingRegistrationStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const PendingRegistrationStats = ({
  pendingCount,
  approvedCount,
  rejectedCount,
}: PendingRegistrationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Pendientes */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-warning/20 shadow-lg shadow-warning/10 hover:shadow-xl hover:shadow-warning/20 hover:scale-105 transition-all duration-300 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1 font-medium">Pendientes</p>
            <p className="text-4xl font-heading font-bold text-warning">{pendingCount}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-warning/20 to-warning/30 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUserClock} className="text-3xl text-warning" />
          </div>
        </div>
      </div>

      {/* Aprobados */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-success/20 shadow-lg shadow-success/10 hover:shadow-xl hover:shadow-success/20 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1 font-medium">Aprobados</p>
            <p className="text-4xl font-heading font-bold text-success">{approvedCount}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-success" />
          </div>
        </div>
      </div>

      {/* Rechazados */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-danger/20 shadow-lg shadow-danger/10 hover:shadow-xl hover:shadow-danger/20 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1 font-medium">Rechazados</p>
            <p className="text-4xl font-heading font-bold text-danger">{rejectedCount}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-danger/20 to-danger/30 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faTimesCircle} className="text-3xl text-danger" />
          </div>
        </div>
      </div>
    </div>
  );
};
