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

export interface AnnouncementDetailResponse {
  success: boolean;
  data: AnnouncementFromAPI;
}

// Tipos para formulario de contacto
export interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  form_type: string;
}

export interface ContactFormResponse {
  id: number;
  id_contact: number;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  subject: string;
  message: string;
  form_type: string;
  status: string;
  assigned_to: number | null;
  response: string | null;
  response_date: string | null;
  submission_date: string;
}

export interface ContactFormAPIResponse {
  success: boolean;
  data: ContactFormResponse;
  message: string;
}

// Tipos para cursos públicos
export interface CourseOfferingInstructor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CourseInfo {
  id: number;
  name: string;
  title: string;
}

export interface AcademicPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface CourseOffering {
  id: number;
  course_offering_id: number;
  course_id: number;
  course: CourseInfo;
  academic_period_id: number;
  academic_period: AcademicPeriod;
  instructor_id: number;
  instructor: CourseOfferingInstructor;
  schedule: string;
  delivery_method: 'regular' | 'online' | 'intensive';
  featured?: boolean;
  created_at: string;
}

export interface CourseOfferingsResponse {
  success: boolean;
  data: CourseOffering[];
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
      const response = await fetch(`${this.baseUrl}/developer-web/announcements/public`, {
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

  /**
   * Obtiene un anuncio específico por su ID
   * Endpoint: GET /api/developer-web/announcements/public/:id
   * No requiere autenticación
   */
  async getAnnouncementById(id: number): Promise<AnnouncementFromAPI> {
    try {
      const response = await fetch(`${this.baseUrl}/developer-web/announcements/public/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener anuncio: ${response.status}`);
      }

      const data: AnnouncementDetailResponse = await response.json();

      if (!data.success) {
        throw new Error('La respuesta de la API no fue exitosa');
      }

      return data.data;
    } catch (error) {
      console.error('Error en getAnnouncementById:', error);
      throw error;
    }
  }

  /**
   * Envía un formulario de contacto
   * Endpoint: POST /api/developer-web/contact-forms
   * No requiere autenticación
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactFormAPIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/developer-web/contact-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error al enviar formulario: ${response.status}`);
      }

      const data: ContactFormAPIResponse = await response.json();

      if (!data.success) {
        throw new Error('La respuesta de la API no fue exitosa');
      }

      return data;
    } catch (error) {
      console.error('Error en submitContactForm:', error);
      throw error;
    }
  }

  /**
   * Obtiene los cursos ofrecidos del último período académico
   * Endpoint: GET /api/lms/course-offerings/public/latest-period
   * No requiere autenticación
   */
  async getPublicCourseOfferings(): Promise<CourseOffering[]> {
    try {
      const response = await fetch(`${this.baseUrl}/lms/course-offerings/public/latest-period`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener cursos: ${response.status}`);
      }

      const data: CourseOfferingsResponse = await response.json();

      if (!data.success) {
        throw new Error('La respuesta de la API no fue exitosa');
      }

      return data.data;
    } catch (error) {
      console.error('Error en getPublicCourseOfferings:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const websiteService = new WebsiteService();
