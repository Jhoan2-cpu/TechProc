import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface LMSStatsCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  color: string;
  index: number;
}

export const LMSStatsCard = ({ title, value, icon, color, index }: LMSStatsCardProps) => {
  return (
    <div
      className="card p-6 animate-slide-up hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
        </div>
        <FontAwesomeIcon icon={faChartLine} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-heading font-bold text-white">{value}</p>
    </div>
  );
};
