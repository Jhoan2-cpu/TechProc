import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBook,
  faUserGroup,
  faCalendar,
  faCheck,
  faXmark,
  faClock,
  faSignal,
} from '@fortawesome/free-solid-svg-icons';
import type { AttendanceRecord } from '../types';

interface AttendanceRecordCardProps {
  record: AttendanceRecord;
}

export const AttendanceRecordCard = ({ record }: AttendanceRecordCardProps) => {
  const getConnectionQualityColor = (quality: string | null) => {
    switch (quality) {
      case 'EXCELLENT':
        return 'text-green-400';
      case 'GOOD':
        return 'text-blue-400';
      case 'FAIR':
        return 'text-yellow-400';
      case 'POOR':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConnectionQualityLabel = (quality: string | null) => {
    switch (quality) {
      case 'EXCELLENT':
        return 'Excelente';
      case 'GOOD':
        return 'Buena';
      case 'FAIR':
        return 'Regular';
      case 'POOR':
        return 'Mala';
      default:
        return 'N/A';
    }
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return 'N/A';
    const date = new Date(datetime);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-primary-500/50 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Columna 1: Estudiante */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-400 mb-3">
            <FontAwesomeIcon icon={faUser} />
            <h4 className="font-semibold">Estudiante</h4>
          </div>
          <p className="text-white font-medium">{record.student.name}</p>
          <p className="text-sm text-gray-400">{record.student.email}</p>
        </div>

        {/* Columna 2: Clase y Grupo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-400 mb-3">
            <FontAwesomeIcon icon={faBook} />
            <h4 className="font-semibold">Clase</h4>
          </div>
          <p className="text-white font-medium">{record.class.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FontAwesomeIcon icon={faUserGroup} className="text-xs" />
            <span>{record.group.name}</span>
          </div>
          <p className="text-sm text-gray-400">{record.course.title}</p>
        </div>

        {/* Columna 3: Fecha y Hora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-400 mb-3">
            <FontAwesomeIcon icon={faCalendar} />
            <h4 className="font-semibold">Fecha</h4>
          </div>
          <p className="text-white font-medium">{formatDate(record.class.date)}</p>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-400">Entrada: </span>
              <span className="text-white">{formatTime(record.entry_time)}</span>
            </div>
            <div>
              <span className="text-gray-400">Salida: </span>
              <span className="text-white">{formatTime(record.exit_time)}</span>
            </div>
          </div>
        </div>

        {/* Columna 4: Estado y Métricas */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-400 mb-3">
            <FontAwesomeIcon icon={faSignal} />
            <h4 className="font-semibold">Estado</h4>
          </div>

          {/* Asistencia */}
          <div className="flex items-center gap-2">
            {record.attended === 'YES' ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                <span className="text-green-400 font-medium">Asistió</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faXmark} className="text-red-400" />
                <span className="text-red-400 font-medium">No asistió</span>
              </>
            )}
          </div>

          {/* Tiempo conectado */}
          {record.attended === 'YES' && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                <span className="text-gray-400">
                  {record.connected_minutes} min
                </span>
              </div>

              {/* Calidad de conexión */}
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon
                  icon={faSignal}
                  className={getConnectionQualityColor(record.connection_quality)}
                />
                <span className={getConnectionQualityColor(record.connection_quality)}>
                  {getConnectionQualityLabel(record.connection_quality)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
