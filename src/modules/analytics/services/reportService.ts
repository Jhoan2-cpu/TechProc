import { apiRequest } from '../../../services/api.config';
import type { Report } from '../types';

// ============================================
// Types para las respuestas de la API
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// interface PaginatedResponse<T> {
//   data: T[];
//   pagination: {
//     current_page: number;
//     total_pages: number;
//     total_records: number;
//     per_page: number;
//   };
// }

// ============================================
// Report Service
// ============================================

export interface ReportType {
  key: string;
  name: string;
  description: string;
  icon: string;
  available_filters: string[];
}

export interface FilterOptions {
  companies?: any[];
  academic_periods?: any[];
  statuses?: string[];
  date_ranges?: any[];
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  company_id?: number;
  academic_period_id?: number;
  status?: string;
  [key: string]: any;
}

export interface GenerateReportRequest {
  report_type: string;
  format: 'excel' | 'pdf';
  report_title?: string;
  start_date?: string;
  end_date?: string;
  filters?: ReportFilters;
  include_charts?: boolean;
  include_raw_data?: boolean;
}

export interface ExportedReport {
  id: number;
  report_type: string;
  report_type_name: string;
  format: string;
  file_name: string;
  report_title: string;
  description: string;
  file_size: string;
  record_count: number;
  filters: ReportFilters;
  generated_by: {
    id: number;
    name: string;
  };
  download_url: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  icon: string;
}

export interface ReportStats {
  total_reports: number;
  total_file_size: string;
  reports_by_type: { [key: string]: number };
  reports_by_format: { [key: string]: number };
  recent_activity: any[];
}

export interface PreviewData {
  preview_data: any[];
  total_records: number;
  columns: string[];
  metadata: any;
}

export interface ReportFilters {
  report_type?: string;
  format?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const reportService = {
  // Mapea ExportedReport (backend) -> Report (frontend)
  _mapToReport(exported: ExportedReport): Report {
    return {
      id: exported.id,
      report_type: exported.report_type as Report['report_type'],
      report_type_name: exported.report_type_name,
      format: exported.format as Report['format'],
      file_name: exported.file_name,
      report_title: exported.report_title,
      description: exported.description,
      file_size: exported.file_size,
      record_count: exported.record_count,
      filters: exported.filters,
      generated_by: exported.generated_by.id,
      generated_by_name: exported.generated_by.name,
      download_url: exported.download_url,
      created_at: exported.created_at,
      expires_at: exported.expires_at,
      is_expired: exported.is_expired,
      icon: exported.icon,
    };
  },
  // Obtener tipos de reporte disponibles
  async getReportTypes(): Promise<ReportType[]> {
    const response = await apiRequest<ApiResponse<ReportType[]>>('/data-analyst/export/report-types');
    return response.data;
  },

  // Obtener opciones de filtro por tipo de reporte
  async getFilterOptions(reportType: string): Promise<FilterOptions> {
    const response = await apiRequest<ApiResponse<FilterOptions>>(`/data-analyst/export/filter-options/${reportType}`);
    return response.data;
  },

  // Vista previa del reporte
  async previewReport(data: GenerateReportRequest): Promise<PreviewData> {
    const response = await apiRequest<ApiResponse<PreviewData>>('/data-analyst/export/preview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // Generar reporte
  async generateReport(data: GenerateReportRequest): Promise<{
    report: Report;
    download_url: string;
  }> {
    const response = await apiRequest<ApiResponse<{
      report: ExportedReport;
      download_url: string;
    }>>('/data-analyst/export/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      report: reportService._mapToReport(response.data.report),
      download_url: response.data.download_url,
    };
  },

  // Listar reportes del usuario
  async listReports(filters?: ReportFilters): Promise<{ reports: ExportedReport[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.report_type) params.append('report_type', filters.report_type);
    if (filters?.format) params.append('format', filters.format);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const endpoint = `/data-analyst/export/reports${queryString ? `?${queryString}` : ''}`;

    console.log('🔍 [DEBUG] Llamando a endpoint:', endpoint);
    
    try {
      const response = await apiRequest<any>(endpoint);
      console.log('🔍 [DEBUG] Respuesta completa:', response);
      console.log('🔍 [DEBUG] response.data:', response.data);
      console.log('🔍 [DEBUG] response.data.data:', response.data?.data);
      console.log('🔍 [DEBUG] response.data.pagination:', response.data?.pagination);

      // Diferentes estructuras posibles que podría tener la respuesta
      let reports: ExportedReport[] = [];
      let pagination: any = {};

      if (response.data?.data?.reports) {
        // Estructura: { data: { reports: [], pagination: {} } }
        reports = response.data.data.reports;
        pagination = response.data.data.pagination || {};
      } else if (response.data?.reports) {
        // Estructura: { data: { reports: [], pagination: {} } } (alternativa)
        reports = response.data.reports;
        pagination = response.data.pagination || {};
      } else if (Array.isArray(response.data?.data)) {
        // Estructura: { data: [] } (array directo)
        reports = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Estructura: [] (array directo en data)
        reports = response.data;
      } else {
        console.warn('⚠️ [DEBUG] Estructura de respuesta no reconocida:', response.data);
      }

      console.log('🔍 [DEBUG] Reports finales:', reports);
      
      return {
        reports,
        pagination
      };
    } catch (error) {
      console.error('❌ [DEBUG] Error en listReports:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getStats(): Promise<ReportStats> {
    const response = await apiRequest<ApiResponse<ReportStats>>('/data-analyst/export/reports/stats');
    return response.data;
  },

  // Eliminar reporte
  async deleteReport(token: string): Promise<void> {
    await apiRequest<ApiResponse<void>>(`/data-analyst/export/reports/${token}`, {
      method: 'DELETE',
    });
  },

  // Descargar reporte
  async downloadReport(token: string): Promise<Blob> {
    console.log('📥 [DEBUG] Iniciando descarga con token:', token);
    
    try {
      // Usar fetch directamente para mejor control
      const response = await fetch(`/api/data-analyst/export/download/${token}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
        credentials: 'include', // Incluir cookies de autenticación
      });

      console.log('📥 [DEBUG] Response status:', response.status);
      console.log('📥 [DEBUG] Response ok:', response.ok);
      console.log('📥 [DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Si la respuesta no es exitosa, intentar leer como JSON para el mensaje de error
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        } else {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${response.statusText}. ${errorText}`);
        }
      }

      // Verificar que la respuesta sea un blob válido
      const blob = await response.blob();
      console.log('📥 [DEBUG] Blob creado:', {
        size: blob.size,
        type: blob.type,
        blobClass: blob.constructor.name
      });

      if (blob.size === 0) {
        throw new Error('El archivo recibido está vacío (0 bytes)');
      }

      // Verificar que el tipo MIME sea válido
      const validMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/octet-stream'
      ];

      if (!validMimeTypes.includes(blob.type) && blob.type !== '') {
        console.warn('⚠️ [DEBUG] MIME type inesperado:', blob.type);
        // No lanzar error aquí, algunos navegadores pueden no detectar bien el MIME type
      }

      return blob;

    } catch (error) {
      console.error('❌ [DEBUG] Error en downloadReport:', error);
      throw error;
    }
  },
};