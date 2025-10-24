import { apiRequest } from '../../../services/api.config';
import type {
  Class,
  ApiClass,
  ClassesListResponse,
  ClassCreateResponse,
  ClassDeleteResponse,
  CreateClassData,
} from '../types';

const BASE_URL = '/lms/classes';

export const classService = {
  /**
   * Obtener clases filtradas por group_id
   */
  async getByGroupId(groupId: number): Promise<Class[]> {
    try {
      const response = await apiRequest<ClassesListResponse>(`${BASE_URL}?group_id=${groupId}`, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiClass: ApiClass) => ({
          id: apiClass.id,
          group_id: apiClass.group_id,
          group: apiClass.group,
          class_name: apiClass.class_name,
          meeting_url: apiClass.meeting_url,
          description: apiClass.description,
          class_date: apiClass.class_date,
          start_time: apiClass.start_time,
          end_time: apiClass.end_time,
          class_status: apiClass.class_status,
          created_at: apiClass.created_at,
          updated_at: apiClass.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las clases');
    }
  },

  /**
   * Crear una nueva clase
   */
  async create(data: CreateClassData): Promise<number> {
    try {
      const response = await apiRequest<ClassCreateResponse>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success && response.data) {
        return response.data.id;
      }

      throw new Error('Error al crear la clase');
    } catch (error: any) {
      console.error('Error creating class:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la clase');
    }
  },

  /**
   * Eliminar una clase
   */
  async delete(classId: number): Promise<void> {
    try {
      const response = await apiRequest<ClassDeleteResponse>(`${BASE_URL}/${classId}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Error al eliminar la clase');
      }
    } catch (error: any) {
      console.error('Error deleting class:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la clase');
    }
  },

  /**
   * Obtener todas las clases
   */
  async getAll(): Promise<Class[]> {
    try {
      const response = await apiRequest<ClassesListResponse>(BASE_URL, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiClass: ApiClass) => ({
          id: apiClass.id,
          group_id: apiClass.group_id,
          group: apiClass.group,
          class_name: apiClass.class_name,
          meeting_url: apiClass.meeting_url,
          description: apiClass.description,
          class_date: apiClass.class_date,
          start_time: apiClass.start_time,
          end_time: apiClass.end_time,
          class_status: apiClass.class_status,
          created_at: apiClass.created_at,
          updated_at: apiClass.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las clases');
    }
  },
};
