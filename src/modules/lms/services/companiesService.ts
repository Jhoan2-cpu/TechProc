// Companies Service - Módulo LMS
import { apiRequest } from '../../../services/api.config';
import type {
  Company,
  ApiCompany,
  CompaniesListResponse,
  CompanyDetailResponse,
  CompanyCreateResponse,
  CompanyUpdateResponse,
  CompanyDeleteResponse,
  CompaniesFilterParams,
  CreateCompanyData,
  UpdateCompanyData,
} from '../types';

// Conversión de ApiCompany a Company
const mapApiCompanyToCompany = (apiCompany: ApiCompany): Company => {
  return {
    id: String(apiCompany.id),
    name: apiCompany.name,
    industry: apiCompany.industry,
    contact_name: apiCompany.contact_name,
    contact_email: apiCompany.contact_email,
    created_at: apiCompany.created_at,
    updated_at: apiCompany.updated_at,
  };
};

export const companiesService = {
  /**
   * Listar todas las compañías
   * Endpoint: GET /lms/companies
   */
  async getAll(filters?: CompaniesFilterParams): Promise<{ companies: Company[]; pagination: any }> {
    // Construir query parameters
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/lms/companies${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<CompaniesListResponse>(endpoint);

    return {
      companies: response.data.companies.map(mapApiCompanyToCompany),
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener detalles de una compañía
   * Endpoint: GET /lms/companies/{id}
   */
  async getById(id: string): Promise<Company> {
    const response = await apiRequest<CompanyDetailResponse>(`/lms/companies/${id}`);
    return mapApiCompanyToCompany(response.data);
  },

  /**
   * Crear una nueva compañía
   * Endpoint: POST /lms/companies
   */
  async create(data: CreateCompanyData): Promise<Company> {
    const response = await apiRequest<CompanyCreateResponse>('/lms/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Obtener la compañía completa
    return this.getById(String(response.data.id));
  },

  /**
   * Actualizar una compañía
   * Endpoint: PUT /lms/companies/{id}
   */
  async update(id: string, data: UpdateCompanyData): Promise<Company> {
    await apiRequest<CompanyUpdateResponse>(`/lms/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // Obtener la compañía actualizada
    return this.getById(id);
  },

  /**
   * Eliminar una compañía
   * Endpoint: DELETE /lms/companies/{id}
   */
  async delete(id: string): Promise<void> {
    await apiRequest<CompanyDeleteResponse>(`/lms/companies/${id}`, {
      method: 'DELETE',
    });
  },
};
