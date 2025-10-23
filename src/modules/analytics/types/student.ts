// Tipos para el módulo de análisis de estudiantes

// ============================================
// Interfaces principales
// ============================================

export interface Student {
    id: number;
    student_id: number;
    user_id: number;
    company_id: number;
    document_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    created_at: string;
    enrollments_count: number;
    company: {
      id: number;
      name: string;
      industry: string;
      contact_name: string;
      contact_email: string;
      created_at: string;
      updated_at: string;
    };
    enrollments: Enrollment[];
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
    academic_period: {
      id: number;
      academic_period_id: number;
      name: string;
      start_date: string;
      end_date: string;
      status: string;
      created_at: string;
    };
    enrollment_details?: EnrollmentDetail[];
  }
  
  export interface EnrollmentDetail {
    id: number;
    enrollment_id: number;
    subject_id: number;
    course_offering_id: number;
    status: string;
    created_at: string;
  }
  
  export interface StudentStatistics {
    total_students: number;
    active_students: number;
    inactive_students: number;
    by_company: Array<{
      company_id: number;
      company_name: string;
      student_count: number;
    }>;
    enrollment_trend: Array<{
      period: string;
      enrolled: number;
    }>;
    by_status: {
      active: number;
      inactive: number;
    };
  }
  
  export interface StudentFilters {
    company_id?: number;
    status?: string;
    enrollment_type?: string;
    academic_period_id?: number;
    search?: string;
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
    total_pages: number;
    total_records: number;
    per_page: number;
  }