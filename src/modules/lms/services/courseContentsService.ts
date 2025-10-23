// Course Contents Service - Módulo LMS
import { apiRequest } from '../../../services/api.config';
import type {
  CourseContentItem,
  CourseContentsListResponse,
  CourseContentCreateResponse,
  CourseContentDeleteResponse,
  CreateCourseContentData,
} from '../types';

export const courseContentsService = {
  /**
   * Listar todos los contenidos de cursos
   * Endpoint: GET /lms/course-contents
   */
  async getAll(): Promise<CourseContentItem[]> {
    const response = await apiRequest<CourseContentsListResponse>('/lms/course-contents');
    return response.data.data.map(content => ({
      id: content.id,
      course_id: content.course_id,
      session: content.session,
      type: content.type,
      title: content.title,
      content: content.content,
      order_number: content.order_number,
      created_at: content.created_at,
    }));
  },

  /**
   * Obtener contenidos de un curso específico
   * @param courseId - ID del curso
   */
  async getByCourseId(courseId: number): Promise<CourseContentItem[]> {
    const allContents = await this.getAll();
    return allContents.filter(content => content.course_id === courseId);
  },

  /**
   * Crear un nuevo contenido para un curso
   * Endpoint: POST /lms/course-contents
   */
  async create(data: CreateCourseContentData): Promise<CourseContentItem> {
    const response = await apiRequest<CourseContentCreateResponse>('/lms/course-contents', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      id: response.data.id,
      course_id: response.data.course_id,
      session: response.data.session,
      type: response.data.type,
      title: response.data.title,
      content: response.data.content,
      order_number: response.data.order_number,
      created_at: response.data.created_at,
    };
  },

  /**
   * Eliminar un contenido de curso
   * Endpoint: DELETE /lms/course-contents/{id}
   */
  async delete(id: number): Promise<void> {
    await apiRequest<CourseContentDeleteResponse>(`/lms/course-contents/${id}`, {
      method: 'DELETE',
    });
  },
};
