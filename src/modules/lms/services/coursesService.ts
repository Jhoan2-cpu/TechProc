// Courses Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  Course,
  CourseDetail,
  ApiCourse,
  ApiCourseDetail,
  CoursesListResponse,
  CourseDetailResponse,
  CourseCreateResponse,
  CourseUpdateResponse,
  CourseDeleteResponse,
  CoursesFilterParams,
  CreateCourseData,
  UpdateCourseData,
} from '../types';

// Conversión de ApiCourse a Course
const mapApiCourseToCourse = (apiCourse: ApiCourse | ApiCourseDetail): Course => {
  // Determinar el estado según el status booleano de la API
  let status: Course['status'] = apiCourse.status ? 'publicado' : 'borrador';

  return {
    id: String(apiCourse.course_id || apiCourse.id),
    course_id: apiCourse.course_id || apiCourse.id,
    title: apiCourse.title,
    code: `COURSE-${apiCourse.course_id || apiCourse.id}`,
    description: apiCourse.description,
    level: apiCourse.level,
    course_image: apiCourse.course_image,
    duration: apiCourse.duration,
    sessions: apiCourse.sessions,
    selling_price: apiCourse.selling_price,
    discount_price: apiCourse.discount_price,
    bestseller: apiCourse.bestseller,
    featured: apiCourse.featured,
    instructor_id: '', // Se debe obtener de los instructores
    duration_weeks: Math.ceil(apiCourse.duration / 7), // Convertir días a semanas
    price: apiCourse.discount_price || apiCourse.selling_price,
    status,
    created_at: apiCourse.created_at,
    updated_at: (apiCourse as ApiCourseDetail).updated_at || apiCourse.created_at,
  };
};

export const coursesService = {
  /**
   * Listar todos los cursos
   * Endpoint: GET /lms/courses
   */
  async getAll(filters?: CoursesFilterParams): Promise<{ courses: Course[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.level) params.append('level', filters.level);
    if (filters?.status !== undefined) params.append('status', String(filters.status));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category_id) params.append('category_id', String(filters.category_id));

    const queryString = params.toString();
    const endpoint = `/lms/courses${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<CoursesListResponse>(endpoint);

    return {
      courses: response.data.courses.map(mapApiCourseToCourse),
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener detalles de un curso
   * Endpoint: GET /lms/courses/{course_id}
   */
  async getById(id: string): Promise<Course> {
    const response = await apiRequest<CourseDetailResponse>(`/lms/courses/${id}`);
    return mapApiCourseToCourse(response.data);
  },

  /**
   * Obtener detalles completos de un curso
   * Endpoint: GET /lms/courses/{course_id}
   */
  async getDetailById(id: string | number): Promise<CourseDetail> {
    const response = await apiRequest<CourseDetailResponse>(`/lms/courses/${id}`);
    const data = response.data;

    return {
      id: String(data.course_id || data.id),
      course_id: data.course_id || data.id,
      title: data.title,
      description: data.description,
      level: data.level,
      course_image: data.course_image || undefined,
      video_url: data.video_url || undefined,
      duration: data.duration,
      sessions: data.sessions,
      selling_price: data.selling_price,
      discount_price: data.discount_price,
      prerequisites: data.prerequisites,
      certificate_name: data.certificate_name,
      certificate_issuer: data.certificate_issuer,
      bestseller: data.bestseller || false,
      featured: data.featured || false,
      highest_rated: data.highest_rated || false,
      status: data.status,
      categories: data.categories || [],
      instructors: data.instructors || [],
      contents: data.contents || [],
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at,
    };
  },

  /**
   * Crear un nuevo curso
   * Endpoint: POST /lms/courses
   */
  async create(data: CreateCourseData): Promise<Course> {
    const response = await apiRequest<CourseCreateResponse>('/lms/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el curso completo después de crearlo
    return this.getById(String(response.data.course_id));
  },

  /**
   * Actualizar un curso
   * Endpoint: PUT /lms/courses/{course_id}
   */
  async update(id: string | number, data: UpdateCourseData): Promise<Course> {
    await apiRequest<CourseUpdateResponse>(`/lms/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener el curso actualizado
    return this.getById(String(id));
  },

  /**
   * Eliminar un curso
   * Endpoint: DELETE /lms/courses/{course_id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<CourseDeleteResponse>(`/lms/courses/${id}`, {
      method: 'DELETE',
    });
  },
};
