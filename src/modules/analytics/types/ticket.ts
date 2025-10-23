// Tipos para el módulo de análisis de tickets

// ============================================
// Interfaces principales
// ============================================

export interface Ticket {
    id: number;
    ticket_id: number;
    title: string;
    description: string;
    priority: 'baja' | 'media' | 'alta' | 'critica';
    status: 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado';
    category: string;
    creation_date: string;
    assignment_date: string | null;
    resolution_date: string | null;
    close_date: string | null;
    assigned_technician: {
      id: number;
      name: string;
    } | null;
    escalations_count: number;
  }
  
  export interface TicketStatistics {
    total_tickets: number;
    by_status: {
      [key: string]: number;
    };
    by_priority: {
      [key: string]: number;
    };
    by_category: {
      [key: string]: number;
    };
    resolution_metrics: ResolutionMetrics;
    technician_performance: TechnicianPerformance[];
    escalation_rate: number;
  }
  
  export interface ResolutionMetrics {
    average_resolution_time_hours: number;
    median_resolution_time_hours: number;
    first_response_time_hours: number;
  }
  
  export interface TechnicianPerformance {
    technician_id: number;
    technician_name: string;
    tickets_resolved: number;
    average_resolution_time_hours: number;
  }
  
  export interface CategoryStatistic {
    category: string;
    total_tickets: number;
    open_tickets: number;
    resolved_tickets: number;
    average_resolution_time: number;
    escalation_count: number;
  }
  
  export interface TechnicianRanking {
    rank: number;
    technician_id: number;
    technician_name: string;
    total_tickets: number;
    resolved_tickets: number;
    resolution_rate: number;
    average_resolution_time: number;
    escalation_count: number;
  }
  
  export interface TicketFilters {
    start_date?: string;
    end_date?: string;
    category?: string;
    priority?: 'baja' | 'media' | 'alta' | 'critica';
    status?: 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado';
    technician_id?: number;
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
    total_pages?: number;
    total_records?: number;
    per_page?: number;
  }