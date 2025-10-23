// src/modules/analytics/types/grades.ts
// Tipos para el módulo de análisis de calificaciones

// ============================================
// Interfaces principales
// ============================================

export interface GradeStatistics {
  total_grades_recorded: number;
  average_grade: number;
  passing_rate: number;
  by_group: GroupStatistics[];
  top_performers: TopPerformer[];
}

export interface GroupStatistics {
  group_id: number;
  group_name: string;
  course_name: string;
  total_grades: string;
  average_grade: string;
  passing_rate: string;
}

export interface TopPerformer {
  user_id: number;
  first_name: string;
  last_name: string;
  average_grade: string;
  total_grades: string;
}

export interface GradeRecord {
  id: number;
  evaluation_id: number;
  user_id: number;
  obtained_grade: string;
  feedback: string;
  record_date: string;
  created_at: string;
  updated_at: string;
  user: User;
  evaluation: Evaluation;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  dni: string;
  document: string;
  email: string;
  phone_number: string;
  role: string[];
  gender: string;
  status: string;
  student?: Student;
}

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
  status: string;
  created_at: string;
}

export interface Evaluation {
  id: number;
  group_id: number;
  title: string;
  description: string;
  external_url: string | null;
  evaluation_type: string;
  due_date: string;
  weight: string;
  teacher_creator_id: number;
  created_at: string;
  updated_at: string;
  group: Group;
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
  course: Course;
}

export interface Course {
  id: number;
  course_id: number;
  title: string;
  name: string;
  description: string;
  level: string;
  duration: string;
  sessions: number;
  selling_price: string;
  discount_price: string;
  prerequisites: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradeReportData {
  current_page: number;
  data: GradeRecord[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface FilterOptions {
  courses: CourseOption[];
  academicPeriods: AcademicPeriodOption[];
}

export interface CourseOption {
  id: number;
  name: string;
  title: string;
}

export interface AcademicPeriodOption {
  id: number;
  name: string;
}

// ============================================
// Filtros
// ============================================

export interface GradeFilters {
  course_id?: number;
  academic_period_id?: number;
  grade_type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

// ============================================
// Respuestas de la API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}