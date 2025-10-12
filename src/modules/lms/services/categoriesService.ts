// Categories Service - Módulo LMS según DOCUMENTACION_BACKEND_API.md
import { apiRequest } from '../../../services/api.config';

// Tipos de respuesta según la API
interface CategoriesListResponse {
  success: boolean;
  data: ApiCategory[];
}

// Tipos de la API
interface ApiCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image?: string;
  courses_count: number;
  created_at: string;
}

// Tipo para el frontend
export interface Category {
  id: string;
  category_id: number;
  name: string;
  slug: string;
  image?: string;
  courses_count: number;
  created_at: string;
}

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
   * Obtener categoría por ID
   */
  async getById(id: string): Promise<Category> {
    const categories = await this.getAll();
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return category;
  },
};
