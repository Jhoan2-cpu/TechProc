import { API_CONFIG } from './api.config';

// ==========================================
// TIPOS DE RESPUESTA DE LA API
// ==========================================

interface Creator {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  dni: string;
  document: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  address: string;
  birth_date: string;
  role: string[];
  gender: string;
  country: string;
  country_location: string;
  timezone: string;
  profile_photo: string;
  status: string;
  synchronized: boolean;
  last_access_ip: string;
  last_access: string;
  last_connection: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementFromAPI {
  id: number;
  id_announcement: number;
  title: string;
  content: string;
  image_url: string;
  display_type: 'banner' | 'popup' | 'notification' | 'modal';
  target_page: string;
  link_url: string;
  button_text: string;
  status: 'published' | 'draft' | 'archived';
  start_date: string;
  end_date: string;
  views: number;
  created_by: number;
  created_date: string;
  creator: Creator;
}

export interface AnnouncementsResponse {
  success: boolean;
  data: AnnouncementFromAPI[];
}

// ==========================================
// SERVICIO PÚBLICO DE WEBSITE
// ==========================================

class WebsiteService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Obtiene los anuncios públicos del sitio web
   * Endpoint: GET /api/developer-web/announcements/public
   * No requiere autenticación
   */
  async getPublicAnnouncements(): Promise<AnnouncementFromAPI[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/developer-web/announcements/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener anuncios: ${response.status}`);
      }

      const data: AnnouncementsResponse = await response.json();

      if (!data.success) {
        throw new Error('La respuesta de la API no fue exitosa');
      }

      return data.data;
    } catch (error) {
      console.error('Error en getPublicAnnouncements:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const websiteService = new WebsiteService();
