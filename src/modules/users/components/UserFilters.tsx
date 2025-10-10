import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

interface UserFiltersProps {
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateClick: () => void;
}

export const UserFilters = ({
  searchTerm,
  filterRole,
  filterStatus,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onCreateClick,
}: UserFiltersProps) => {
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
              placeholder="Buscar usuarios..."
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
              value={filterRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-secondary-700">
                Todos los roles
              </option>
              <option value="administrador" className="bg-secondary-700">
                Administrador
              </option>
              <option value="gestor_lms" className="bg-secondary-700">
                Gestor LMS
              </option>
              <option value="soporte_seguridad" className="bg-secondary-700">
                Soporte - Seguridad
              </option>
              <option value="soporte_infraestructura" className="bg-secondary-700">
                Soporte - Infraestructura
              </option>
              <option value="developer_web" className="bg-secondary-700">
                Developer Web
              </option>
              <option value="analista_datos" className="bg-secondary-700">
                Analista de Datos
              </option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
          >
            <option value="all" className="bg-secondary-700">
              Todos los estados
            </option>
            <option value="active" className="bg-secondary-700">
              Activos
            </option>
            <option value="inactive" className="bg-secondary-700">
              Inactivos
            </option>
          </select>

          <button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} />
            Crear Usuario
          </button>
        </div>
      </div>
    </div>
  );
};
