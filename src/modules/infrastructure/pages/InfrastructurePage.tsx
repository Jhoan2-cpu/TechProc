import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faKey,
  faHdd,
  faLaptop,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faChartLine,
  faPlus,
  faEdit,
  faTrash,
  faTachometerAlt,
  faTools,
  faCog,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import type {
  Server,
  License,
  Storage,
  Software,
  TechResource,
  InfrastructureAlert,
} from '../types';

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
    id_license: 1,
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
    id_license: 2,
    software_name: 'Windows Server 2022 Datacenter',
    license_key: 'YYYYY-YYYYY-YYYYY-YYYYY',
    license_type: 'perpetua',
    provider: 'Microsoft',
    purchase_date: '2023-02-15',
    expiration_date: null,
    seats_total: 4,
    seats_used: 4,
    cost_annual: 0,
    status: 'active',
    responsible_id: 1,
    notes: null,
  },
  {
    id_license: 3,
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
    id_license: 4,
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

// Datos mock - Recursos Tecnológicos
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

type InfraTab = 'dashboard' | 'servers' | 'licenses' | 'storage' | 'software' | 'resources';

export const InfrastructurePage = () => {
  const [activeTab, setActiveTab] = useState<InfraTab>('dashboard');
  const [servers] = useState(mockServers);
  const [licenses] = useState(mockLicenses);
  const [storage] = useState(mockStorage);
  const [software] = useState(mockSoftware);
  const [resources] = useState(mockResources);
  const [alerts] = useState(mockAlerts);

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
      case 'online': return 'bg-green-100 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'expiring_soon': return 'bg-orange-100 text-orange-700';
      case 'suspended': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStorageStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const tabs = [
    { id: 'dashboard' as InfraTab, name: 'Dashboard', icon: faTachometerAlt },
    { id: 'servers' as InfraTab, name: 'Servidores', icon: faServer },
    { id: 'licenses' as InfraTab, name: 'Licencias', icon: faKey },
    { id: 'storage' as InfraTab, name: 'Almacenamiento', icon: faHdd },
    { id: 'software' as InfraTab, name: 'Software', icon: faCog },
    { id: 'resources' as InfraTab, name: 'Recursos', icon: faLaptop },
  ];

  const renderDashboard = () => (
    <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Servidores Online</p>
              <p className="text-3xl font-heading font-bold text-green-900">{onlineServers}/{servers.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faServer} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Licencias Activas</p>
              <p className="text-3xl font-heading font-bold text-blue-900">{activeLicenses}/{licenses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Alertas Críticas</p>
              <p className="text-3xl font-heading font-bold text-red-900">{criticalAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Recursos en Uso</p>
              <p className="text-3xl font-heading font-bold text-purple-900">{resourcesInUse}/{resources.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faLaptop} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Críticas */}
      {criticalAlerts > 0 && (
        <div className="card p-6 bg-red-50 border-2 border-red-200">
          <h2 className="text-xl font-heading font-bold text-red-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Alertas Críticas - ¡Atención Inmediata!
          </h2>
          <div className="space-y-3">
            {alerts.filter(a => !a.resolved && a.severity === 'critical').map((alert) => (
              <div key={alert.id_alert} className="bg-white border border-red-300 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-secondary-900 mb-1">{alert.message}</h3>
                    <p className="text-sm text-secondary-600">{formatDate(alert.detection_date)}</p>
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
        <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">Estado de Servidores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.slice(0, 4).map((server) => (
            <div key={server.id_server} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-secondary-900">{server.server_name}</h3>
                  <p className="text-sm text-secondary-600">{server.ip_address}</p>
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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Control Digital de Servidores</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Servidor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {servers.map((server, index) => (
          <div
            key={server.id_server}
            className="card p-6 hover:shadow-lg transition-all animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-secondary-900">{server.server_name}</h3>
                    <p className="text-secondary-600">{server.operating_system}</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      <FontAwesomeIcon icon={faServer} className="mr-1" />
                      IP: <span className="font-mono">{server.ip_address}</span>
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getServerStatusColor(server.status)}`}>
                    {server.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-600">CPU</p>
                    <p className="text-lg font-bold text-secondary-900">{server.cpu_cores} Cores</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-600">RAM</p>
                    <p className="text-lg font-bold text-secondary-900">{server.ram_gb} GB</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-600">Disco</p>
                    <p className="text-lg font-bold text-secondary-900">{server.disk_gb} GB</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs text-secondary-600">Uptime</p>
                    <p className="text-lg font-bold text-secondary-900">{Math.floor(server.uptime_hours / 24)}d</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary-700">Uso CPU</span>
                      <span className="font-semibold">{server.cpu_usage_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${getUsageColor(server.cpu_usage_percent)}`} style={{ width: `${server.cpu_usage_percent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary-700">Uso RAM</span>
                      <span className="font-semibold">{server.ram_usage_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${getUsageColor(server.ram_usage_percent)}`} style={{ width: `${server.ram_usage_percent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary-700">Uso Disco</span>
                      <span className="font-semibold">{server.disk_usage_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${getUsageColor(server.disk_usage_percent)}`} style={{ width: `${server.disk_usage_percent}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                    <span>📍 {server.location}</span>
                    <span>🔧 Mantenimiento: {formatDate(server.last_maintenance)}</span>
                    <span>⚙️ Servicios: {server.services_running.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 lg:w-40">
                <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Monitorear
                </button>
                <button className="btn bg-yellow-600 hover:bg-yellow-700 text-white flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Mantenimiento
                </button>
                <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Licencias</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nueva Licencia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {licenses.map((license, index) => (
          <div
            key={license.id_license}
            className={`card p-6 animate-fade-in ${license.status === 'expired' || license.status === 'expiring_soon' ? 'border-2 border-orange-300' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-secondary-900">{license.software_name}</h3>
                    <p className="text-sm text-secondary-600">{license.provider}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getLicenseStatusColor(license.status)}`}>
                    {license.status === 'expiring_soon' ? 'Por Vencer' : license.status === 'expired' ? 'Vencida' : 'Activa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-secondary-600">Tipo</p>
                    <p className="font-semibold text-secondary-900 capitalize">{license.license_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Licencias Usadas</p>
                    <p className="font-semibold text-secondary-900">{license.seats_used}/{license.seats_total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Costo Anual</p>
                    <p className="font-semibold text-secondary-900">S/ {license.cost_annual.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Vencimiento</p>
                    <p className="font-semibold text-secondary-900">{formatDate(license.expiration_date)}</p>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-secondary-600 mb-1">Clave de Licencia</p>
                  <p className="font-mono text-sm text-secondary-900">{license.license_key}</p>
                </div>

                {license.notes && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
                    <p className="text-sm text-secondary-700">{license.notes}</p>
                  </div>
                )}

                <div className="mt-3 text-sm text-secondary-600">
                  Fecha de compra: {formatDate(license.purchase_date)}
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 lg:w-40">
                {license.status === 'expired' || license.status === 'expiring_soon' ? (
                  <button className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1 lg:flex-none">
                    Renovar
                  </button>
                ) : null}
                <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Editar
                </button>
                <button className="btn bg-red-600 hover:bg-red-700 text-white flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Almacenamiento</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Almacenamiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storage.map((store, index) => (
          <div
            key={store.id_storage}
            className={`card p-6 animate-fade-in ${store.status === 'critical' ? 'border-2 border-red-300' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-secondary-900">{store.storage_name}</h3>
                <p className="text-sm text-secondary-600 capitalize">{store.storage_type.replace('_', ' ')}</p>
              </div>
              <FontAwesomeIcon
                icon={store.status === 'healthy' ? faCheckCircle : store.status === 'warning' ? faExclamationTriangle : faTimesCircle}
                className={`text-2xl ${getStorageStatusColor(store.status)}`}
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary-700">Uso de Almacenamiento</span>
                <span className="font-semibold">{store.used_gb} GB / {store.capacity_gb} GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${getUsageColor((store.used_gb / store.capacity_gb) * 100)}`}
                  style={{ width: `${(store.used_gb / store.capacity_gb) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {((store.used_gb / store.capacity_gb) * 100).toFixed(1)}% utilizado -
                {(store.capacity_gb - store.used_gb).toFixed(0)} GB libres
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Ubicación:</span>
                <span className="font-medium text-secondary-900">{store.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Punto de montaje:</span>
                <span className="font-mono text-secondary-900 text-xs">{store.mount_point}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Backup:</span>
                <span className={store.backup_enabled ? 'text-green-700' : 'text-red-700'}>
                  {store.backup_enabled ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
              {store.last_backup && (
                <div className="flex justify-between">
                  <span className="text-secondary-600">Último backup:</span>
                  <span className="text-secondary-900">{formatDate(store.last_backup)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200">
              <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Ver Detalles
              </button>
              <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSoftware = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Software</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Registrar Software
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {software.map((soft, index) => (
          <div
            key={soft.id_software}
            className="card p-6 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-secondary-900">{soft.software_name}</h3>
                    <p className="text-secondary-600">Versión {soft.version}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {soft.category}
                    </span>
                    {soft.auto_update && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Auto-Update
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-secondary-600">Proveedor</p>
                    <p className="font-semibold text-secondary-900">{soft.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Instalación</p>
                    <p className="font-semibold text-secondary-900">{formatDate(soft.installation_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Última Actualización</p>
                    <p className="font-semibold text-secondary-900">{formatDate(soft.last_update)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-600">Soporte hasta</p>
                    <p className="font-semibold text-secondary-900">{formatDate(soft.support_until)}</p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-secondary-600">
                  <span>Instalado en {soft.server_ids.length} servidor(es)</span>
                  {soft.license_id && <span>Licencia #{soft.license_id}</span>}
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 lg:w-40">
                <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Actualizar
                </button>
                <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex-1 lg:flex-none">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Recursos Tecnológicos</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Recurso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div
            key={resource.id_resource}
            className="card p-6 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-secondary-900 capitalize">
                  {resource.resource_type.replace('_', ' ')}
                </h3>
                <p className="text-sm text-secondary-600">{resource.brand} {resource.model}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                resource.status === 'in_use' ? 'bg-green-100 text-green-700' :
                resource.status === 'available' ? 'bg-blue-100 text-blue-700' :
                resource.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {resource.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-600">S/N:</span>
                <span className="font-mono text-secondary-900 text-xs">{resource.serial_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Ubicación:</span>
                <span className="text-secondary-900">{resource.location}</span>
              </div>
              {resource.assigned_to_user && (
                <div className="flex justify-between">
                  <span className="text-secondary-600">Asignado a:</span>
                  <span className="text-secondary-900">Usuario #{resource.assigned_to_user}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-secondary-600">Garantía:</span>
                <span className={new Date(resource.warranty_until || '') > new Date() ? 'text-green-700' : 'text-red-700'}>
                  {formatDate(resource.warranty_until)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Costo:</span>
                <span className="font-semibold text-secondary-900">S/ {resource.cost.toLocaleString()}</span>
              </div>
            </div>

            {resource.notes && (
              <div className="bg-secondary-50 rounded p-2 mb-4">
                <p className="text-xs text-secondary-700">{resource.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex-1">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Editar
              </button>
              <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
          Gestión de Infraestructura
        </h1>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-50'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
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
      {activeTab === 'resources' && renderResources()}
    </div>
  );
};
