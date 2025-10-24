// ===================================================================
// TIPOS DEL MÓDULO LMS - CENTRALIZADOS
// ===================================================================
// Este archivo contiene TODOS los tipos e interfaces del módulo LMS
// Todos los servicios, componentes y páginas deben importar desde aquí
// ===================================================================

// -------------------------------------------------------------------
// TIPOS BÁSICOS
// -------------------------------------------------------------------
export type CourseStatus = 'publicado' | 'borrador' | 'archivado';
export type UserRole = 'student' | 'instructor' | 'employees';
export type Gender = 'M' | 'F' | 'Otro';
export type InstructorStatus = 'activo' | 'inactivo' | 'suspendido';
export type ContentType = 'pdf' | 'video' | 'link' | 'anuncio';
export type CourseLevel = 'basic' | 'intermediate' | 'advanced';
export type ApiStatus = 'active' | 'inactive';

// -------------------------------------------------------------------
// TIPOS DE PAGINACIÓN
// -------------------------------------------------------------------
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
}

// -------------------------------------------------------------------
// MODELOS DEL FRONTEND
// -------------------------------------------------------------------

// Usuario base
export interface BaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  address: string;
  birth_date: string;
  gender: Gender;
  country_location: string;
  profile_photo: string | null;
  role: UserRole;
  state: string;
  last_access_ip: string | null;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

// Estudiante
export interface Student extends BaseUser {
  role: 'student';
  phone?: string;
  document_number?: string;
  company?: {
    id: number;
    name: string;
    industry?: string;
  };
  enrollments?: Array<{
    enrollment_id: number;
    course_title: string;
    enrollment_date: string;
    status: string;
  }>;
}

// Instructor
export interface Instructor extends BaseUser {
  role: 'instructor';
  bio: string;
  expertise_area: string;
  status: InstructorStatus;
  courses_count?: number;
  instructor_id?: number;
  user_id?: number;
  name?: string;
}

// Curso
export interface Course {
  id: string;
  course_id?: number;
  title: string;
  code: string;
  description: string;
  level?: CourseLevel;
  course_image?: string;
  duration?: number; // duración en horas
  sessions?: number;
  selling_price?: number;
  discount_price?: number;
  bestseller?: boolean;
  featured?: boolean;
  highest_rated?: boolean;
  instructor_id: string;
  instructor?: Instructor;
  duration_weeks: number;
  price: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

// Contenido del curso
export interface CourseContent {
  id: string;
  course_id: string;
  week: number;
  session: number;
  type: ContentType;
  title: string;
  content: string; // URL o contenido del anuncio
  order: number;
  created_at: string;
}


// Categoría
export interface Category {
  id: string;
  category_id: number | null;
  name: string;
  slug: string;
  image?: string;
  courses_count: number;
  created_at: string;
}

// -------------------------------------------------------------------
// ESTADÍSTICAS Y DASHBOARD
// -------------------------------------------------------------------

// Estadísticas del Dashboard
export interface LMSStats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_students: number;
  active_enrollments: number;
  total_instructors: number;
}

// Cursos recientes (para dashboard)
export interface RecentCourse {
  id: string;
  title: string;
  code: string;
  instructor_name: string;
  status: CourseStatus;
  created_at: string;
}


// -------------------------------------------------------------------
// TIPOS DE LA API - Responses
// -------------------------------------------------------------------

// Courses
export interface CoursesListResponse {
  success: boolean;
  data: {
    courses: ApiCourse[];
    pagination: Pagination;
  };
}

export interface CourseDetailResponse {
  success: boolean;
  data: ApiCourseDetail;
}

export interface CourseCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    course_id: number;
  };
}

export interface CourseUpdateResponse {
  success: boolean;
  message: string;
}

export interface CourseDeleteResponse {
  success: boolean;
  message: string;
}

// Students
export interface StudentsListResponse {
  success: boolean;
  data: {
    students: ApiStudent[];
    pagination: Pagination;
  };
}

export interface StudentDetailResponse {
  success: boolean;
  data: ApiStudentDetail;
}

export interface StudentCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    student_id: number;
  };
}

export interface StudentUpdateResponse {
  success: boolean;
  message: string;
}

export interface StudentDeleteResponse {
  success: boolean;
  message: string;
}

// Instructors
export interface InstructorsListResponse {
  success: boolean;
  data: {
    instructors: ApiInstructor[];
    pagination: Pagination;
  };
}

export interface InstructorCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    instructor_id: number;
  };
}

export interface InstructorUpdateResponse {
  success: boolean;
  message: string;
}


// Categories
export interface CategoriesListResponse {
  success: boolean;
  data: ApiCategory[];
}

// Analytics
export interface StudentsStatsResponse {
  success: boolean;
  data: {
    total_students: number;
    active_students: number;
    inactive_students: number;
  };
}

