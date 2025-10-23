// LMS Dashboard Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import type {
  LMSStats,
  RecentCourse,
  RecentEnrollment,
} from '../types';
import { coursesService } from './coursesService';
import { studentsService } from './studentsService';
import { instructorsService } from './instructorsService';
// import { enrollmentsService } from './enrollmentsService'; // Servicio no disponible

export const lmsService = {
  /**
   * Obtener estadísticas del dashboard
   * Combina datos de múltiples endpoints
   */
  async getStats(): Promise<LMSStats> {
    try {
      // Obtener datos directamente de los servicios disponibles
      const [coursesResponse, studentsResponse, instructorsResponse] = await Promise.all([
        coursesService.getAll({ limit: 1 }),
        studentsService.getAll({ limit: 1 }),
        instructorsService.getAll({ limit: 1 }),
      ]);

      // Contar cursos publicados/borradores
      const allCourses = await coursesService.getAll();
      const publishedCourses = allCourses.courses.filter(c => c.status === 'publicado').length;
      const draftCourses = allCourses.courses.filter(c => c.status === 'borrador').length;

      return {
        total_courses: coursesResponse.pagination?.total_records || 0,
        published_courses: publishedCourses,
        draft_courses: draftCourses,
        total_students: studentsResponse.pagination?.total_records || 0,
        active_enrollments: 0, // Servicio no disponible
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
      // Servicio de enrollments no disponible - retornar array vacío
      return [];

      /* CÓDIGO COMENTADO - Servicio enrollmentsService no disponible
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
      */
    } catch (error) {
      console.error('Error al obtener inscripciones recientes:', error);
      throw error;
    }
  }

};
