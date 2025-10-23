import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faKey,
  faHdd,
  faExclamationTriangle,
  faPlus,
  faTachometerAlt,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import type {
  Server,
  License,
  Storage,
  Software,
  TechResource,
  InfrastructureAlert,
} from '../types';
import {
  InfrastructureStats,
  ServerCard,
  LicenseCard,
  StorageCard,
  SoftwareCard,
} from '../components';

// Datos mock - Servidores
const mockServers: Server[] = [
  {
    id_server: 1,
    server_name: 'PROD-WEB-01',
    ip_address: '192.168.1.10',
    operating_system: 'Ubuntu Server 22.04 LTS',
    cpu_cores: 8,
    ram_gb: 32,
    disk_gb: 500,
    status: 'online',
    location: 'Datacenter Lima - Rack A1',
    responsible_id: 1,
    installation_date: '2023-01-15',
    last_maintenance: '2024-03-01',
    services_running: ['Apache', 'MySQL', 'Redis'],
    cpu_usage_percent: 45,
    ram_usage_percent: 62,
    disk_usage_percent: 58,
    uptime_hours: 720,
  },
  {
    id_server: 2,
    server_name: 'PROD-DB-01',
    ip_address: '192.168.1.11',
    operating_system: 'CentOS 8',
    cpu_cores: 16,
    ram_gb: 64,
    disk_gb: 2000,
    status: 'online',
    location: 'Datacenter Lima - Rack A2',
    responsible_id: 1,
    installation_date: '2023-02-20',
    last_maintenance: '2024-02-28',
    services_running: ['PostgreSQL', 'MongoDB'],
    cpu_usage_percent: 78,
    ram_usage_percent: 85,
    disk_usage_percent: 72,
    uptime_hours: 680,
  },
  {
    id_server: 3,
    server_name: 'DEV-APP-01',
    ip_address: '192.168.1.20',
    operating_system: 'Windows Server 2022',
    cpu_cores: 4,
    ram_gb: 16,
    disk_gb: 250,
    status: 'maintenance',
    location: 'Oficina Principal',
    responsible_id: 2,
    installation_date: '2023-06-10',
    last_maintenance: '2024-03-15',
    services_running: ['IIS', '.NET Runtime'],
    cpu_usage_percent: 0,
    ram_usage_percent: 0,
    disk_usage_percent: 45,
    uptime_hours: 0,
  },
  {
    id_server: 4,
    server_name: 'BACKUP-01',
    ip_address: '192.168.1.30',
    operating_system: 'Ubuntu Server 22.04 LTS',
    cpu_cores: 4,
    ram_gb: 16,
    disk_gb: 5000,
    status: 'error',
    location: 'Datacenter Lima - Rack B1',
    responsible_id: 1,
    installation_date: '2023-03-01',
    last_maintenance: '2024-03-10',
    services_running: ['Bacula'],
    cpu_usage_percent: 15,
    ram_usage_percent: 30,
    disk_usage_percent: 92,
    uptime_hours: 168,
  },
];

// Datos mock - Licencias
const mockLicenses: License[] = [
  {
    id: 1,
    software_name: 'Microsoft Office 365 Business',
    license_key: 'XXXXX-XXXXX-XXXXX-XXXXX',
    license_type: 'suscripcion',
    provider: 'Microsoft',
    purchase_date: '2023-01-01',
    expiration_date: '2024-12-31',
    seats_total: 50,
    seats_used: 45,
    cost_annual: 3500,
    status: 'active',
    responsible_id: 1,
    notes: 'Renovación automática habilitada',
  },
  {
    id: 2,
    software_name: 'Windows Server 2022 Datacenter',
    license_key: 'YYYYY-YYYYY-YYYYY-YYYYY',
    license_type: 'perpetua',
    provider: 'Microsoft',
    purchase_date: '2023-02-15',
    expiration_date: undefined,
    seats_total: 4,
    seats_used: 4,
    cost_annual: 0,
    status: 'active',
    responsible_id: 1,
    notes: undefined,
  },
  {
    id: 3,
    software_name: 'Adobe Creative Cloud',
    license_key: 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ',
    license_type: 'suscripcion',
    provider: 'Adobe',
    purchase_date: '2023-06-01',
    expiration_date: '2024-04-15',
    seats_total: 10,
    seats_used: 8,
    cost_annual: 6000,
    status: 'expiring_soon',
    responsible_id: 2,
    notes: 'Vence en 30 días - Programar renovación',
  },
  {
    id: 4,
    software_name: 'Antivirus Enterprise',
    license_key: 'AAAAA-BBBBB-CCCCC-DDDDD',
    license_type: 'suscripcion',
    provider: 'Kaspersky',
    purchase_date: '2022-12-01',
    expiration_date: '2024-02-28',
    seats_total: 100,
    seats_used: 95,
    cost_annual: 4200,
    status: 'expired',
    responsible_id: 1,
    notes: 'URGENTE: Renovar licencia vencida',
  },
];

