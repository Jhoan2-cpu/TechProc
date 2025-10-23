import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt,
  faChartLine,
  faExclamationTriangle,
  faBan,
  faClipboardList,
  faPercentage,
  faNetworkWired,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import type { SecurityFilters } from '../types/security';
import { SecurityFilterSection } from '../components/SecurityFilterSection';
import { SecurityEventCard } from '../components/SecurityEventCard';
import { SecurityAlertCard } from '../components/SecurityAlertCard';
import { useSecurity } from '../hooks/useSecurity';

type ViewMode = 'dashboard' | 'events' | 'alerts';

export const SecurityReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SecurityFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  const {
    events,
    alerts,
    analysis,
    dashboardData,
    loading,
    error,
    eventsPagination,
    alertsPagination,
    fetchEvents,
    fetchAlerts,
    refreshData
  } = useSecurity(filters);

  // Aplicar filtro de búsqueda local
  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.user.full_name.toLowerCase().includes(searchLower) ||
      event.user.email.toLowerCase().includes(searchLower) ||
      event.source_ip.includes(searchLower) ||
      event.event_type.toLowerCase().includes(searchLower)
    );
  });

  const filteredAlerts = alerts.filter(alert => {
    const searchLower = searchTerm.toLowerCase();
    return (
      alert.threat_type.toLowerCase().includes(searchLower) ||
      alert.blocked_ip.ip_address.includes(searchLower)
    );
  });

  const handleFilterChange = (newFilters: SecurityFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
    refreshData({});
  };

  if (loading && !analysis && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de seguridad...</div>
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
            <FontAwesomeIcon icon={faShieldAlt} className="text-primary-400" />
            Reportes de Seguridad
          </h2>
          <p className="text-gray-400 mt-1">
            Análisis completo de eventos, alertas e incidentes de seguridad
          </p>
        </div>

        {/* Selector de vista */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('events')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'events'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setViewMode('alerts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'alerts'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Alertas
          </button>
        </div>
      </div>

      {/* Resumen general del dashboard */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="card p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <FontAwesomeIcon icon={faChartLine} className="text-primary-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardData.summary.total_events}</p>
                <p className="text-sm text-gray-300">Total Eventos</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardData.summary.total_alerts}</p>
                <p className="text-sm text-gray-300">Alertas</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <FontAwesomeIcon icon={faClipboardList} className="text-red-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardData.summary.total_incidents}</p>
                <p className="text-sm text-gray-300">Incidentes</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <FontAwesomeIcon icon={faBan} className="text-orange-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardData.summary.active_blocked_ips}</p>
                <p className="text-sm text-gray-300">IPs Bloqueadas</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FontAwesomeIcon icon={faPercentage} className="text-purple-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dashboardData.summary.failed_login_rate}%</p>
                <p className="text-sm text-gray-300">Logins Fallidos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análisis detallado */}
      {analysis && viewMode === 'dashboard' && (
        <>
          {/* Eventos por tipo */}
          <div className="card p-6 border border-gray-700/30">
            <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
              Eventos por Tipo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(analysis.by_event_type).map(([type, count]) => (
                <div key={type} className="p-4 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary-400">{count}</p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{type.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* IPs Bloqueadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faBan} className="text-red-400 text-xl" />
                <h3 className="font-heading font-bold text-white">IPs Bloqueadas</h3>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-xl">{analysis.blocked_ips.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Activas:</span>
                  <span className="text-green-400 font-bold text-xl">{analysis.blocked_ips.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Este Período:</span>
                  <span className="text-blue-400 font-bold text-xl">{analysis.blocked_ips.this_period}</span>
                </div>
              </div>
            </div>

            {/* Alertas por severidad */}
            <div className="card p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl" />
                <h3 className="font-heading font-bold text-white">Alertas por Severidad</h3>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-400">Crítica:</span>
                  <span className="text-white font-bold text-xl">{analysis.security_alerts.by_severity.critical || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400">Alta:</span>
                  <span className="text-white font-bold text-xl">{analysis.security_alerts.by_severity.high || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">Media:</span>
                  <span className="text-white font-bold text-xl">{analysis.security_alerts.by_severity.medium || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Baja:</span>
                  <span className="text-white font-bold text-xl">{analysis.security_alerts.by_severity.low || 0}</span>
                </div>
              </div>
            </div>

            {/* Incidentes */}
            <div className="card p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-purple-400 text-xl" />
                <h3 className="font-heading font-bold text-white">Estado de Incidentes</h3>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-xl">{analysis.incidents.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Resueltos:</span>
                  <span className="text-white font-bold text-xl">{analysis.incidents.resolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">En Progreso:</span>
                  <span className="text-white font-bold text-xl">{analysis.incidents.in_progress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* IPs con más amenazas */}
          {analysis.top_threat_ips.length > 0 && (
            <div className="card p-6 border border-gray-700/30">
              <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faNetworkWired} className="text-red-400" />
                IPs con Más Intentos Fallidos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Dirección IP</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Intentos</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.top_threat_ips.map((ip, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-4 font-mono text-white">{ip.ip_address}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-red-400 font-bold">{ip.attempt_count}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {ip.blocked ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                              <FontAwesomeIcon icon={faBan} className="mr-1" />
                              Bloqueada
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                              <FontAwesomeIcon icon={faLock} className="mr-1" />
                              Activa
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Eventos recientes */}
          {dashboardData && dashboardData.recent_events.length > 0 && (
            <div className="card p-6 border border-gray-700/30">
              <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
                Eventos Recientes
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {dashboardData.recent_events.slice(0, 5).map((event, index) => (
                  <SecurityEventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Vista de Eventos */}
      {viewMode === 'events' && (
        <>
          <SecurityFilterSection
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>
              Mostrando {filteredEvents.length} de {eventsPagination.total_records} eventos
            </span>
            <span>
              Página {eventsPagination.current_page} de {eventsPagination.total_pages}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <SecurityEventCard key={event.id} event={event} index={index} />
              ))
            ) : (
              <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
                <p className="text-xl text-gray-300">
                  No se encontraron eventos para los filtros aplicados
                </p>
              </div>
            )}
          </div>

          {eventsPagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handleFilterChange({ ...filters, page: eventsPagination.current_page - 1 })}
                disabled={eventsPagination.current_page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-300">
                Página {eventsPagination.current_page} de {eventsPagination.total_pages}
              </span>
              
              <button
                onClick={() => handleFilterChange({ ...filters, page: eventsPagination.current_page + 1 })}
                disabled={eventsPagination.current_page === eventsPagination.total_pages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Vista de Alertas */}
      {viewMode === 'alerts' && (
        <>
          <SecurityFilterSection
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>
              Mostrando {filteredAlerts.length} de {alertsPagination.total_records} alertas
            </span>
            <span>
              Página {alertsPagination.current_page} de {alertsPagination.total_pages}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <SecurityAlertCard key={alert.id} alert={alert} index={index} />
              ))
            ) : (
              <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
                <p className="text-xl text-gray-300">
                  No se encontraron alertas para los filtros aplicados
                </p>
              </div>
            )}
          </div>

          {alertsPagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handleFilterChange({ ...filters, page: alertsPagination.current_page - 1 })}
                disabled={alertsPagination.current_page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-300">
                Página {alertsPagination.current_page} de {alertsPagination.total_pages}
              </span>
              
              <button
                onClick={() => handleFilterChange({ ...filters, page: alertsPagination.current_page + 1 })}
                disabled={alertsPagination.current_page === alertsPagination.total_pages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};