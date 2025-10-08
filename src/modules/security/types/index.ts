// Enums
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'false_alarm';
export type BackupType = 'complete' | 'incremental' | 'differential';
export type BackupStatus = 'completed' | 'failed' | 'in_progress';

// Interfaces
export interface SecurityLog {
  id_security_log: number;
  user_id: number;
  event_type: string;
  description: string;
  source_ip: string;
  event_date: string;
}

export interface Incident {
  id_incident: number;
  alert_id: number;
  responsible_id: number;
  title: string;
  status: IncidentStatus;
  report_date: string;
}

export interface SecurityAlert {
  id_security_alert: number;
  id_blocked_ip: number | null;
  threat_type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  detection_date: string;
}

export interface BlockedIP {
  id_blocked_ip: number;
  ip_address: string;
  reason: string;
  block_date: string;
  active: boolean;
}

export interface ActiveSession {
  session_id: number;
  user_id: number;
  ip_address: string;
  device: string;
  start_date: string;
  active: boolean;
}

export interface SecurityConfiguration {
  id_security_configuration: number;
  user_id: number;
  modulo: string;
  parameter: string;
  value: string;
  active: boolean;
}

export interface Backup {
  id_backup: number;
  user_id: number;
  type: BackupType;
  status: BackupStatus;
  backup_date: string;
  size_mb: number;
}

export interface BlockedUser {
  id_blocked_user: number;
  user_id: number;
  user_name: string;
  user_email: string;
  reason: string;
  block_date: string;
  unblock_date?: string;
  blocked_by: number;
  blocked_by_name: string;
  active: boolean;
}
