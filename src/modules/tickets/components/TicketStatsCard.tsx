import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface TicketStatsCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  colorClass: string;
  index: number;
}

export const TicketStatsCard = ({ title, value, icon, colorClass, index }: TicketStatsCardProps) => {
  return (
    <div
      className={`card p-6 bg-gradient-to-br ${colorClass} animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm mb-1 font-medium">{title}</p>
          <p className="text-3xl font-heading font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};
