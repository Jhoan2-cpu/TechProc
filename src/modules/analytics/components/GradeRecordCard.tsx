// src/modules/analytics/components/GradeRecordCard.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendar, 
  faBook,
  faGraduationCap,
  faClipboardCheck,
  faComment,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import type { GradeRecord } from '../types/grades';

interface GradeRecordCardProps {
  record: GradeRecord;
  index: number;
}

export const GradeRecordCard = ({ record, index }: GradeRecordCardProps) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (grade >= 80) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (grade >= 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (grade >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getGradeStatus = (grade: number) => {
    return grade >= 60;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const grade = parseFloat(record.obtained_grade);
  const isPassing = getGradeStatus(grade);

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faUser} className="text-primary-400 text-lg" />
            <h3 className="font-heading font-bold text-lg text-white">
              {record.user.full_name}
            </h3>
            {isPassing ? (
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" title="Aprobado" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-400" title="Reprobado" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faBook} className="w-4 text-primary-400" />
              <span className="font-medium">{record.evaluation.group.course.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faGraduationCap} className="w-4 text-blue-400" />
              <span>{record.evaluation.group.name}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faClipboardCheck} className="w-4 text-green-400" />
              <span>{record.evaluation.title}</span>
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                {record.evaluation.evaluation_type}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendar} className="w-4 text-purple-400" />
              <span>Fecha de registro: {formatDate(record.record_date)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`px-4 py-2 rounded-lg border ${getGradeColor(grade)}`}>
            <p className="text-3xl font-bold">
              {grade.toFixed(2)}
            </p>
            <p className="text-xs mt-1">/ 100</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Peso: {record.evaluation.weight}
          </p>
        </div>
      </div>

      {/* Feedback */}
      {record.feedback && (
        <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faComment} className="text-primary-400 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Retroalimentación</p>
              <p className="text-sm text-gray-300">{record.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Información del estudiante */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-400 mb-1">DNI</p>
          <p className="text-sm text-white font-medium">{record.user.dni}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <p className="text-sm text-white font-medium truncate">{record.user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Nivel del Curso</p>
          <p className="text-sm text-white font-medium capitalize">
            {record.evaluation.group.course.level}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Estado del Grupo</p>
          <p className="text-sm text-white font-medium capitalize">
            {record.evaluation.group.status.replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>
  );
};