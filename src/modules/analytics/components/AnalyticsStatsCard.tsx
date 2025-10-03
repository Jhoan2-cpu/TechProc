import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface AnalyticsStatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: IconDefinition;
  colorClass: string;
  borderColor: string;
}

export const AnalyticsStatsCard = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
  borderColor,
}: AnalyticsStatsCardProps) => {
  return (
    <div className={`card ${colorClass} ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-heading font-bold">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <FontAwesomeIcon icon={icon} className="text-4xl opacity-50" />
      </div>
    </div>
  );
};
