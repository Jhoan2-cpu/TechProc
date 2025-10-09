import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconDefinition;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({ title, value, subtitle, icon, color, trend }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-600 text-primary-400 text-blue-600',
    green: 'from-green-50 to-green-100 border-green-600 text-success text-green-600',
    purple: 'from-purple-50 to-purple-100 border-purple-600 text-purple-400 text-purple-600',
    red: 'from-red-50 to-red-100 border-red-600 text-danger text-red-600',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-600 text-warning text-yellow-600',
    orange: 'from-orange-50 to-orange-100 border-orange-600 text-orange-400 text-orange-600',
  };

  const [bgGradient, borderColor, textColor, iconColor] = colorClasses[color].split(' ');

  return (
    <div className={`card p-6 bg-gradient-to-br ${bgGradient} border-l-4 ${borderColor} hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-heading font-bold ${textColor}`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <FontAwesomeIcon icon={icon} className={`text-4xl ${iconColor} opacity-50`} />
      </div>
    </div>
  );
};
