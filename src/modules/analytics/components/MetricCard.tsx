import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  subtitle?: string;
  trend?: number;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend 
}: MetricCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400'
  };

  const getTrendIcon = (trendValue: number) => {
    if (trendValue > 0) return '↗️';
    if (trendValue < 0) return '↘️';
    return '→';
  };

  const getTrendColor = (trendValue: number) => {
    if (trendValue > 0) return 'text-green-400';
    if (trendValue < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className={`card p-6 bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-300">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor(trend)}`}>
              <span>{getTrendIcon(trend)}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <FontAwesomeIcon icon={icon} className="text-2xl" />
        </div>
      </div>
    </div>
  );
};