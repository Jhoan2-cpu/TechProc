import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faRefresh, faCalendar } from '@fortawesome/free-solid-svg-icons';
import type { SecurityFilters } from '../types/security';

interface SecurityFilterSectionProps {
  searchTerm: string;
  filters: SecurityFilters;
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: SecurityFilters) => void;
  onClearFilters: () => void;
}

export const SecurityFilterSection = ({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters
}: SecurityFilterSectionProps) => {
  return (
    <div className="card p-6 border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          Filtros de Búsqueda
        </h3>

        <button
          onClick={onClearFilters}
          className="btn bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2 text-sm"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda principal */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Buscar
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Usuario, email o IP..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tipo de evento */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Evento
          </label>
          <select
            value={filters.event_type || ''}
            onChange={(e) => onFilterChange({ ...filters, event_type: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="login_success">Login Exitoso</option>
            <option value="login_failed">Login Fallido</option>
            <option value="session_timeout">Sesión Expirada</option>
            <option value="access_denied">Acceso Denegado</option>
            <option value="password_change">Cambio de Contraseña</option>
            <option value="profile_update">Actualización de Perfil</option>
          </select>
        </div>

        {/* Severidad (para alertas) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Severidad
          </label>
          <select
            value={filters.severity || ''}
            onChange={(e) => onFilterChange({ ...filters, severity: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas las severidades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>

        {/* Estado (para alertas) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="open">Abierto</option>
            <option value="investigating">Investigando</option>
            <option value="resolved">Resuelto</option>
          </select>
        </div>

        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFilterChange({ ...filters, start_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Fecha de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFilterChange({ ...filters, end_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Dirección IP */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dirección IP
          </label>
          <input
            type="text"
            value={filters.ip_address || ''}
            onChange={(e) => onFilterChange({ ...filters, ip_address: e.target.value || undefined })}
            placeholder="192.168.1.1"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};