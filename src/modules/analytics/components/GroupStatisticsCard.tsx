// src/modules/analytics/components/GroupStatisticsCard.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChartBar, 
  faPercentage,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import type { GroupStatistics } from '../types/grades';

interface GroupStatisticsCardProps {
  group: GroupStatistics;
}

export const GroupStatisticsCard = ({ group }: GroupStatisticsCardProps) => {
  const averageGrade = parseFloat(group.average_grade);
  const passingRate = parseFloat(group.passing_rate);

  const getAverageColor = (avg: number) => {
    if (avg >= 90) return 'text-green-400';
    if (avg >= 80) return 'text-blue-400';
    if (avg >= 70) return 'text-yellow-400';
    if (avg >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPassingRateColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500/20 border-green-500/30 text-green-400';
    if (rate >= 80) return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    if (rate >= 70) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    if (rate >= 60) return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    return 'bg-red-500/20 border-red-500/30 text-red-400';
  };

  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-primary-500/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
            <h4 className="font-heading font-bold text-white">{group.group_name}</h4>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FontAwesomeIcon icon={faBook} className="w-3" />
            <span>{group.course_name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Total de calificaciones */}
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <p className="text-2xl font-bold text-white">{group.total_grades}</p>
          <p className="text-xs text-gray-400 mt-1">Calificaciones</p>
        </div>

        {/* Promedio */}
        <div className="text-center p-3 bg-gray-900/50 rounded-lg">
          <p className={`text-2xl font-bold ${getAverageColor(averageGrade)}`}>
            {averageGrade.toFixed(1)}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <FontAwesomeIcon icon={faChartBar} className="text-gray-400 text-xs" />
            <p className="text-xs text-gray-400">Promedio</p>
          </div>
        </div>

        {/* Tasa de aprobación */}
        <div className={`text-center p-3 rounded-lg border ${getPassingRateColor(passingRate)}`}>
          <p className="text-2xl font-bold">
            {passingRate.toFixed(1)}%
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <FontAwesomeIcon icon={faPercentage} className="text-xs" />
            <p className="text-xs">Aprobación</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-3">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              passingRate >= 80 ? 'bg-green-500' :
              passingRate >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            } transition-all duration-500`}
            style={{ width: `${passingRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};