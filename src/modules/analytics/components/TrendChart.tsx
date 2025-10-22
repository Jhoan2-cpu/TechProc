import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import type { TrendPeriod, TrendAnalysis } from '../types';

interface TrendChartProps {
  data: TrendPeriod[];
  analysis: TrendAnalysis;
}

export const TrendChart = ({ data, analysis }: TrendChartProps) => {
  const getTrendColor = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'increasing':
      case 'stable':
        return 'text-green-400';
      case 'decreasing':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'increasing':
        return faArrowTrendUp;
      case 'decreasing':
        return faArrowTrendDown;
      default:
        return faChartLine;
    }
  };

  const getTrendLabel = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'increasing':
        return 'Mejorando';
      case 'decreasing':
        return 'Declinando';
      case 'stable':
        return 'Estable';
      default:
        return 'Sin cambios';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      month: 'short',
      day: 'numeric',
    });
  };

  const maxRate = Math.max(...data.map((d) => parseFloat(d.attendance_rate)));
  const minRate = Math.min(...data.map((d) => parseFloat(d.attendance_rate)));

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Tendencia de Asistencia</h3>
        </div>
        <div className={`flex items-center gap-2 ${getTrendColor(analysis.direction)}`}>
          <FontAwesomeIcon icon={getTrendIcon(analysis.direction)} />
          <span className="font-medium">{getTrendLabel(analysis.direction)}</span>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Promedio General</div>
          <div className="text-xl font-bold text-primary-400">
            {analysis.average_rate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Cambio</div>
          <div className={`text-xl font-bold ${getTrendColor(analysis.direction)}`}>
            {analysis.change_percentage > 0 ? '+' : ''}
            {analysis.change_percentage.toFixed(1)}%
          </div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Primer Periodo</div>
          <div className="text-xl font-bold text-blue-400">
            {analysis.first_period_avg.toFixed(1)}%
          </div>
        </div>
        <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Periodo Reciente</div>
          <div className="text-xl font-bold text-purple-400">
            {analysis.recent_period_avg.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-2">
        {data.slice(-10).map((period, index) => {
          const rate = parseFloat(period.attendance_rate);
          const heightPercentage = ((rate - minRate) / (maxRate - minRate)) * 100;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-400 text-right">
                {formatDate(period.period)}
              </div>
              <div className="flex-1 bg-secondary-700 rounded-full h-8 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${
                    rate >= 80
                      ? 'bg-green-500'
                      : rate >= 70
                      ? 'bg-blue-500'
                      : rate >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${rate}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-medium text-white">
                    {period.attended}/{period.total_records}
                  </span>
                  <span className="text-xs font-medium text-white">{rate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-400">Excelente (&gt;80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-400">Buena (70-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-gray-400">Regular (60-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-400">Baja (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
};
