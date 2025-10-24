import { apiRequest } from '../../../services/api.config';
import type {
  ClassMaterial,
  ApiClassMaterial,
  ClassMaterialsListResponse,
  ClassMaterialCreateResponse,
  ClassMaterialDeleteResponse,
  CreateClassMaterialData,
} from '../types';

const BASE_URL = '/lms/class-materials';

export const classMaterialService = {
  /**
   * Obtener materiales filtrados por class_id
   */
  async getByClassId(classId: number): Promise<ClassMaterial[]> {
    try {
      const response = await apiRequest<ClassMaterialsListResponse>(`${BASE_URL}?class_id=${classId}`, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiMaterial: ApiClassMaterial) => ({
          id: apiMaterial.id,
          class_id: apiMaterial.class_id,
          class: apiMaterial.class,
          material_url: apiMaterial.material_url,
          type: apiMaterial.type,
          created_at: apiMaterial.created_at,
          updated_at: apiMaterial.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching class materials:', error);
      throw new Error(error.message || 'Error al obtener los materiales de la clase');
    }
  },

  /**
   * Crear un nuevo material de clase
   */
  async create(data: CreateClassMaterialData): Promise<number> {
    try {
      const response = await apiRequest<ClassMaterialCreateResponse>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success && response.data) {
        return response.data.id;
      }

      throw new Error('Error al crear el material');
    } catch (error: any) {
      console.error('Error creating class material:', error);
      throw new Error(error.message || 'Error al crear el material');
    }
  },

  /**
   * Eliminar un material de clase
   */
  async delete(materialId: number): Promise<void> {
    try {
      const response = await apiRequest<ClassMaterialDeleteResponse>(`${BASE_URL}/${materialId}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Error al eliminar el material');
      }
    } catch (error: any) {
      console.error('Error deleting class material:', error);
      throw new Error(error.message || 'Error al eliminar el material');
    }
  },

  /**
   * Obtener todos los materiales
   */
  async getAll(): Promise<ClassMaterial[]> {
    try {
      const response = await apiRequest<ClassMaterialsListResponse>(BASE_URL, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data.data.map((apiMaterial: ApiClassMaterial) => ({
          id: apiMaterial.id,
          class_id: apiMaterial.class_id,
          class: apiMaterial.class,
          material_url: apiMaterial.material_url,
          type: apiMaterial.type,
          created_at: apiMaterial.created_at,
          updated_at: apiMaterial.updated_at,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching class materials:', error);
      throw new Error(error.message || 'Error al obtener los materiales');
    }
  },
};