// Datos mock - Almacenamiento
const mockStorage: Storage[] = [
  {
    id_storage: 1,
    storage_name: 'SAN Principal',
    storage_type: 'san',
    capacity_gb: 10000,
    used_gb: 6500,
    location: 'Datacenter Lima',
    server_id: null,
    mount_point: '/mnt/san-primary',
    backup_enabled: true,
    last_backup: '2024-03-15 02:00:00',
    status: 'healthy',
  },
  {
    id_storage: 2,
    storage_name: 'NAS Oficina',
    storage_type: 'nas',
    capacity_gb: 4000,
    used_gb: 3200,
    location: 'Oficina Principal',
    server_id: null,
    mount_point: '/mnt/nas-office',
    backup_enabled: true,
    last_backup: '2024-03-15 03:00:00',
    status: 'warning',
  },
  {
    id_storage: 3,
    storage_name: 'Cloud Storage AWS S3',
    storage_type: 'cloud',
    capacity_gb: 5000,
    used_gb: 4850,
    location: 'AWS us-east-1',
    server_id: null,
    mount_point: 's3://techproc-backup',
    backup_enabled: false,
    last_backup: null,
    status: 'critical',
  },
  {
    id_storage: 4,
    storage_name: 'Disco Local PROD-WEB-01',
    storage_type: 'local',
    capacity_gb: 500,
    used_gb: 290,
    location: 'Datacenter Lima - Rack A1',
    server_id: 1,
    mount_point: '/',
    backup_enabled: true,
    last_backup: '2024-03-15 02:30:00',
    status: 'healthy',
  },
];

// Datos mock - Software
const mockSoftware: Software[] = [
  {
    id_software: 1,
    software_name: 'Apache HTTP Server',
    version: '2.4.57',
    category: 'Web Server',
    vendor: 'Apache Software Foundation',
    license_id: null,
    installation_date: '2023-01-20',
    last_update: '2024-02-10',
    server_ids: [1],
    auto_update: false,
    support_until: '2025-12-31',
  },
  {
    id_software: 2,
    software_name: 'PostgreSQL',
    version: '15.2',
    category: 'Database',
    vendor: 'PostgreSQL Global Development Group',
    license_id: null,
    installation_date: '2023-02-25',
    last_update: '2024-01-15',
    server_ids: [2],
    auto_update: false,
    support_until: '2027-11-11',
  },
  {
    id_software: 3,
    software_name: 'Microsoft IIS',
    version: '10.0',
    category: 'Web Server',
    vendor: 'Microsoft',
    license_id: 2,
    installation_date: '2023-06-15',
    last_update: '2024-03-01',
    server_ids: [3],
    auto_update: true,
    support_until: '2031-10-14',
  },
];

// Datos mock - Recursos Tecnológicos (no usado actualmente)
// @ts-ignore - Reserved for future use
// eslint-disable-next-line
const mockResources: TechResource[] = [
  {
    id_resource: 1,
    resource_type: 'laptop',
    brand: 'Dell',
    model: 'Latitude 5520',
    serial_number: 'DL5520-2023-001',
    purchase_date: '2023-01-15',
    warranty_until: '2026-01-15',
    assigned_to_user: 5,
    status: 'in_use',
    location: 'Oficina Principal - Piso 2',
    notes: 'Asignada a desarrollo',
    cost: 1200,
  },
  {
    id_resource: 2,
    resource_type: 'monitor',
    brand: 'LG',
    model: 'UltraWide 34"',
    serial_number: 'LG34-2023-045',
    purchase_date: '2023-03-20',
    warranty_until: '2025-03-20',
    assigned_to_user: 8,
    status: 'in_use',
    location: 'Oficina Principal - Piso 3',
    notes: null,
    cost: 450,
  },
  {
    id_resource: 3,
    resource_type: 'printer',
    brand: 'HP',
    model: 'LaserJet Pro M404dn',
    serial_number: 'HP404-2022-012',
    purchase_date: '2022-11-10',
    warranty_until: '2024-11-10',
    assigned_to_user: null,
    status: 'available',
    location: 'Oficina Principal - Sala Común',
    notes: 'Para uso compartido',
    cost: 380,
  },
  {
    id_resource: 4,
    resource_type: 'network_device',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    serial_number: 'CS2960-2023-003',
    purchase_date: '2023-02-01',
    warranty_until: '2026-02-01',
    assigned_to_user: null,
    status: 'in_use',
    location: 'Datacenter Lima - Rack A1',
    notes: 'Switch principal datacenter',
    cost: 850,
  },
  {
    id_resource: 5,
    resource_type: 'desktop',
    brand: 'HP',
    model: 'EliteDesk 800',
    serial_number: 'HP800-2021-089',
    purchase_date: '2021-08-15',
    warranty_until: '2023-08-15',
    assigned_to_user: null,
    status: 'maintenance',
    location: 'Taller Técnico',
    notes: 'Actualización de disco duro',
    cost: 750,
  },
];

// Datos mock - Alertas
const mockAlerts: InfrastructureAlert[] = [
  {
    id_alert: 1,
    alert_type: 'storage_full',
    severity: 'critical',
    resource_id: 3,
    resource_type: 'storage',
    message: 'Cloud Storage AWS S3 alcanzó 97% de capacidad',
    detection_date: '2024-03-15 10:00:00',
    resolved: false,
    resolved_date: null,
    resolved_by: null,
  },
  {
    id_alert: 2,
    alert_type: 'license_expiring',
    severity: 'high',
    resource_id: 3,
    resource_type: 'license',
    message: 'Adobe Creative Cloud expira en 30 días',
    detection_date: '2024-03-15 08:00:00',
    resolved: false,
    resolved_date: null,
    resolved_by: null,
  },
  {
    id_alert: 3,
    alert_type: 'high_usage',
    severity: 'medium',
    resource_id: 2,
    resource_type: 'server',
    message: 'PROD-DB-01: CPU al 78%, RAM al 85%',
    detection_date: '2024-03-15 11:30:00',
    resolved: false,
    resolved_date: null,
    resolved_by: null,
  },
];

type InfraTab = 'dashboard' | 'servers' | 'licenses' | 'storage' | 'software';

export const InfrastructurePage = () => {
  const [activeTab, setActiveTab] = useState<InfraTab>('dashboard');
  const [servers] = useState(mockServers);
  const [licenses] = useState(mockLicenses);
  const [storage] = useState(mockStorage);
  const [software] = useState(mockSoftware);
  const [alerts] = useState(mockAlerts);

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const totalStorageCapacity = storage.reduce((sum, s) => sum + s.capacity_gb, 0);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Placeholder handlers for card actions
  const handleDetails = (item: any) => {
    console.log('View details:', item);
  };

  const handleEdit = (item: any) => {
    console.log('Edit:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete:', item);
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

  const tabs = [
    { id: 'dashboard' as InfraTab, name: 'Dashboard', icon: faTachometerAlt },
    { id: 'servers' as InfraTab, name: 'Servidores', icon: faServer },
    { id: 'licenses' as InfraTab, name: 'Licencias', icon: faKey },
    { id: 'storage' as InfraTab, name: 'Almacenamiento', icon: faHdd },
    { id: 'software' as InfraTab, name: 'Software', icon: faCog },
  ];

  const renderDashboard = () => (
    <>
      {/* Estadísticas */}
      <InfrastructureStats
        onlineServers={onlineServers}
        totalServers={servers.length}
        activeLicenses={activeLicenses}
        totalLicenses={licenses.length}
        criticalAlerts={criticalAlerts}
        totalStorage={totalStorageCapacity}
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

  const renderServers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Control Digital de Servidores</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Servidor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {servers.map((server, index) => (
          <ServerCard
            key={server.id_server}
            server={server}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Licencias</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nueva Licencia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {licenses.map((license, index) => (
          <LicenseCard
            key={license.id}
            license={license}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Almacenamiento</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Almacenamiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storage.map((store, index) => (
          <StorageCard
            key={store.id_storage}
            storage={store}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );

  const renderSoftware = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Software</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Registrar Software
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {software.map((soft, index) => (
          <SoftwareCard
            key={soft.id_software}
            software={soft}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-6">
          infrastructure/dashboard
        </h1>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-900/20'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'servers' && renderServers()}
      {activeTab === 'licenses' && renderLicenses()}
      {activeTab === 'storage' && renderStorage()}
      {activeTab === 'software' && renderSoftware()}
    </div>
  );
};
