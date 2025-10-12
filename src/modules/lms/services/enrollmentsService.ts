// Enrollments Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  Enrollment,
  ApiEnrollment,
  EnrollmentsListResponse,
  EnrollmentCreateResponse,
  EnrollmentsFilterParams,
  CreateEnrollmentData,
} from '../types';

// Conversión de ApiEnrollment a Enrollment
const mapApiEnrollmentToEnrollment = (apiEnrollment: ApiEnrollment): Enrollment => {
  return {
    id: String(apiEnrollment.enrollment_id),
    student_id: String(apiEnrollment.student.id),
    course_id: apiEnrollment.courses.length > 0 ? String(apiEnrollment.courses[0].course_offering_id) : '',
    enrolled_at: apiEnrollment.enrollment_date,
    status: apiEnrollment.status === 'active' ? 'activo' : 'abandonado',
    progress: 0, // La API no proporciona progreso, se inicializa en 0
  };
};

export const enrollmentsService = {
  /**
   * Listar todas las matrículas
   * Endpoint: GET /lms/enrollments
   */
  async getAll(filters?: EnrollmentsFilterParams): Promise<Enrollment[]> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.student_id) params.append('student_id', String(filters.student_id));
    if (filters?.academic_period_id) params.append('academic_period_id', String(filters.academic_period_id));
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/lms/enrollments${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<EnrollmentsListResponse>(endpoint);
    return response.data.map(mapApiEnrollmentToEnrollment);
  },

  /**
   * Obtener inscripciones por estudiante
   */
  async getByStudent(studentId: string): Promise<Enrollment[]> {
    return this.getAll({ student_id: Number(studentId) });
  },

  /**
   * Obtener inscripciones por curso (no soportado directamente por la API)
   * Se filtra desde el frontend
   */
  async getByCourse(courseId: string): Promise<Enrollment[]> {
    const allEnrollments = await this.getAll();
    return allEnrollments.filter(e => e.course_id === courseId);
  },

  /**
   * Crear una matrícula
   * Endpoint: POST /lms/enrollments
   */
  async create(data: CreateEnrollmentData): Promise<Enrollment> {
    const response = await apiRequest<EnrollmentCreateResponse>('/lms/enrollments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener la matrícula completa
    const enrollments = await this.getAll({ student_id: data.student_id });
    const newEnrollment = enrollments.find(e => e.id === String(response.data.enrollment_id));

    if (!newEnrollment) {
      throw new Error('No se pudo obtener la matrícula creada');
    }

    return newEnrollment;
  },

  /**
   * Actualizar progreso de inscripción (no soportado por la API)
   * Se mantiene por compatibilidad pero no hace nada
   */
  async updateProgress(id: string, progress: number): Promise<Enrollment> {
    console.warn('La actualización de progreso no está soportada por la API');
    const enrollments = await this.getAll();
    const enrollment = enrollments.find(e => e.id === id);
    if (!enrollment) {
      throw new Error('Inscripción no encontrada');
    }
    // Simular actualización de progreso localmente
    return { ...enrollment, progress };
  },

  /**
   * Eliminar una matrícula (no documentado en la API)
   * Se mantiene por compatibilidad pero lanzará error
   */
  async delete(_id: string): Promise<void> {
    throw new Error('La eliminación de matrículas no está soportada por la API');
  },
};
