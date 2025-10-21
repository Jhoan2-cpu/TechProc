// Course Offerings Service - Módulo LMS
import { apiRequest } from '../../../services/api.config';
import type {
  CourseOffering,
  ApiCourseOffering,
  CourseOfferingsListResponse,
  CourseOfferingCreateResponse,
  CourseOfferingDeleteResponse,
  CreateCourseOfferingData,
} from '../types';

// Conversión de ApiCourseOffering a CourseOffering
const mapApiCourseOfferingToCourseOffering = (apiOffering: ApiCourseOffering): CourseOffering => {
  return {
    id: String(apiOffering.id),
    course_offering_id: apiOffering.course_offering_id,
    course_id: apiOffering.course_id,
    academic_period_id: apiOffering.academic_period_id,
    instructor_id: apiOffering.instructor_id,
    schedule: apiOffering.schedule,
    delivery_method: apiOffering.delivery_method,
    created_at: apiOffering.created_at,
    course: apiOffering.course,
    academic_period: apiOffering.academic_period,
    instructor: apiOffering.instructor,
  };
};

export const courseOfferingsService = {
  /**
   * Listar todas las ofertas de cursos
   * Endpoint: GET /lms/course-offerings
   */
  async getAll(): Promise<CourseOffering[]> {
    const response = await apiRequest<CourseOfferingsListResponse>('/lms/course-offerings');
    return response.data.map(mapApiCourseOfferingToCourseOffering);
  },

  /**
   * Crear una nueva oferta de curso
   * Endpoint: POST /lms/course-offerings
   */
  async create(data: CreateCourseOfferingData): Promise<CourseOffering> {
    const response = await apiRequest<CourseOfferingCreateResponse>('/lms/course-offerings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapApiCourseOfferingToCourseOffering(response.data);
  },

  /**
   * Eliminar una oferta de curso
   * Endpoint: DELETE /lms/course-offerings/{id}
   */
  async delete(id: string | number): Promise<void> {
    await apiRequest<CourseOfferingDeleteResponse>(`/lms/course-offerings/${id}`, {
      method: 'DELETE',
    });
  },
};
