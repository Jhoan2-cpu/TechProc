import { useState } from 'react';
import type { Server, License, Storage, TechResource, InfrastructureAlert } from '../types';
import { InfrastructureStats, CriticalAlertsSection, ServerStatusCard } from '../components';

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
      <CriticalAlertsSection alerts={alerts} formatDate={formatDate} />

      {/* Resumen de Servidores */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white mb-4">Estado de Servidores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.slice(0, 4).map((server) => (
            <ServerStatusCard key={server.id_server} server={server} />
          ))}
        </div>
      </div>
    </>
  );
};
