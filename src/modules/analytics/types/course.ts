// Tipos para el módulo de análisis de cursos

// ============================================
// Interfaces principales
// ============================================

export interface Course {
    id: number;
    course_id: number;
    title: string;
    name: string;
    description: string;
    level: string;
    course_image: string | null;
    video_url: string | null;
    duration: string;
    sessions: number;
    selling_price: string;
    discount_price: string;
    prerequisites: string;
    certificate_name: boolean;
    certificate_issuer: string;
    bestseller: boolean;
    featured: boolean;
    highest_rated: boolean;
    status: boolean;
    created_at: string;
    updated_at: string;
    course_offerings_count: number;
    groups_count: number;
    enrollments_count: number;
    instructors_count: number;
    instructors_data?: CourseInstructor[];
    course_offerings?: CourseOffering[];
    groups?: Group[];
    course_contents?: any[];
  }
  
  export interface CourseInstructor {
    id: number;
    assigned_date: string;
    instructor: Instructor;
  }
  
  export interface Instructor {
    id: number;
    bio: string;
    expertise_area: string;
    status: string;
    user: InstructorUser;
  }
  
  export interface InstructorUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }
  
  export interface CourseOffering {
    id: number;
    course_offering_id: number;
    course_id: number;
    academic_period_id: number;
    instructor_id: number;
    schedule: string;
    delivery_method: string;
    created_at: string;
    enrollment_details?: EnrollmentDetail[];
  }
  
  export interface EnrollmentDetail {
    id: number;
    enrollment_id: number;
    subject_id: number;
    course_offering_id: number;
    status: string;
    created_at: string;
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
  
  export interface Group {
    id: number;
    course_id: number;
    code: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CourseStatistics {
    total_courses: number;
    active_courses: number;
    inactive_courses: number;
    by_level: {
      basic: number;
      intermediate: number;
      advanced: number;
    };
    most_enrolled: MostEnrolledCourse[];
    bestsellers: BestsellerCourse[];
  }
  
  export interface MostEnrolledCourse {
    course_id: number;
    course_title: string;
    enrollments: number;
  }
  
  export interface BestsellerCourse {
    course_id: number;
    course_title: string;
    revenue: number;
  }
  
  export interface CourseFilters {
    search?: string;
    level?: string;
    status?: boolean;
    bestseller?: boolean;
    featured?: boolean;
    start_date?: string;
    end_date?: string;
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
    per_page: number;
    last_page?: number;
    total?: number;
  }