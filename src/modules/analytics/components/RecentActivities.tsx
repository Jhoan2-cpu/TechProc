import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faTicketAlt,
  faMoneyBillWave,
  faShieldAlt,
  faGraduationCap,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import type { RecentActivity } from '../types/dashboard';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student':
        return faUserPlus;
      case 'ticket':
        return faTicketAlt;
      case 'payment':
        return faMoneyBillWave;
      case 'security':
        return faShieldAlt;
      case 'enrollment':
        return faGraduationCap;
      default:
        return faClock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'text-blue-400';
      case 'ticket':
        return 'text-orange-400';
      case 'payment':
        return 'text-green-400';
      case 'security':
        return 'text-red-400';
      case 'enrollment':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (activities.length === 0) {
    return (
      <div className="card p-6 border border-gray-700/30 text-center">
        <p className="text-gray-400">No hay actividades recientes</p>
      </div>
    );
  }

  return (
    <div className="card p-6 border border-gray-700/30">
      <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faClock} className="text-primary-400" />
        Actividades Recientes
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
          >
            <div className={`p-2 rounded-lg bg-gray-700/50 ${getActivityColor(activity.type)}`}>
              <FontAwesomeIcon icon={getActivityIcon(activity.type)} />
            </div>
            
            <div className="flex-1">
              <p className="text-white text-sm">{activity.description}</p>
              <p className="text-gray-400 text-xs">
                {formatTime(activity.timestamp)}
              </p>
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${getActivityColor(activity.type)} bg-gray-700/50`}>
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};