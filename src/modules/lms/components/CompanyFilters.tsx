import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

interface CompanyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export const CompanyFilters = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
}: CompanyFiltersProps) => {
  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Búsqueda */}
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, industria o contacto..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Botón Crear */}
        <button
          onClick={onCreateClick}
          className="btn btn-primary whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nueva Compañía
        </button>
      </div>
    </div>
  );
};
