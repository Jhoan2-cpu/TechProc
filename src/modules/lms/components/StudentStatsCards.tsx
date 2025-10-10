import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserCheck, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types';

interface StudentStatsCardsProps {
  students: Student[];
}

export const StudentStatsCards = ({ students }: StudentStatsCardsProps) => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.state === 'activo').length;
  const verifiedEmails = students.filter(s => s.email_verified_at).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Estudiantes */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Total de Estudiantes</p>
            <p className="text-4xl font-heading font-bold text-white">{totalStudents}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <FontAwesomeIcon icon={faUserGraduate} className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {/* Estudiantes Activos */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Estudiantes Activos</p>
            <p className="text-4xl font-heading font-bold text-white">{activeStudents}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faUserCheck} className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {/* Emails Verificados */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Emails Verificados</p>
            <p className="text-4xl font-heading font-bold text-white">{verifiedEmails}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="text-2xl text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
