import { apiRequest } from '../../../services/api.config';
import type {
  Group,
  ApiGroup,
  GroupsListResponse,
  GroupCreateResponse,
  CreateGroupData,
} from '../types';

const BASE_URL = '/lms/groups';

export const groupService = {
  /**
   * Obtener grupos filtrados por course_id
   */
  async getByCourseId(courseId: number): Promise<Group[]> {
    try {
      const response = await apiRequest<GroupsListResponse>(`${BASE_URL}?course_id=${courseId}`, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiGroup: ApiGroup) => ({
          id: apiGroup.id,
          course_id: apiGroup.course_id,
          course: apiGroup.course,
          code: apiGroup.code,
          name: apiGroup.name,
          start_date: apiGroup.start_date,
          end_date: apiGroup.end_date,
          status: apiGroup.status,
          created_at: apiGroup.created_at,
          updated_at: apiGroup.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los grupos');
    }
  },

  /**
   * Crear un nuevo grupo
   */
  async create(data: CreateGroupData): Promise<number> {
    try {
      const response = await apiRequest<GroupCreateResponse>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success && response.data) {
        return response.data.id;
      }

      throw new Error('Error al crear el grupo');
    } catch (error: any) {
      console.error('Error creating group:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el grupo');
    }
  },

  /**
   * Obtener todos los grupos
   */
  async getAll(): Promise<Group[]> {
    try {
      const response = await apiRequest<GroupsListResponse>(BASE_URL, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiGroup: ApiGroup) => ({
          id: apiGroup.id,
          course_id: apiGroup.course_id,
          course: apiGroup.course,
          code: apiGroup.code,
          name: apiGroup.name,
          start_date: apiGroup.start_date,
          end_date: apiGroup.end_date,
          status: apiGroup.status,
          created_at: apiGroup.created_at,
          updated_at: apiGroup.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los grupos');
    }
  },
};
