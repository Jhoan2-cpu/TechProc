import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faUserPlus } from '@fortawesome/free-solid-svg-icons';

interface InstructorFiltersProps {
  searchTerm: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateClick: () => void;
}

export const InstructorFilters = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onStatusChange,
  onCreateClick,
}: InstructorFiltersProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/30 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400"
            />
            <input
              type="text"
              placeholder="Buscar instructores..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-secondary-700/50 px-4 py-2 rounded-lg border border-gray-700/50">
            <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-secondary-700">
                Todos los estados
              </option>
              <option value="activo" className="bg-secondary-700">
                Activo
              </option>
              <option value="inactivo" className="bg-secondary-700">
                Inactivo
              </option>
              <option value="suspendido" className="bg-secondary-700">
                Suspendido
              </option>
            </select>
          </div>

          <button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Agregar Instructor
          </button>
        </div>
      </div>
    </div>
  );
};
