// Academic Periods Service - Módulo LMS
import { apiRequest } from '../../../services/api.config';
import type {
  AcademicPeriod,
  ApiAcademicPeriod,
  AcademicPeriodsListResponse,
  AcademicPeriodDetailResponse,
  AcademicPeriodCreateResponse,
  AcademicPeriodDeleteResponse,
  CreateAcademicPeriodData,
} from '../types';

// Conversión de ApiAcademicPeriod a AcademicPeriod
const mapApiAcademicPeriodToAcademicPeriod = (apiPeriod: ApiAcademicPeriod): AcademicPeriod => {
  return {
    id: String(apiPeriod.id),
    academic_period_id: apiPeriod.academic_period_id,
    name: apiPeriod.name,
    start_date: apiPeriod.start_date,
    end_date: apiPeriod.end_date,
    status: apiPeriod.status,
    created_at: apiPeriod.created_at,
  };
};

export const academicPeriodsService = {
  /**
   * Listar todos los periodos académicos
   * Endpoint: GET /lms/academic-periods
   */
  async getAll(): Promise<AcademicPeriod[]> {
    const response = await apiRequest<AcademicPeriodsListResponse>('/lms/academic-periods');
    return response.data.map(mapApiAcademicPeriodToAcademicPeriod);
  },

  /**
   * Obtener detalles de un periodo académico
   * Endpoint: GET /lms/academic-periods/{id}
   */
  async getById(id: string): Promise<AcademicPeriod> {
    const response = await apiRequest<AcademicPeriodDetailResponse>(`/lms/academic-periods/${id}`);
    return mapApiAcademicPeriodToAcademicPeriod(response.data);
  },

  /**
   * Crear un nuevo periodo académico
   * Endpoint: POST /lms/academic-periods
   */
  async create(data: CreateAcademicPeriodData): Promise<AcademicPeriod> {
    const response = await apiRequest<AcademicPeriodCreateResponse>('/lms/academic-periods', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener el periodo completo
    return this.getById(String(response.data.id));
  },

  /**
   * Eliminar un periodo académico
   * Endpoint: DELETE /lms/academic-periods/{id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<AcademicPeriodDeleteResponse>(`/lms/academic-periods/${id}`, {
      method: 'DELETE',
    });
  },
};
