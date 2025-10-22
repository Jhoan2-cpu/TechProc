import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faCheck,
  faXmark,
  faPercentage,
  faClock,
  faHeartPulse,
} from '@fortawesome/free-solid-svg-icons';
import type { AttendanceSummary } from '../types';

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export const AttendanceSummaryCards = ({ summary }: AttendanceSummaryCardsProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-blue-400';
      case 'needs_improvement':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving':
        return '📈';
      case 'declining':
      case 'critical_decline':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➖';
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving':
        return 'Mejorando';
      case 'declining':
        return 'Declinando';
      case 'critical_decline':
        return 'Declive Crítico';
      case 'stable':
        return 'Estable';
      default:
        return 'Sin cambios';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Total de Registros */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faClipboardList} className="text-2xl text-blue-400" />
          <span className="text-2xl font-bold text-white">{summary.total_records}</span>
        </div>
        <p className="text-sm text-gray-400">Total Registros</p>
      </div>

      {/* Asistencias */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-400" />
          <span className="text-2xl font-bold text-white">{summary.total_attended}</span>
        </div>
        <p className="text-sm text-gray-400">Asistieron</p>
      </div>

      {/* Faltas */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faXmark} className="text-2xl text-red-400" />
          <span className="text-2xl font-bold text-white">{summary.total_missed}</span>
        </div>
        <p className="text-sm text-gray-400">Faltas</p>
      </div>

      {/* Tasa de Asistencia */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faPercentage} className="text-2xl text-primary-400" />
          <span className="text-2xl font-bold text-white">
            {summary.attendance_rate.toFixed(1)}%
          </span>
        </div>
        <p className="text-sm text-gray-400">Tasa de Asistencia</p>
      </div>

      {/* Tiempo Promedio Conectado */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faClock} className="text-2xl text-yellow-400" />
          <span className="text-2xl font-bold text-white">
            {Math.round(summary.avg_connected_minutes)}
          </span>
        </div>
        <p className="text-sm text-gray-400">Min. Promedio</p>
      </div>

      {/* Salud del Sistema */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between mb-2">
          <FontAwesomeIcon icon={faHeartPulse} className="text-2xl text-purple-400" />
          <span className="text-2xl font-bold text-white">
            {summary.performance_indicators.health_score.toFixed(0)}
          </span>
        </div>
        <p className="text-sm text-gray-400">Salud del Sistema</p>
      </div>

      {/* Estado General */}
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-3 bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Estado del Sistema</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Estado:</span>
            <span className={`font-medium ${getStatusColor(summary.performance_indicators.status)}`}>
              {summary.performance_indicators.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Tendencia:</span>
            <span className="font-medium text-white flex items-center gap-2">
              {getTrendIcon(summary.performance_indicators.trend)}
              {getTrendLabel(summary.performance_indicators.trend)}
            </span>
          </div>
        </div>
      </div>

      {/* Calidad de Conexión */}
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-3 bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Calidad de Conexión</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Excelente:</span>
            <span className="font-medium text-green-400">
              {summary.connection_quality_distribution.excellent}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Buena:</span>
            <span className="font-medium text-blue-400">
              {summary.connection_quality_distribution.good}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Regular:</span>
            <span className="font-medium text-yellow-400">
              {summary.connection_quality_distribution.fair}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Mala:</span>
            <span className="font-medium text-red-400">
              {summary.connection_quality_distribution.poor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
