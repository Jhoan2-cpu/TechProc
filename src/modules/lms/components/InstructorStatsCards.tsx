import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faUserCheck, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import type { Instructor } from '../types';

interface InstructorStatsCardsProps {
  instructors: Instructor[];
}

export const InstructorStatsCards = ({ instructors }: InstructorStatsCardsProps) => {
  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(i => i.status === 'activo').length;
  const expertiseAreas = new Set(instructors.map(i => i.expertise_area.split(',')[0])).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Instructores */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Total de Instructores</p>
            <p className="text-4xl font-heading font-bold text-white">{totalInstructors}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {/* Instructores Activos */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Instructores Activos</p>
            <p className="text-4xl font-heading font-bold text-white">{activeInstructors}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FontAwesomeIcon icon={faUserCheck} className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {/* Áreas de Expertise */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1 font-medium">Áreas de Expertise</p>
            <p className="text-4xl font-heading font-bold text-white">{expertiseAreas}</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FontAwesomeIcon icon={faBriefcase} className="text-2xl text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
