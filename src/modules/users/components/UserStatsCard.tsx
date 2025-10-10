import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface UserStatsCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  color: string;
  borderColor: string;
  shadowColor: string;
}

export const UserStatsCard = ({
  title,
  value,
  icon,
  color,
  borderColor,
  shadowColor,
}: UserStatsCardProps) => {
  return (
    <div
      className={`bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border ${borderColor} shadow-lg ${shadowColor} hover:shadow-xl hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1 font-medium">{title}</p>
          <p className={`text-4xl font-heading font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-16 h-16 bg-gradient-to-br ${color.replace('text-', 'from-')}/20 ${color.replace('text-', 'to-')}/20 rounded-full flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className={`text-3xl ${color}`} />
        </div>
      </div>
    </div>
  );
};
