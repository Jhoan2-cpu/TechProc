// src/modules/analytics/components/TopPerformerCard.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy,
  faMedal,
  faAward,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import type { TopPerformer } from '../types/grades';

interface TopPerformerCardProps {
  performer: TopPerformer;
  rank: number;
}

export const TopPerformerCard = ({ performer, rank }: TopPerformerCardProps) => {
  const averageGrade = parseFloat(performer.average_grade);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: faTrophy, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
      case 2:
        return { icon: faMedal, color: 'text-gray-300', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30' };
      case 3:
        return { icon: faMedal, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
      default:
        return { icon: faAward, color: 'text-primary-400', bgColor: 'bg-primary-500/20', borderColor: 'border-primary-500/30' };
    }
  };

  const rankStyle = getRankIcon(rank);

  return (
    <div className={`p-4 rounded-lg border ${rankStyle.borderColor} ${rankStyle.bgColor} hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${rankStyle.bgColor}`}>
            <FontAwesomeIcon icon={rankStyle.icon} className={`${rankStyle.color} text-xl`} />
          </div>
          <div className={`w-8 h-8 rounded-full ${rankStyle.bgColor} flex items-center justify-center`}>
            <span className={`font-bold ${rankStyle.color}`}>#{rank}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-3">
        <h4 className="font-heading font-bold text-white text-lg">
          {performer.first_name} {performer.last_name}
        </h4>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
          <span className="text-xs text-gray-400">Promedio</span>
          <span className={`text-lg font-bold ${
            averageGrade >= 90 ? 'text-green-400' :
            averageGrade >= 80 ? 'text-blue-400' :
            'text-yellow-400'
          }`}>
            {averageGrade.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClipboardCheck} className="text-primary-400 text-xs" />
            <span className="text-xs text-gray-400">Evaluaciones</span>
          </div>
          <span className="text-sm font-bold text-white">
            {performer.total_grades}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-3">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              averageGrade >= 90 ? 'bg-green-500' :
              averageGrade >= 80 ? 'bg-blue-500' :
              'bg-yellow-500'
            } transition-all duration-500`}
            style={{ width: `${averageGrade}%` }}
          />
        </div>
      </div>
    </div>
  );
};