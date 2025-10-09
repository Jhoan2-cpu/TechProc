import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { StudentAttendance } from '../types';

interface AttendanceCardProps {
  attendance: StudentAttendance;
  index: number;
}

export const AttendanceCard = ({ attendance, index }: AttendanceCardProps) => {
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      className="card p-6 hover:shadow-lg transition-shadow"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            {attendance.student_name}
          </h3>
          <p className="text-sm text-gray-400">{attendance.course_name}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${getAttendanceColor(attendance.attendance_percentage)}`}>
            {attendance.attendance_percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-300">asistencia</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
        <div className="text-center p-2 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Total Sesiones</p>
          <p className="text-lg font-bold text-primary-400">{attendance.total_sessions}</p>
        </div>
        <div className="text-center p-2 bg-success/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Asistencias</p>
          <p className="text-lg font-bold text-success">{attendance.attended_sessions}</p>
        </div>
        <div className="text-center p-2 bg-danger/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Ausencias</p>
          <p className="text-lg font-bold text-danger">{attendance.absences}</p>
        </div>
        <div className="text-center p-2 bg-warning/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Tardanzas</p>
          <p className="text-lg font-bold text-warning">{attendance.tardiness}</p>
        </div>
        <div className="text-center p-2 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Justificadas</p>
          <p className="text-lg font-bold text-primary-400">{attendance.justified_absences}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          Última asistencia: {attendance.last_attendance_date || 'N/A'}
        </span>
      </div>
    </div>
  );
};