export interface CoursesStatsResponse {
  success: boolean;
  data: {
    total_courses: number;
    active_courses: number;
    inactive_courses: number;
  };
}

// -------------------------------------------------------------------
// TIPOS DE LA API - Modelos
// -------------------------------------------------------------------

// Curso de la API
export interface ApiCourse {
  id: number;
  course_id: number;
  title: string;
  name?: string | null;
  description: string;
  level: CourseLevel;
  course_image?: string | null;
  duration: number;
  sessions: number;
  selling_price: number;
  discount_price?: number;
  status: boolean;
  bestseller?: boolean;
  featured?: boolean;
  highest_rated?: boolean;
  created_at: string;
}

export interface ApiCourseDetail extends ApiCourse {
  video_url?: string | null;
  prerequisites?: string;
  certificate_name?: boolean;
  certificate_issuer?: string;
  highest_rated?: boolean;
  categories?: Array<{
    category_id: number;
    name: string;
    slug: string;
  }>;
  instructors?: Array<{
    instructor_id: number;
    user_id: number;
    name: string;
    expertise_area: string;
    email?: string;
  }>;
  contents?: Array<{
    id: number;
    session: number;
    type: string;
    title: string;
    order_number: number;
  }>;
  updated_at?: string;
}

// Estudiante de la API
export interface ApiStudent {
  id: number;
  student_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: ApiStatus;
  company?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface ApiStudentDetail extends ApiStudent {
  document_number?: string;
  company?: {
    id: number;
    name: string;
    industry?: string;
  };
  enrollments?: Array<{
    enrollment_id: number;
    course_title: string;
    enrollment_date: string;
    status: string;
  }>;
}

// Instructor de la API
export interface ApiInstructor {
  id: number;
  instructor_id: number;
  user_id: number;
  name: string;
  email: string;
  bio: string;
  expertise_area: string;
  status: ApiStatus;
  courses_count?: number;
  created_at: string;
}


// Categoría de la API (primera definición - comentada porque se duplica más adelante)
// export interface ApiCategory {
//   id: number;
//   category_id: number;
//   name: string;
//   slug: string;
//   image?: string;
//   courses_count: number;
//   created_at: string;
// }

// Sub-objetos de la API
export interface ApiContent {
  id: number;
  session: number;
  type: string;
  title: string;
  order_number: number;
}

// Tipo principal del curso detallado (actualizado según API)
export interface CourseDetail {
  id: string;
  course_id?: number;
  title: string;
  description: string;
  level: CourseLevel;
  course_image?: string | null;
  video_url?: string | null;
  duration: number;
  sessions: number;
  selling_price: number;
  discount_price?: number;
  prerequisites?: string;
  certificate_name?: boolean;
  certificate_issuer?: string;
  bestseller?: boolean;
  featured?: boolean;
  highest_rated?: boolean;
  status: boolean;
  categories?: Array<{
    category_id: number;
    name: string;
    slug: string;
  }>;
  instructors?: Array<{
    instructor_id: number;
    user_id: number;
    name: string;
    expertise_area: string;
    email?: string;
  }>;
  contents?: Array<{
    id: number;
    session: number;
    type: string;
    title: string;
    order_number: number;
  }>;
  created_at: string;
  updated_at?: string;
}

// -------------------------------------------------------------------
// PARÁMETROS DE FILTRADO Y CREACIÓN
// -------------------------------------------------------------------

// Courses
export interface CoursesFilterParams {
  page?: number;
  limit?: number;
  level?: CourseLevel;
  status?: boolean;
  search?: string;
  category_id?: number;
}

export interface CreateCourseData {
  title: string;
  name?: string;
  description: string;
  level: CourseLevel;
  course_image?: string;
  video_url?: string;
  duration: number;
  sessions: number;
  selling_price: number;
  discount_price?: number;
  prerequisites?: string;
  certificate_name?: boolean;
  certificate_issuer?: string;
  bestseller?: boolean;
  featured?: boolean;
  highest_rated?: boolean;
  status: boolean;
}

export interface UpdateCourseData {
  title?: string;
  name?: string;
  description?: string;
  level?: CourseLevel;
  course_image?: string;
  video_url?: string;
  duration?: number;
  sessions?: number;
  selling_price?: number;
  discount_price?: number;
  prerequisites?: string;
  certificate_name?: boolean;
  certificate_issuer?: string;
  bestseller?: boolean;
  featured?: boolean;
  highest_rated?: boolean;
  status?: boolean;
}

// Students
export interface StudentsFilterParams {
  page?: number;
  limit?: number;
  status?: ApiStatus;
  search?: string;
  company_id?: number;
}

export interface CreateStudentData {
  password: string;
  company_id?: number;
  document_number?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: ApiStatus;
}

export interface UpdateStudentData {
  company_id?: number;
  document_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: ApiStatus;
}

// Instructors
export interface InstructorsFilterParams {
  page?: number;
  limit?: number;
  status?: ApiStatus;
  expertise_area?: string;
}

export interface CreateInstructorData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  document_number?: string;
  bio: string;
  expertise_area: string;
  status: ApiStatus;
}

