import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

interface BlockedIPsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBlockClick: () => void;
}

export const BlockedIPsFilters = ({
  searchTerm,
  onSearchChange,
  onBlockClick,
}: BlockedIPsFiltersProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Buscador */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por IP o razón..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Botón Bloquear IP */}
        <button
          onClick={onBlockClick}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} />
          Bloquear IP
        </button>
      </div>
    </div>
  );
};
