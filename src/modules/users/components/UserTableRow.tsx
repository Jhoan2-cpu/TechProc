import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import type { User, RoleInfo } from '../types';

interface UserTableRowProps {
  user: User;
  roleInfo: RoleInfo;
  onEdit: (user: User) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserTableRow = ({
  user,
  roleInfo,
  onEdit,
  onToggleStatus,
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 bg-secondary-700/50 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
            title="Editar usuario"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
              user.is_active
                ? 'bg-danger/20 hover:bg-danger/30 text-danger border-danger/30 hover:border-danger/50'
                : 'bg-success/20 hover:bg-success/30 text-success border-success/30 hover:border-success/50'
            }`}
            title={user.is_active ? 'Desactivar' : 'Activar'}
          >
            <FontAwesomeIcon icon={user.is_active ? faToggleOff : faToggleOn} />
          </button>
        </div>
      </td>
    </tr>
  );
};
