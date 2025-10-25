import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEye } from '@fortawesome/free-solid-svg-icons';
import type { Department } from '../types';

interface DepartmentCardProps {
  department: Department;
  onViewDetails: (department: Department) => void;
}

export const DepartmentCard = ({ department, onViewDetails }: DepartmentCardProps) => {
  return (
    <div className="border-primary-50/30 bg-gradient-to-br bg-slate-600/100 from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-white/20 flex items-center justify-center">
            <FontAwesomeIcon icon={faBuilding} className="text-2xl text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-white">
              {department.department_name}
            </h3>
            <p className="text-xs text-gray-400">ID: {department.id}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {department.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-xs text-gray-400">
          <p>Creado: {new Date(department.created_at).toLocaleDateString()}</p>
        </div>
        <button
          onClick={() => onViewDetails(department)}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 flex items-center gap-2 border border-blue-500/30"
        >
          <FontAwesomeIcon icon={faEye} />
          <span className="text-sm font-medium">Ver Detalles</span>
        </button>
      </div>
    </div>
  );
};
