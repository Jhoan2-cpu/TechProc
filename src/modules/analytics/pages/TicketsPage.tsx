import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileCsv, 
  faChartBar, 
  faTicket, 
  faTrophy,
  faClock,
  faExclamationTriangle,
  faCheckCircle,
  faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons';
import type { TicketFilters } from '../types/ticket';
import { TicketFilterSection } from '../components/TicketFilterSection';
import { TicketCard } from '../components/TicketCard';
import { useTickets } from '../hooks/useTickets';

export const TicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TicketFilters>({});

  const {
    tickets,
    statistics,
    categoryStats,
    technicianRanking,
    loading,
    error,
    pagination,
    refreshData,
    exportToCSV
  } = useTickets(filters);

  // Aplicar filtro de búsqueda local
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower) ||
      ticket.ticket_id.toString().includes(searchLower) ||
      ticket.category.toLowerCase().includes(searchLower)
    );
  });

  const handleFilterChange = (newFilters: TicketFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
    refreshData({});
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => refreshData(filters)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faTicket} className="text-primary-400" />
            Análisis de Tickets
          </h2>
          <p className="text-gray-400 mt-1">
            Reporte detallado de tickets y rendimiento de soporte técnico
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filters)}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas principales */}
      {statistics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faChartBar} className="text-primary-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{statistics.total_tickets}</p>
                  <p className="text-sm text-gray-300">Total de Tickets</p>
                </div>
              </div>
            </div>
            
            <div className="card p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faClock} className="text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.resolution_metrics.average_resolution_time_hours}h
                  </p>
                  <p className="text-sm text-gray-300">Tiempo Promedio</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.by_status.resuelto + statistics.by_status.cerrado}
                  </p>
                  <p className="text-sm text-gray-300">Tickets Resueltos</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-orange-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{statistics.escalation_rate}%</p>
                  <p className="text-sm text-gray-300">Tasa de Escalación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas de resolución */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faClock} className="text-blue-400" />
                <h4 className="font-medium text-white">Tiempo Promedio de Resolución</h4>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {statistics.resolution_metrics.average_resolution_time_hours} horas
              </p>
            </div>

            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faClock} className="text-purple-400" />
                <h4 className="font-medium text-white">Tiempo Mediano de Resolución</h4>
              </div>
              <p className="text-3xl font-bold text-purple-400">
                {statistics.resolution_metrics.median_resolution_time_hours} horas
              </p>
            </div>

            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faClock} className="text-green-400" />
                <h4 className="font-medium text-white">Tiempo de Primera Respuesta</h4>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {statistics.resolution_metrics.first_response_time_hours} horas
              </p>
            </div>
          </div>
        </>
      )}

      {/* Top Técnicos */}
      {technicianRanking.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Top Técnicos por Rendimiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicianRanking.slice(0, 4).map((tech) => (
              <div 
                key={tech.technician_id}
                className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-yellow-400">#{tech.rank}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {tech.technician_name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Total Tickets</p>
                    <p className="text-sm font-bold text-white">{tech.total_tickets}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Resueltos</p>
                    <p className="text-sm font-bold text-green-400">{tech.resolved_tickets}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Tasa</p>
                    <p className="text-sm font-bold text-yellow-400">{tech.resolution_rate}%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Tiempo Prom.</p>
                    <p className="text-sm font-bold text-blue-400">{tech.average_resolution_time}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas por categoría */}
      {categoryStats.length > 0 && (
        <div className="card p-6 border border-gray-700/30">
          <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faChartBar} className="text-primary-400" />
            Rendimiento por Categoría
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Categoría</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Total</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Abiertos</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Resueltos</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Tiempo Prom.</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Escalaciones</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((cat) => (
                  <tr key={cat.category} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-white capitalize">{cat.category}</td>
                    <td className="py-3 px-4 text-center text-white font-medium">{cat.total_tickets}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-blue-400 font-medium">{cat.open_tickets}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-green-400 font-medium">{cat.resolved_tickets}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-purple-400 font-medium">{cat.average_resolution_time}h</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        cat.escalation_count > 0 ? 'text-orange-400' : 'text-gray-400'
                      }`}>
                        {cat.escalation_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distribución por estado y prioridad */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Por Estado */}
          <div className="card p-6 border border-gray-700/30">
            <h3 className="font-heading font-bold text-white mb-4">Distribución por Estado</h3>
            <div className="space-y-3">
              {Object.entries(statistics.by_status).map(([status, count]) => {
                const percentage = ((count / statistics.total_tickets) * 100).toFixed(1);
                const statusColors = {
                  'abierto': 'bg-blue-500',
                  'en_progreso': 'bg-yellow-500',
                  'resuelto': 'bg-green-500',
                  'cerrado': 'bg-gray-500'
                };
                const statusLabels = {
                  'abierto': 'Abierto',
                  'en_progreso': 'En Progreso',
                  'resuelto': 'Resuelto',
                  'cerrado': 'Cerrado'
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 capitalize">
                        {statusLabels[status as keyof typeof statusLabels] || status}
                      </span>
                      <span className="text-white font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${statusColors[status as keyof typeof statusColors]} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Por Prioridad */}
          <div className="card p-6 border border-gray-700/30">
            <h3 className="font-heading font-bold text-white mb-4">Distribución por Prioridad</h3>
            <div className="space-y-3">
              {Object.entries(statistics.by_priority).map(([priority, count]) => {
                const percentage = ((count / statistics.total_tickets) * 100).toFixed(1);
                const priorityColors = {
                  'baja': 'bg-blue-500',
                  'media': 'bg-yellow-500',
                  'alta': 'bg-orange-500',
                  'critica': 'bg-red-500'
                };
                const priorityLabels = {
                  'baja': 'Baja',
                  'media': 'Media',
                  'alta': 'Alta',
                  'critica': 'Crítica'
                };
                return (
                  <div key={priority}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 capitalize">
                        {priorityLabels[priority as keyof typeof priorityLabels] || priority}
                      </span>
                      <span className="text-white font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${priorityColors[priority as keyof typeof priorityColors]} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <TicketFilterSection
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>
          Mostrando {filteredTickets.length} de {pagination.total_records} tickets
        </span>
        <span>
          Página {pagination.current_page} de {pagination.total_pages}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              index={index}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-300">
              No se encontraron tickets para los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page - 1 })}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>
          
          <span className="px-4 py-2 text-gray-300">
            Página {pagination.current_page} de {pagination.total_pages}
          </span>
          
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page + 1 })}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};