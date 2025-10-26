import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faIdCard } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  index: number;
}

export const StudentCard = ({ student, index }: StudentCardProps) => {
  const getStatusBadge = (status: string) => {
    const colors = status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border-red-500/30';
    
    return `px-2 py-1 rounded-full text-xs border ${colors}`;
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-heading font-bold text-lg text-white">
              {student.first_name} {student.last_name}
            </h3>
            <span className={getStatusBadge(student.status)}>
              {student.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faIdCard} className="w-4 text-primary-400" />
              <span>ID: {student.student_id}</span>
              <span className="text-gray-500">•</span>
              <span>DNI: {student.document_number}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faBuilding} className="w-4 text-primary-400" />
              <span>{student.company?.name || 'Sin compañía'}</span>
              {student.company?.industry && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{student.company.industry}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-400">
            {student.enrollments_count}
          </p>
          <p className="text-xs text-gray-300">matrículas</p>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <p className="text-sm text-white truncate">{student.email}</p>
        </div>
        <div className="p-3 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Teléfono</p>
          <p className="text-sm text-white">{student.phone}</p>
        </div>
      </div>

      {/* Matrículas recientes */}
      {student.enrollments.length > 0 && (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} />
            Matrículas recientes
          </p>
          <div className="space-y-2">
            {student.enrollments.slice(0, 2).map((enrollment) => (
              <div key={enrollment.id} className="flex justify-between items-center text-sm">
                <span className="text-white">{enrollment.academic_period?.name || 'Período no disponible'}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(enrollment.enrollment_date).toLocaleDateString()}
                </span>
              </div>
            ))}
            {student.enrollments.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{student.enrollments.length - 2} matrículas más
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};