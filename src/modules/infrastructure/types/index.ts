// Enums
export type ServerStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type LicenseStatus = 'active' | 'expired' | 'expiring_soon' | 'suspended';
export type LicenseType = 'perpetua' | 'suscripcion' | 'trial';
export type StorageType = 'local' | 'cloud' | 'nas' | 'san';
export type ResourceStatus = 'available' | 'in_use' | 'maintenance' | 'retired';


export * from './license.types';
export * from './software.types';
// Interfaces - Servidores
export interface Server {
  id_server: number;
  server_name: string;
  ip_address: string;
  operating_system: string;
  cpu_cores: number;
  ram_gb: number;
  disk_gb: number;
  status: ServerStatus;
  location: string;
  responsible_id: number;
  installation_date: string;
  last_maintenance: string | null;
  services_running: string[];
  cpu_usage_percent: number;
  ram_usage_percent: number;
  disk_usage_percent: number;
  uptime_hours: number;
}


// Interfaces - Almacenamiento
export interface Storage {
  id_storage: number;
  storage_name: string;
  storage_type: StorageType;
  capacity_gb: number;
  used_gb: number;
  location: string;
  server_id: number | null;
  mount_point: string;
  backup_enabled: boolean;
  last_backup: string | null;
  status: 'healthy' | 'warning' | 'critical';
}

// Interfaces - Software Instalado
export interface Software {
  id_software: number;
  software_name: string;
  version: string;
  category: string;
  vendor: string;
  license_id: number | null;
  installation_date: string;
  last_update: string | null;
  server_ids: number[];
  auto_update: boolean;
  support_until: string | null;
}

// Interfaces - Recursos Tecnológicos
export interface TechResource {
  id_resource: number;
  resource_type: string; // 'laptop', 'desktop', 'monitor', 'printer', 'network_device', etc.
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_until: string | null;
  assigned_to_user: number | null;
  status: ResourceStatus;
  location: string;
  notes: string | null;
  cost: number;
}

// Interfaces - Mantenimiento de Servidores
export interface ServerMaintenance {
  id_maintenance: number;
  server_id: number;
  technician_id: number;
  maintenance_type: 'preventivo' | 'correctivo' | 'actualizacion';
  description: string;
  scheduled_date: string;
  completion_date: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  downtime_hours: number | null;
  notes: string | null;
}

// Interfaces - Alertas de Infraestructura
export interface InfrastructureAlert {
  id_alert: number;
  alert_type: 'server_down' | 'high_usage' | 'license_expiring' | 'storage_full' | 'hardware_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resource_id: number;
  resource_type: 'server' | 'storage' | 'license' | 'resource';
  message: string;
  detection_date: string;
  resolved: boolean;
  resolved_date: string | null;
  resolved_by: number | null;
}
