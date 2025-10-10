import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface TicketStatsCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  iconBgColor: string;
  index: number;
}

export const TicketStatsCard = ({ title, value, icon, iconBgColor, index }: TicketStatsCardProps) => {
  return (
    <div
      className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1 font-medium">{title}</p>
          <p className="text-4xl font-heading font-bold text-white">{value}</p>
        </div>
        <div className={`w-14 h-14 ${iconBgColor} rounded-xl flex items-center justify-center shadow-lg`}>
          <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};
