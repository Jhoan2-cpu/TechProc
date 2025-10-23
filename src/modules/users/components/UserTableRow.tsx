import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import type { UserTableRowProps } from '../types';

export const UserTableRow = ({
  user,
  roleInfo,
  onEdit,
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-gray-700/50 hover:border-transparent transition-colors duration-300">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
            <span className="text-primary-400 font-bold text-sm">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user.name}</div>
            <div className="text-xs text-gray-400">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{user.email}</div>
        {user.phone && <div className="text-xs text-gray-400">{user.phone}</div>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 bg-secondary-700/50 px-3 py-1.5 rounded-lg border border-gray-700/50 w-fit">
          <FontAwesomeIcon icon={roleInfo.icon} className="text-primary-400" />
          <span className="text-sm text-white font-medium">{roleInfo.label}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{user.department || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-lg ${
            user.is_active
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-danger/20 text-danger border border-danger/30'
          }`}
        >
          {user.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center">
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
