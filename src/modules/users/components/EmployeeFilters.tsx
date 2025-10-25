import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

interface EmployeeFiltersProps {
  searchTerm: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const EmployeeFilters = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onStatusChange,
}: EmployeeFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      {/* Buscador */}
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
            placeholder="Buscar por nombre, email o ID..."
          />
        </div>
      </div>

      {/* Filtro por Estado */}
      <div className="md:w-64">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer appearance-none"
          >
            <option value="" className="bg-secondary-700">Todos los estados</option>
            <option value="Active" className="bg-secondary-700">Activos</option>
            <option value="Inactive" className="bg-secondary-700">Inactivos</option>
          </select>
        </div>
      </div>
    </div>
  );
};
