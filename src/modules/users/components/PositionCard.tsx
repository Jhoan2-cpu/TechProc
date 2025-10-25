import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEdit } from '@fortawesome/free-solid-svg-icons';
import type { Position } from '../types';

interface PositionCardProps {
  position: Position;
  onEdit: (position: Position) => void;
}

export const PositionCard = ({ position, onEdit }: PositionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-secondary-700/50 rounded-lg p-4 border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faBriefcase} className="text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate">
              {position.position_name}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
              <span className="text-xs text-gray-500">ID: {position.id}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">•</span>
              <span className="text-xs text-gray-400">Creado: {formatDate(position.created_at)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onEdit(position)}
          className="ml-3 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-300 flex items-center gap-2 border border-purple-500/30 flex-shrink-0"
        >
          <FontAwesomeIcon icon={faEdit} />
          <span className="text-sm font-medium hidden sm:inline">Editar</span>
        </button>
      </div>
    </div>
  );
};
