import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { InfrastructureAlert } from '../types';

interface CriticalAlertsSectionProps {
  alerts: InfrastructureAlert[];
  formatDate: (dateString: string | null) => string;
  onResolve?: (alertId: number) => void;
}

export const CriticalAlertsSection = ({
  alerts,
  formatDate,
  onResolve,
}: CriticalAlertsSectionProps) => {
  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');

  if (criticalAlerts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-sm rounded-xl p-6 border-2 border-red-500/50 shadow-xl shadow-red-500/10 animate-slide-up">
      <h2 className="text-xl font-heading font-bold text-red-400 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-white" />
        </div>
        Alertas Críticas - ¡Atención Inmediata!
      </h2>
      <div className="space-y-3">
        {criticalAlerts.map((alert) => (
          <div
            key={alert.id_alert}
            className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/40 hover:border-red-500/60 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-white mb-1">{alert.message}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatDate(alert.detection_date)}</span>
                  </div>
                </div>
              </div>
              {onResolve && (
                <button
                  onClick={() => onResolve(alert.id_alert)}
                  className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