export interface UpdateInstructorData {
  bio?: string;
  expertise_area?: string;
  status?: ApiStatus;
}


// -------------------------------------------------------------------
// TIPOS DE COMPATIBILIDAD
// -------------------------------------------------------------------

// Mantener compatibilidad con nombres antiguos
export type Content = ApiContent;

// Tipo Instructor extendido
export interface InstructorExtended extends Instructor {
  instructor_id?: number;
  user_id?: number;
  name?: string;
}

// -------------------------------------------------------------------
// COMPAÑÍAS
// -------------------------------------------------------------------

// Compañía del frontend
export interface Company {
  id: string;
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

// Compañía de la API
export interface ApiCompany {
  id: number;
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

// Responses de la API
export interface CompaniesListResponse {
  success: boolean;
  data: {
    companies: ApiCompany[];
    pagination: Pagination;
  };
}

export interface CompanyDetailResponse {
  success: boolean;
  data: ApiCompany;
}

export interface CompanyCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export interface CompanyUpdateResponse {
  success: boolean;
  message: string;
}

export interface CompanyDeleteResponse {
  success: boolean;
  message: string;
}

// Parámetros de filtrado
export interface CompaniesFilterParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Datos para crear compañía
export interface CreateCompanyData {
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
}

// Datos para actualizar compañía
export interface UpdateCompanyData {
  name?: string;
  industry?: string;
  contact_name?: string;
  contact_email?: string;
}

// -------------------------------------------------------------------
// CATEGORÍAS
// -------------------------------------------------------------------

// Categoría de la API
export interface ApiCategory {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  image: string;
  courses_count: number;
  created_at: string;
}

// Responses de la API
export interface CategoriesListResponse {
  success: boolean;
  data: ApiCategory[];
}

export interface CategoryDetailResponse {
  success: boolean;
  data: ApiCategory;
}

export interface CategoryCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    category_id: number | null;
    name: string;
    slug: string;
    image: string;
    created_at: string;
  };
}

export interface CategoryUpdateResponse {
  success: boolean;
  message: string;
}

export interface CategoryDeleteResponse {
  success: boolean;
  message: string;
}

// Datos para crear categoría
export interface CreateCategoryData {
  name: string;
  slug: string;
  image: string;
  category_id?: number | null;
}

// Datos para actualizar categoría
export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  image?: string;
  category_id?: number | null;
}

// -------------------------------------------------------------------
// ENROLLMENTS (INSCRIPCIONES)
// -------------------------------------------------------------------

// Enrollment básico
export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
  completed_at?: string | null;
  progress_percent?: number;
}

// Enrollment reciente para dashboard
export interface RecentEnrollment {
  id: number;
  student_name: string;
  student_email: string;
  course_title: string;
  enrolled_at: string;
}

// -------------------------------------------------------------------
// CONTENIDOS DE CURSO (COURSE CONTENTS)
// -------------------------------------------------------------------

// Contenido de curso de la API
export interface ApiCourseContent {
  id: number;
  course_id: number;
  course?: {
    id: number;
    course_id: number;
    title: string;
  };
  session: number;
  type: string;
  title: string;
  content: string;
  order_number: number;
  created_at: string;
}

// Contenido de curso del frontend (actualizado)
export interface CourseContentItem {
  id: number;
  course_id: number;
  session: number;
  type: string;
  title: string;
  content: string;
  order_number: number;
  created_at: string;
}

