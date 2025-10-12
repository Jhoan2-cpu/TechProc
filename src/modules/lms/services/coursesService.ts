// Courses Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type { Course } from '../types';

// Tipos de respuesta según la API
interface CoursesListResponse {
  success: boolean;
  data: {
    courses: ApiCourse[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      per_page: number;
    };
  };
}

interface CourseDetailResponse {
  success: boolean;
  data: ApiCourseDetail;
}

interface CourseCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    course_id: number;
  };
}

interface CourseUpdateResponse {
  success: boolean;
  message: string;
}

interface CourseDeleteResponse {
  success: boolean;
  message: string;
}

// Tipos de la API
interface ApiCourse {
  id: number;
  course_id: number;
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
  course_image?: string;
  duration: number;
  sessions: number;
  selling_price: number;
  discount_price?: number;
  status: boolean;
  bestseller?: boolean;
  featured?: boolean;
  created_at: string;
}

interface ApiCourseDetail extends ApiCourse {
  video_url?: string;
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

// Parámetros de filtrado
export interface CoursesFilterParams {
  page?: number;
  limit?: number;
  level?: 'basic' | 'intermediate' | 'advanced';
  status?: boolean;
  search?: string;
  category_id?: number;
}

// Datos para crear curso
export interface CreateCourseData {
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
  course_image?: string;
  video_url?: string;
  duration: number;
  sessions: number;
  selling_price: number;
  discount_price?: number;
  prerequisites?: string;
  certificate_name?: boolean;
  certificate_issuer?: string;
  status: boolean;
  category_ids?: number[];
  instructor_ids?: number[];
}

// Datos para actualizar curso
export interface UpdateCourseData {
  title?: string;
  description?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
  course_image?: string;
  video_url?: string;
  duration?: number;
  sessions?: number;
  selling_price?: number;
  discount_price?: number;
  prerequisites?: string;
  status?: boolean;
}

// Conversión de ApiCourse a Course
const mapApiCourseToCourse = (apiCourse: ApiCourse | ApiCourseDetail): Course => {
  // Determinar el estado según el status booleano de la API
  let status: Course['status'] = apiCourse.status ? 'publicado' : 'borrador';

  return {
    id: String(apiCourse.course_id || apiCourse.id),
    title: apiCourse.title,
    code: `COURSE-${apiCourse.course_id || apiCourse.id}`,
    description: apiCourse.description,
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
   * Crear un nuevo curso
   * Endpoint: POST /lms/courses
   */
  async create(data: CreateCourseData): Promise<Course> {
    const response = await apiRequest<CourseCreateResponse>('/lms/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el curso completo
    return this.getById(String(response.data.course_id));
  },

  /**
   * Actualizar un curso
   * Endpoint: PUT /lms/courses/{course_id}
   */
  async update(id: string, data: UpdateCourseData): Promise<Course> {
    await apiRequest<CourseUpdateResponse>(`/lms/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener el curso actualizado
    return this.getById(id);
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
