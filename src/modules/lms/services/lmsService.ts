// LMS Dashboard Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  LMSStats,
  RecentCourse,
  RecentEnrollment,
  StudentsStatsResponse,
  CoursesStatsResponse,
} from '../types';
import { coursesService } from './coursesService';
import { studentsService } from './studentsService';
import { instructorsService } from './instructorsService';
import { enrollmentsService } from './enrollmentsService';

export const lmsService = {
  /**
   * Obtener estadísticas del dashboard
   * Combina datos de múltiples endpoints
   */
  async getStats(): Promise<LMSStats> {
    try {
      // Obtener estadísticas de estudiantes
      const studentsStatsResponse = await apiRequest<StudentsStatsResponse>('/analytics/students/stats');

      // Obtener estadísticas de cursos
      const coursesStatsResponse = await apiRequest<CoursesStatsResponse>('/analytics/courses/stats');

      // Obtener instructores (solo necesitamos el conteo)
      const instructorsResponse = await instructorsService.getAll({ limit: 1 });

      // Obtener matrículas activas
      const enrollmentsResponse = await enrollmentsService.getAll({ status: 'active' });

      return {
        total_courses: coursesStatsResponse.data.total_courses,
        published_courses: coursesStatsResponse.data.active_courses,
        draft_courses: coursesStatsResponse.data.inactive_courses,
        total_students: studentsStatsResponse.data.total_students,
        active_enrollments: enrollmentsResponse.length,
        total_instructors: instructorsResponse.pagination?.total_records || 0,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas LMS:', error);
      throw error;
    }
  },

  /**
   * Obtener cursos recientes
   * Usa el endpoint de cursos con paginación
   */
  async getRecentCourses(): Promise<RecentCourse[]> {
    try {
      const response = await coursesService.getAll({ limit: 5, page: 1 });

      return response.courses.map(course => ({
        id: course.id,
        title: course.title,
        code: course.code,
        instructor_name: course.instructor?.first_name
          ? `${course.instructor.first_name} ${course.instructor.last_name}`
          : 'Sin instructor',
        status: course.status,
        created_at: course.created_at,
      }));
    } catch (error) {
      console.error('Error al obtener cursos recientes:', error);
      throw error;
    }
  },

  /**
   * Obtener inscripciones recientes
   * Usa el endpoint de enrollments
   */
  async getRecentEnrollments(): Promise<RecentEnrollment[]> {
    try {
      const enrollments = await enrollmentsService.getAll();

      // Ordenar por fecha de inscripción (más recientes primero) y tomar las primeras 5
      const recentEnrollments = enrollments
        .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
        .slice(0, 5);

      // Obtener información detallada de estudiantes y cursos
      const enrichedEnrollments = await Promise.all(
        recentEnrollments.map(async (enrollment) => {
          try {
            const student = await studentsService.getById(enrollment.student_id);
            const course = await coursesService.getById(enrollment.course_id);

            return {
              id: enrollment.id,
              student_name: `${student.first_name} ${student.last_name}`,
              student_email: student.email,
              course_title: course.title,
              enrolled_at: enrollment.enrolled_at,
            };
          } catch (error) {
            // Si falla la obtención de detalles, retornar con datos básicos
            return {
              id: enrollment.id,
              student_name: 'Estudiante no disponible',
              student_email: '',
              course_title: 'Curso no disponible',
              enrolled_at: enrollment.enrolled_at,
            };
          }
        })
      );

      return enrichedEnrollments;
    } catch (error) {
      console.error('Error al obtener inscripciones recientes:', error);
      throw error;
    }
  }

};
