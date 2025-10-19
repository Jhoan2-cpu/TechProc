// Students Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  Student,
  ApiStudent,
  ApiStudentDetail,
  StudentsListResponse,
  StudentDetailResponse,
  StudentCreateResponse,
  StudentUpdateResponse,
  StudentDeleteResponse,
  StudentsFilterParams,
  CreateStudentData,
  UpdateStudentData,
} from '../types';

// Conversión de ApiStudent a Student
const mapApiStudentToStudent = (apiStudent: ApiStudent | ApiStudentDetail): Student => {
  return {
    id: String(apiStudent.student_id || apiStudent.id),
    first_name: apiStudent.first_name,
    last_name: apiStudent.last_name,
    email: apiStudent.email,
    phone: apiStudent.phone,
    document_number: 'document_number' in apiStudent ? apiStudent.document_number : undefined,
    company: apiStudent.company,
    enrollments: 'enrollments' in apiStudent ? apiStudent.enrollments : undefined,
    email_verified_at: null,
    address: '',
    birth_date: '',
    gender: 'Otro',
    country_location: '',
    profile_photo: null,
    role: 'student',
    state: apiStudent.status === 'active' ? 'activo' : 'inactivo',
    last_access_ip: null,
    last_access: null,
    created_at: apiStudent.created_at,
    updated_at: apiStudent.created_at,
  };
};

export const studentsService = {
  /**
   * Listar todos los estudiantes
   * Endpoint: GET /lms/students
   */
  async getAll(filters?: StudentsFilterParams): Promise<{ students: Student[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.company_id) params.append('company_id', String(filters.company_id));

    const queryString = params.toString();
    const endpoint = `/lms/students${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<StudentsListResponse>(endpoint);

    return {
      students: response.data.students.map(mapApiStudentToStudent),
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener detalles de un estudiante
   * Endpoint: GET /lms/students/{student_id}
   */
  async getById(id: string): Promise<Student> {
    const response = await apiRequest<StudentDetailResponse>(`/lms/students/${id}`);
    return mapApiStudentToStudent(response.data);
  },

  /**
   * Crear un nuevo estudiante
   * Endpoint: POST /lms/students
   */
  async create(data: CreateStudentData): Promise<Student> {
    const response = await apiRequest<StudentCreateResponse>('/lms/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el estudiante completo con el id retornado
    if (response.data.student_id) {
      return this.getById(String(response.data.student_id));
    }

    // Si no se puede obtener el estudiante, retornar datos básicos
    return {
      id: String(response.data.student_id || response.data.id),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      company: undefined,
      email_verified_at: null,
      address: '',
      birth_date: '',
      gender: 'Otro',
      country_location: '',
      profile_photo: null,
      role: 'student',
      state: data.status === 'active' ? 'activo' : 'inactivo',
      last_access_ip: null,
      last_access: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Actualizar un estudiante
   * Endpoint: PUT /lms/students/{student_id}
   */
  async update(id: string, data: UpdateStudentData): Promise<Student> {
    await apiRequest<StudentUpdateResponse>(`/lms/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener el estudiante actualizado
    return this.getById(id);
  },

  /**
   * Eliminar un estudiante
   * Endpoint: DELETE /lms/students/{student_id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<StudentDeleteResponse>(`/lms/students/${id}`, {
      method: 'DELETE',
    });
  },
};
