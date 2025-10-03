// Tipos del módulo LMS

export type CourseStatus = 'publicado' | 'borrador' | 'archivado';
export type UserRole = 'student' | 'instructor' | 'employees';
export type Gender = 'M' | 'F' | 'Otro';
export type InstructorStatus = 'activo' | 'inactivo' | 'suspendido';
export type ContentType = 'pdf' | 'video' | 'link' | 'anuncio';

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
}

// Instructor
export interface Instructor extends BaseUser {
  role: 'instructor';
  bio: string;
  expertise_area: string;
  status: InstructorStatus;
}

// Curso
export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
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

// Inscripción
export interface Enrollment {
  id: string;
  student_id: string;
  student?: Student;
  course_id: string;
  course?: Course;
  enrolled_at: string;
  status: 'activo' | 'completado' | 'abandonado';
  progress: number; // 0-100
}

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

// Inscripciones recientes (para dashboard)
export interface RecentEnrollment {
  id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  enrolled_at: string;
}
