import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye } from '@fortawesome/free-solid-svg-icons';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
}

export const EmployeeCard = ({ employee, onViewDetails }: EmployeeCardProps) => {
  return (
    <div className="bg-secondary-700/50 rounded-lg p-4 border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faUser} className="text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate">
              {employee.user.full_name}
            </h4>
            <p className="text-sm text-gray-400 truncate">{employee.position.position_name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">ID: {employee.employee_id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                employee.employment_status === 'Active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {employee.employment_status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onViewDetails(employee)}
          className="ml-3 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all duration-300 flex items-center gap-2 border border-primary-500/30 flex-shrink-0"
        >
          <FontAwesomeIcon icon={faEye} />
          <span className="text-sm font-medium hidden sm:inline">Detalles</span>
        </button>
      </div>
    </div>
  );
};
