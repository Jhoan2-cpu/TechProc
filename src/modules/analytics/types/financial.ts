// Tipos para el módulo de análisis financiero

// ============================================
// Interfaces principales
// ============================================

export interface FinancialStatistics {
    total_revenue: number;
    total_expenses: number;
    net_income: number;
    by_revenue_source: RevenueBySource[];
    revenue_trend: RevenueTrendItem[];
    pending_payments: PendingPaymentsSummary;
    additional_metrics: AdditionalMetrics;
    filters_applied: FiltersApplied;
  }
  
  export interface RevenueBySource {
    source_id: number;
    source_name: string;
    amount: string;
  }
  
  export interface RevenueTrendItem {
    period: string;
    period_label: string;
    revenue: string;
  }
  
  export interface PendingPaymentsSummary {
    count: number;
    total_amount: number;
  }
  
  export interface AdditionalMetrics {
    paid_invoices: number;
    total_invoices: number;
    collection_rate: number;
    average_invoice_amount: number;
  }
  
  export interface FiltersApplied {
    start_date: string | null;
    end_date: string | null;
    revenue_source_id: number | null;
  }
  
  export interface RevenueSource {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface PendingPayment {
    id: number;
    enrollment_id: number;
    revenue_source_id: number;
    invoice_number: string;
    issue_date: string;
    total_amount: string;
    status: string;
    created_at: string;
    updated_at: string;
    days_overdue: number;
    revenue_source: RevenueSource;
    enrollment: Enrollment;
  }
  
  export interface Enrollment {
    id: number;
    enrollment_id: number;
    student_id: number;
    academic_period_id: number;
    enrollment_type: string;
    enrollment_date: string;
    status: string;
    created_at: string;
  }
  
  export interface PendingPaymentsData {
    summary: PendingPaymentsSummary;
    invoices: PendingPayment[];
    pagination: PaginationData;
  }
  
  export interface PaginationData {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }
  
  // ============================================
  // Filtros
  // ============================================
  
  export interface FinancialFilters {
    start_date?: string;
    end_date?: string;
    revenue_source_id?: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    page?: number;
    per_page?: number;
  }
  
  // ============================================
  // Respuestas de la API
  // ============================================
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }