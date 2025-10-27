// Instructors Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  Instructor,
  ApiInstructor,
  InstructorsListResponse,
  InstructorCreateResponse,
  InstructorUpdateResponse,
  InstructorsFilterParams,
  CreateInstructorData,
  UpdateInstructorData,
} from '../types';

// Conversión de ApiInstructor a Instructor
const mapApiInstructorToInstructor = (apiInstructor: ApiInstructor): Instructor => {
  // Mapear status de la API al frontend
  let status: Instructor['status'] = 'activo';
  if (apiInstructor.status === 'inactive') {
    status = 'inactivo';
  }
  // Note: 'suspended' is not a valid ApiStatus value according to the API

  // Separar nombre en first_name y last_name de forma segura
  const nameParts = apiInstructor.name ? apiInstructor.name.split(' ') : [];
  const first_name = nameParts[0] || '';
  const last_name = nameParts.slice(1).join(' ') || '';

  return {
    id: String(apiInstructor.instructor_id || apiInstructor.id),
    first_name,
    last_name,
    email: apiInstructor.email,
    email_verified_at: null,
    address: '',
    birth_date: '',
    gender: 'Otro',
    country_location: '',
    profile_photo: null,
    role: 'instructor',
    state: apiInstructor.status,
    last_access_ip: null,
    last_access: null,
    created_at: apiInstructor.created_at,
    updated_at: apiInstructor.created_at,
    bio: apiInstructor.bio,
    expertise_area: apiInstructor.expertise_area,
    status,
    courses_count: apiInstructor.courses_count,
    instructor_id: apiInstructor.instructor_id,
    user_id: apiInstructor.user_id,
    name: apiInstructor.name,
  };
};

export const instructorsService = {
  /**
   * Listar todos los instructores
   * Endpoint: GET /lms/instructors
   */
  async getAll(filters?: InstructorsFilterParams): Promise<{ instructors: Instructor[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.expertise_area) params.append('expertise_area', filters.expertise_area);

    const queryString = params.toString();
    const endpoint = `/lms/instructors${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<InstructorsListResponse>(endpoint);

    return {
      instructors: response.data.instructors.map(mapApiInstructorToInstructor),
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener detalles de un instructor (simulado, ya que la API no tiene un endpoint específico)
   * Usamos la lista para obtener uno específico
   */
  async getById(id: string): Promise<Instructor> {
    const response = await this.getAll();
    const instructor = response.instructors.find(i => i.id === id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    return instructor;
  },

  /**
   * Crear un nuevo instructor
   * Endpoint: POST /lms/instructors
   */
  async create(data: CreateInstructorData): Promise<Instructor> {
    const response = await apiRequest<InstructorCreateResponse>('/lms/instructors', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el instructor completo
    return this.getById(String(response.data.instructor_id));
  },

  /**
   * Actualizar un instructor
   * Endpoint: PUT /lms/instructors/{instructor_id}
   */
  async update(id: string, data: UpdateInstructorData): Promise<Instructor> {
    await apiRequest<InstructorUpdateResponse>(`/lms/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener el instructor actualizado
    return this.getById(id);
  },

  /**
   * Eliminar un instructor (no existe en la API según documentación)
   * Se mantiene por compatibilidad pero lanzará error
   */
  async delete(_id: string): Promise<void> {
    throw new Error('La eliminación de instructores no está soportada por la API');
  },
};
