import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Server, License, Storage, TechResource, InfrastructureAlert } from '../types';
import { InfrastructureStats } from '../components';

interface InfrastructureDashboardPageProps {
  servers: Server[];
  licenses: License[];
  storage: Storage[];
  resources: TechResource[];
  alerts: InfrastructureAlert[];
}

export const InfrastructureDashboardPage = ({
  servers,
  licenses,
  storage,
  resources,
  alerts,
}: InfrastructureDashboardPageProps) => {
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const resourcesInUse = resources.filter(r => r.status === 'in_use').length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getServerStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success/20 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-warning/20 text-yellow-700';
      case 'error': return 'bg-danger/20 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-danger/20';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-warning/20';
    return 'bg-success/20';
  };

  return (
    <>
      {/* Estadísticas */}
      <InfrastructureStats
        onlineServers={onlineServers}
        totalServers={servers.length}
        activeLicenses={activeLicenses}
        totalLicenses={licenses.length}
        criticalAlerts={criticalAlerts}
        resourcesInUse={resourcesInUse}
        totalResources={resources.length}
      />

      {/* Alertas Críticas */}
      {criticalAlerts > 0 && (
        <div className="card p-6 bg-danger/20 border-2 border-red-200">
          <h2 className="text-xl font-heading font-bold text-danger mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Alertas Críticas - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {alerts.filter(a => !a.resolved && a.severity === 'critical').map((alert) => (
              <div key={alert.id_alert} className="bg-white border border-red-300 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-white mb-1">{alert.message}</h3>
                    <p className="text-sm text-gray-400">{formatDate(alert.detection_date)}</p>
                  </div>
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de Servidores */}
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-white mb-4">Estado de Servidores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.slice(0, 4).map((server) => (
            <div key={server.id_server} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-white">{server.server_name}</h3>
                  <p className="text-sm text-gray-400">{server.ip_address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServerStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>CPU</span>
                    <span>{server.cpu_usage_percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getUsageColor(server.cpu_usage_percent)}`} style={{ width: `${server.cpu_usage_percent}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>RAM</span>
                    <span>{server.ram_usage_percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getUsageColor(server.ram_usage_percent)}`} style={{ width: `${server.ram_usage_percent}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Disco</span>
                    <span>{server.disk_usage_percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getUsageColor(server.disk_usage_percent)}`} style={{ width: `${server.disk_usage_percent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
