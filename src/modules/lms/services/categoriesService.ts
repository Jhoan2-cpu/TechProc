// Categories Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';
import type {
  Category,
  ApiCategory,
  CategoriesListResponse,
  CategoryDetailResponse,
  CategoryCreateResponse,
  CategoryUpdateResponse,
  CategoryDeleteResponse,
  CreateCategoryData,
  UpdateCategoryData,
} from '../types';

// Conversión de ApiCategory a Category
const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => {
  return {
    id: String(apiCategory.category_id || apiCategory.id),
    category_id: apiCategory.category_id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    image: apiCategory.image,
    courses_count: apiCategory.courses_count,
    created_at: apiCategory.created_at,
  };
};

export const categoriesService = {
  /**
   * Listar todas las categorías
   * Endpoint: GET /lms/categories
   */
  async getAll(): Promise<Category[]> {
    const response = await apiRequest<CategoriesListResponse>('/lms/categories');
    return response.data.map(mapApiCategoryToCategory);
  },

  /**
   * Obtener detalles de una categoría
   * Endpoint: GET /lms/categories/{id}
   */
  async getById(id: string): Promise<Category> {
    const response = await apiRequest<CategoryDetailResponse>(`/lms/categories/${id}`);
    return mapApiCategoryToCategory(response.data);
  },

  /**
   * Crear una nueva categoría
   * Endpoint: POST /lms/categories
   */
  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiRequest<CategoryCreateResponse>('/lms/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener la categoría completa
    return this.getById(String(response.data.id));
  },

  /**
   * Actualizar una categoría
   * Endpoint: PUT /lms/categories/{id}
   */
  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    await apiRequest<CategoryUpdateResponse>(`/lms/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener la categoría actualizada
    return this.getById(id);
  },

  /**
   * Eliminar una categoría
   * Endpoint: DELETE /lms/categories/{id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<CategoryDeleteResponse>(`/lms/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
