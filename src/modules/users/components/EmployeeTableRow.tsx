import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import type { Employee } from '../types';

interface EmployeeTableRowProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeTableRow = ({ employee, onViewDetails, onEdit }: EmployeeTableRowProps) => {
  return (
    <tr className="border-b border-gray-700/50 hover:bg-secondary-600/30 transition-colors duration-200">
      <td className="px-4 py-3 text-sm text-gray-300">{employee.id}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-white font-medium">{employee.user.full_name}</span>
          <span className="text-xs text-gray-400">{employee.user.email}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">{employee.position.position_name}</td>
      <td className="px-4 py-3 text-sm text-gray-300">{employee.user.phone_number || 'N/A'}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          employee.employment_status === 'Active'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {employee.employment_status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">
        {new Date(employee.hire_date).toLocaleDateString('es-ES')}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(employee)}
            className="px-3 py-1.5 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all duration-300 flex items-center gap-2 border border-primary-500/30 text-sm"
          >
            <FontAwesomeIcon icon={faEye} />
            <span>Ver</span>
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-300 flex items-center gap-2 border border-yellow-500/30 text-sm"
          >
            <FontAwesomeIcon icon={faEdit} />
            <span>Editar</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
