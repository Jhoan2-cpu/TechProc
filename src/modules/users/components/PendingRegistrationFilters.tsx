import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import type { PendingRegistrationFiltersProps } from '../types';

export const PendingRegistrationFilters = ({
  filterStatus,
  onStatusChange,
}: PendingRegistrationFiltersProps) => {
  return (
    <div className="mb-6 bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 shadow-lg animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
        <select
          className="px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value as any)}
        >
          <option value="all" className="bg-secondary-700">
            Todas las solicitudes
          </option>
          <option value="pending" className="bg-secondary-700">
            Pendientes
          </option>
          <option value="approved" className="bg-secondary-700">
            Aprobadas
          </option>
          <option value="rejected" className="bg-secondary-700">
            Rechazadas
          </option>
        </select>
      </div>
    </div>
  );
};
