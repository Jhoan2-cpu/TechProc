import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import type { UserTableRowProps } from '../types';

export const UserTableRow = ({
  user,
  onEdit,
  onViewDetails,
}: UserTableRowProps) => {
  const primaryRole = user.role && user.role.length > 0 ? user.role[0] : 'student';
  const roleLabels: Record<string, string> = {
    'admin': 'Administrador',
    'instructor': 'Instructor',
    'student': 'Estudiante',
    'lms': 'Gestor LMS',
    'seg': 'Seguridad',
    'infra': 'Infraestructura',
    'web': 'Desarrollo Web',
    'data': 'Analista Datos',
  };

  const statusLabels: Record<string, string> = {
    'active': 'Activo',
    'inactive': 'Inactivo',
  };

  return (
    <tr className="border-b border-gray-700/50 hover:bg-secondary-700/30 transition-colors duration-300">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
            <span className="text-primary-400 font-bold text-sm">
              {user.full_name?.charAt(0) || user.first_name?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user.full_name || `${user.first_name} ${user.last_name}`}</div>
            <div className="text-xs text-gray-400">{user.dni || 'Sin DNI'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{user.email}</div>
        {user.phone_number && <div className="text-xs text-gray-400">{user.phone_number}</div>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 bg-secondary-700/50 px-3 py-1.5 rounded-lg border border-gray-700/50 w-fit">
          <span className="text-sm text-white font-medium">{roleLabels[primaryRole] || primaryRole}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{user.country_location || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-lg ${
            user.status === 'active'
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-danger/20 text-danger border border-danger/30'
          }`}
        >
          {statusLabels[user.status] || user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(user)}
            className="p-2 bg-secondary-700/50 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-110"
            title="Ver detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onEdit(user)}
            className="p-2 bg-secondary-700/50 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
            title="Editar usuario"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </td>
    </tr>
  );
};
