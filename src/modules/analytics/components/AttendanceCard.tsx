// src/modules/analytics/components/AttendanceCard.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBook,
  faCheckCircle,
  faTimesCircle,
  faUsers,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import type { Attendance } from '../types/attendance';

interface AttendanceCardProps {
  attendance: Attendance;
  index: number;
}

export const AttendanceCard = ({ attendance, index }: AttendanceCardProps) => {
  const getStatusColor = (attended: boolean) => {
    return attended ? 'text-green-400' : 'text-red-400';
  };

  const getStatusBadge = (attended: boolean) => {
    return attended 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-heading font-bold text-lg text-white">
              {attendance.student.first_name} {attendance.student.last_name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusBadge(attendance.attended)}`}>
              {attendance.attended ? 'Presente' : 'Ausente'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faUser} className="w-4 text-primary-400" />
              <span>{attendance.student.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faBook} className="w-4 text-primary-400" />
              <span className="font-medium">{attendance.class.group.course.title}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{attendance.class.group.name}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faUsers} className="w-4 text-primary-400" />
              <span>{attendance.class.class_name}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <FontAwesomeIcon 
            icon={attendance.attended ? faCheckCircle : faTimesCircle} 
            className={`text-5xl ${getStatusColor(attendance.attended)}`}
          />
          <p className="text-xs text-gray-400 mt-2">Estado</p>
        </div>
      </div>

      {/* Información de la clase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Fecha de Clase</p>
          <p className="text-sm text-white font-medium">
            {formatDate(attendance.class.class_date)}
          </p>
        </div>
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Hora de Inicio</p>
          <p className="text-sm text-white font-medium">
            {formatTime(attendance.class.start_time)}
          </p>
        </div>
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Hora de Fin</p>
          <p className="text-sm text-white font-medium">
            {formatTime(attendance.class.end_time)}
          </p>
        </div>
      </div>

      {/* Detalles adicionales */}
      {(attendance.connected_minutes || attendance.observations) && (
        <div className="border-t border-gray-700 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attendance.connected_minutes && (
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                <span className="text-gray-400">Tiempo conectado:</span>
                <span className="text-white font-medium">{attendance.connected_minutes} min</span>
              </div>
            )}
            {attendance.observations && (
              <div className="text-sm">
                <span className="text-gray-400">Observaciones: </span>
                <span className="text-white">{attendance.observations}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};