// Response de la API
export interface CourseContentsListResponse {
  success: boolean;
  data: {
    data: ApiCourseContent[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CourseContentCreateResponse {
  success: boolean;
  message: string;
  data: ApiCourseContent;
}

export interface CourseContentDeleteResponse {
  success: boolean;
  message: string;
}

// Datos para crear contenido
export interface CreateCourseContentData {
  course_id: number;
  session: number;
  type: string;
  title: string;
  content: string;
  order_number: number;
}

// -------------------------------------------------------------------
// PERIODOS ACADÉMICOS
// -------------------------------------------------------------------

// Status de periodo académico
export type AcademicPeriodStatus = 'open' | 'completed' | 'cancelled';

// Periodo académico del frontend
export interface AcademicPeriod {
  id: string;
  academic_period_id: number | null;
  name: string;
  start_date: string;
  end_date: string;
  status: AcademicPeriodStatus;
  created_at: string;
}

// Periodo académico de la API
export interface ApiAcademicPeriod {
  id: number;
  academic_period_id: number | null;
  name: string;
  start_date: string;
  end_date: string;
  status: AcademicPeriodStatus;
  created_at: string;
}

// Responses de la API
export interface AcademicPeriodsListResponse {
  success: boolean;
  data: ApiAcademicPeriod[];
}

export interface AcademicPeriodDetailResponse {
  success: boolean;
  data: ApiAcademicPeriod;
}

export interface AcademicPeriodCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    academic_period_id: number | null;
    name: string;
    start_date: string;
    end_date: string;
    status: AcademicPeriodStatus;
    created_at: string;
  };
}

export interface AcademicPeriodDeleteResponse {
  success: boolean;
  message: string;
}

// Datos para crear periodo académico
export interface CreateAcademicPeriodData {
  name: string;
  start_date: string;
  end_date: string;
  status: AcademicPeriodStatus;
}

// -------------------------------------------------------------------
// GRUPOS (GROUPS)
// -------------------------------------------------------------------

// Status de grupo
export type GroupStatus = 'draft' | 'approved' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'suspended';

// Grupo del frontend
export interface Group {
  id: number;
  course_id: number;
  course?: {
    id: number;
    title: string;
    name?: string;
  };
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
}

// Grupo de la API
export interface ApiGroup {
  id: number;
  course_id: number;
  course?: {
    id: number;
    title: string;
    name?: string;
  };
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
}

// Responses de la API
export interface GroupsListResponse {
  success: boolean;
  data: {
    data: ApiGroup[];
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string | null;
        previous: string | null;
      };
    };
  };
}

export interface GroupCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

// Datos para crear grupo
export interface CreateGroupData {
  course_id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  status: GroupStatus;
}

// -------------------------------------------------------------------
// CLASES (CLASSES)
// -------------------------------------------------------------------

// Status de clase
export type ClassStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Clase del frontend
export interface Class {
  id: number;
  group_id: number;
  group?: {
    id: number;
    code: string;
    name: string;
    course?: {
      id: number;
      title: string;
    };
  };
  class_name: string;
  meeting_url: string;
  description: string;
  class_date: string;
  start_time: string;
  end_time: string;
  class_status: ClassStatus;
  created_at: string;
  updated_at: string;
}

// Clase de la API
export interface ApiClass {
  id: number;
  group_id: number;
  group?: {
    id: number;
    code: string;
    name: string;
    course?: {
      id: number;
      title: string;
    };
  };
  class_name: string;
  meeting_url: string;
  description: string;
  class_date: string;
  start_time: string;
  end_time: string;
  class_status: ClassStatus;
  created_at: string;
  updated_at: string;
}

// Responses de la API
export interface ClassesListResponse {
  success: boolean;
  data: {
    data: ApiClass[];
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string | null;
        previous: string | null;
      };
    };
  };
}

export interface ClassCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export interface ClassDeleteResponse {
  success: boolean;
  message: string;
}

// Datos para crear clase
export interface CreateClassData {
  group_id: number;
  class_name: string;
  meeting_url: string;
  description: string;
  class_date: string;
  start_time: string;
  end_time: string;
  class_status: ClassStatus;
}

// -------------------------------------------------------------------
// MATERIALES DE CLASE (CLASS MATERIALS)
// -------------------------------------------------------------------

// Tipo de material
export type MaterialType = 'PDF' | 'VIDEO' | 'LINK' | 'DOCUMENT' | 'PRESENTATION' | 'OTHER';

// Material de clase del frontend
export interface ClassMaterial {
  id: number;
  class_id: number;
  class?: {
    id: number;
    class_name: string;
    class_date: string;
    group?: {
      id: number;
      name: string;
      course?: {
        id: number;
        title: string;
      };
    };
  };
  material_url: string;
  type: MaterialType;
  created_at: string;
  updated_at: string;
}

// Material de clase de la API
export interface ApiClassMaterial {
  id: number;
  class_id: number;
  class?: {
    id: number;
    class_name: string;
    class_date: string;
    group?: {
      id: number;
      name: string;
      course?: {
        id: number;
        title: string;
      };
    };
  };
  material_url: string;
  type: MaterialType;
  created_at: string;
  updated_at: string;
}

// Responses de la API
export interface ClassMaterialsListResponse {
  success: boolean;
  data: {
    data: ApiClassMaterial[];
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string | null;
        previous: string | null;
      };
    };
  };
}

export interface ClassMaterialCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export interface ClassMaterialDeleteResponse {
  success: boolean;
  message: string;
}

// Datos para crear material de clase
export interface CreateClassMaterialData {
  class_id: number;
  material_url: string;
  type: MaterialType;
}

