// Tipos para el módulo de análisis de seguridad

// ============================================
// Interfaces principales
// ============================================

export interface SecurityEvent {
    id: number;
    id_security_log: number;
    user_id: number;
    event_type: string;
    description: string;
    source_ip: string;
    event_date: string;
    user: SecurityUser;
  }
  
  export interface SecurityUser {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    dni: string;
    document: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
    address: string | null;
    birth_date: string | null;
    role: string[];
    gender: string;
    country: string;
    timezone: string;
    profile_photo: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface SecurityAlert {
    id: number;
    id_security_alert: number;
    threat_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    blocked_ip_id: number;
    detection_date: string;
    blocked_ip: BlockedIp;
    incidents: Incident[];
  }
  
  export interface BlockedIp {
    id: number;
    id_blocked_ip: number;
    ip_address: string;
    reason: string;
    block_date: string;
    active: boolean;
  }
  
  export interface Incident {
    id: number;
    id_incident: number;
    alert_id: number;
    responsible_id: number;
    title: string;
    status: string;
    report_date: string;
  }
  
  export interface SecurityAnalysis {
    total_security_events: number;
    by_event_type: {
      [key: string]: number;
    };
    blocked_ips: {
      total: number;
      active: number;
      this_period: number;
    };
    security_alerts: {
      total: number;
      by_severity: {
        low?: number;
        medium?: number;
        high?: number;
        critical?: number;
      };
    };
    incidents: {
      total: number;
      resolved: number;
      in_progress: number;
    };
    failed_login_rate: number;
    top_threat_ips: ThreatIp[];
  }
  
  export interface ThreatIp {
    ip_address: string;
    attempt_count: number;
    blocked: boolean;
  }
  
  export interface DashboardData {
    summary: {
      total_events: number;
      total_alerts: number;
      total_incidents: number;
      active_blocked_ips: number;
      failed_login_rate: number;
    };
    recent_events: SecurityEvent[];
  }
  
  export interface SecurityFilters {
    start_date?: string;
    end_date?: string;
    event_type?: string;
    ip_address?: string;
    severity?: string;
    status?: string;
    per_page?: number;
    page?: number;
  }
  
  // ============================================
  // Respuestas de la API
  // ============================================
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    total?: number;
    per_page?: number;
    last_page?: number;
  }