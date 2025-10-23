// Tipos para el módulo de dashboard

// ============================================
// Interfaces principales
// ============================================

export interface DashboardSummary {
    students: StudentMetrics;
    courses: CourseMetrics;
    attendance: AttendanceMetrics;
    performance: PerformanceMetrics;
    revenue: RevenueMetrics;
    support: SupportMetrics;
    security: SecurityMetrics;
    recent_activities: RecentActivity[];
  }
  
  export interface StudentMetrics {
    total: number;
    active: number;
    growth_rate: number;
  }
  
  export interface CourseMetrics {
    total: number;
    active: number;
    total_enrollments: number;
  }
  
  export interface AttendanceMetrics {
    average_rate: number;
    trend: 'up' | 'down';
  }
  
  export interface PerformanceMetrics {
    average_grade: number;
    passing_rate: number;
  }
  
  export interface RevenueMetrics {
    total: number;
    growth_rate: number;
  }
  
  export interface SupportMetrics {
    open_tickets: number;
    average_resolution_time_hours: number;
  }
  
  export interface SecurityMetrics {
    active_alerts: number;
    blocked_ips: number;
  }
  
  export interface RecentActivity {
    type: 'student' | 'ticket' | 'payment' | 'enrollment' | 'security';
    description: string;
    timestamp: string;
    icon?: string;
    color?: string;
  }
  
  // ============================================
  // Métricas específicas
  // ============================================
  
  export interface StudentMetricsDetail {
    students: StudentMetrics;
    by_company: CompanyStudentCount[];
  }
  
  export interface CompanyStudentCount {
    company_id: number;
    company_name: string;
    student_count: number;
  }
  
  export interface FinancialMetricsDetail {
    revenue: RevenueMetrics;
    revenue_sources: RevenueSource[];
    monthly_trend: MonthlyRevenue[];
  }
  
  export interface RevenueSource {
    source_id: number;
    source_name: string;
    amount: number;
    percentage: number;
  }
  
  export interface MonthlyRevenue {
    month: string;
    revenue: number;
  }
  
  // ============================================
  // Filtros
  // ============================================
  
  export interface DashboardFilters {
    start_date?: string;
    end_date?: string;
    company_id?: number;
    academic_period_id?: number;
  }
  
  // ============================================
  // Respuestas de la API
  // ============================================
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }