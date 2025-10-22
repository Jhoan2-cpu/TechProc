import { apiRequest } from '../../../services/api.config';
import type {
  News,
  Alert,
  Announcement,
  ContactForm,
  ChatbotFAQ,
  ChatbotConfig,
  NewsStatus,
  AlertStatus,
  AnnouncementStatus,
  ContactFormStatus,
  AlertType,
  ContactFormPriority,
} from '../types';

// ============================================
// Types para las respuestas de la API
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

// ============================================
// News Service
// ============================================

export interface NewsFilters {
  status?: NewsStatus;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const newsService = {
  async getAll(filters?: NewsFilters): Promise<{ news: News[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/developer-web/news${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<News>>>(endpoint);
    return {
      news: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: number): Promise<News> {
    const response = await apiRequest<ApiResponse<News>>(`/developer-web/news/${id}`);
    return response.data;
  },

  async create(newsData: Partial<News>): Promise<News> {
    const response = await apiRequest<ApiResponse<News>>('/developer-web/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
    return response.data;
  },

  async update(id: number, newsData: Partial<News>): Promise<News> {
    const response = await apiRequest<ApiResponse<News>>(`/developer-web/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest<ApiResponse<void>>(`/developer-web/news/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Alerts Service
// ============================================

export interface AlertFilters {
  status?: AlertStatus;
  type?: AlertType;
  page?: number;
  limit?: number;
}

export const alertsService = {
  async getAll(filters?: AlertFilters): Promise<{ alerts: Alert[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/developer-web/alerts${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<Alert>>>(endpoint);
    return {
      alerts: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: number): Promise<Alert> {
    const response = await apiRequest<ApiResponse<Alert>>(`/developer-web/alerts/${id}`);
    return response.data;
  },

  async create(alertData: Partial<Alert>): Promise<Alert> {
    const response = await apiRequest<ApiResponse<Alert>>('/developer-web/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
    return response.data;
  },

  async update(id: number, alertData: Partial<Alert>): Promise<Alert> {
    const response = await apiRequest<ApiResponse<Alert>>(`/developer-web/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(alertData),
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest<ApiResponse<void>>(`/developer-web/alerts/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Contact Forms Service
// ============================================

export interface ContactFormFilters {
  status?: ContactFormStatus;
  form_type?: string;
  priority?: ContactFormPriority;
  search?: string;
  page?: number;
  limit?: number;
}

export const contactFormsService = {
  async getAll(filters?: ContactFormFilters): Promise<{ forms: ContactForm[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.form_type) params.append('form_type', filters.form_type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/developer-web/contact-forms${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<ContactForm>>>(endpoint);
    return {
      forms: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: number): Promise<ContactForm> {
    const response = await apiRequest<ApiResponse<ContactForm>>(`/developer-web/contact-forms/${id}`);
    return response.data;
  },

  async respond(id: number, responseData: { response: string; status?: ContactFormStatus }): Promise<ContactForm> {
    const response = await apiRequest<ApiResponse<ContactForm>>(`/developer-web/contact-forms/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
    return response.data;
  },

  async markAsSpam(id: number): Promise<ContactForm> {
    const response = await apiRequest<ApiResponse<ContactForm>>(`/developer-web/contact-forms/${id}/spam`, {
      method: 'POST',
    });
    return response.data;
  },

  async updateStatus(id: number, status: ContactFormStatus): Promise<ContactForm> {
    const response = await apiRequest<ApiResponse<ContactForm>>(`/developer-web/contact-forms/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  async assignToMe(id: number): Promise<ContactForm> {
    const response = await apiRequest<ApiResponse<ContactForm>>(`/developer-web/contact-forms/${id}/assign`, {
      method: 'PUT',
    });
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await apiRequest<ApiResponse<any>>('/developer-web/contact-forms/stats/summary');
    return response.data;
  },

  async exportToCsv(filters?: ContactFormFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.form_type) params.append('form_type', filters.form_type);
    if (filters?.priority) params.append('priority', filters.priority);

    const queryString = params.toString();
    const endpoint = `/developer-web/contact-forms/export/csv${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<Blob>(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });
    return response;
  },
};

// ============================================
// Announcements Service
// ============================================

export interface AnnouncementFilters {
  status?: AnnouncementStatus;
  display_type?: string;
  target_page?: string;
  page?: number;
  limit?: number;
  
}

export const announcementsService = {
  async getAll(filters?: AnnouncementFilters): Promise<{ announcements: Announcement[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.display_type) params.append('display_type', filters.display_type);
    if (filters?.target_page) params.append('target_page', filters.target_page);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/developer-web/announcements${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<Announcement>>>(endpoint);
    return {
      announcements: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: number): Promise<Announcement> {
    const response = await apiRequest<ApiResponse<Announcement>>(`/developer-web/announcements/${id}`);
    return response.data;
  },

  async create(announcementData: Partial<Announcement>): Promise<Announcement> {
    const response = await apiRequest<ApiResponse<Announcement>>('/developer-web/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
    return response.data;
  },

  async update(id: number, announcementData: Partial<Announcement>): Promise<Announcement> {
    const response = await apiRequest<ApiResponse<Announcement>>(`/developer-web/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest<ApiResponse<void>>(`/developer-web/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Chatbot FAQs Service
// ============================================

export interface ChatbotFAQFilters {
  category?: string;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const chatbotFAQsService = {
  async getAll(filters?: ChatbotFAQFilters): Promise<{ faqs: ChatbotFAQ[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.active !== undefined) params.append('active', filters.active.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/developer-web/chatbot/faqs${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ApiResponse<PaginatedResponse<ChatbotFAQ>>>(endpoint);
    return {
      faqs: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: number): Promise<ChatbotFAQ> {
    const response = await apiRequest<ApiResponse<ChatbotFAQ>>(`/developer-web/chatbot/faqs/${id}`);
    return response.data;
  },

  async create(faqData: Partial<ChatbotFAQ>): Promise<ChatbotFAQ> {
    const response = await apiRequest<ApiResponse<ChatbotFAQ>>('/developer-web/chatbot/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData),
    });
    return response.data;
  },

  async update(id: number, faqData: Partial<ChatbotFAQ>): Promise<ChatbotFAQ> {
    const response = await apiRequest<ApiResponse<ChatbotFAQ>>(`/developer-web/chatbot/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData),
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest<ApiResponse<void>>(`/developer-web/chatbot/faqs/${id}`, {
      method: 'DELETE',
    });
  },

  async getCategories(): Promise<string[]> {
    const response = await apiRequest<ApiResponse<string[]>>('/developer-web/chatbot/faqs/categories');
    return response.data;
  },
};

// ============================================
// Chatbot Service (Actualizado con las rutas correctas)
// ============================================

export const chatbotService = {
  async getConversations(): Promise<any> {
    try {
      const response = await apiRequest<ApiResponse<any>>('/developer-web/chatbot/conversations');
      return response.data;
    } catch (error: any) {
      console.error('Error getting conversations:', error);
      throw new Error(error.message || 'Error al obtener conversaciones');
    }
  },

  async getAnalytics(): Promise<any> {
    try {
      const response = await apiRequest<ApiResponse<any>>('/developer-web/chatbot/analytics/summary');
      return response.data;
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      // Retornar datos por defecto en caso de error
      return {
        conversations_today: 0,
        total_conversations: 0,
        average_rating: 0,
        resolved_rate: 0
      };
    }
  },

  // Nuevos métodos para configuración
  async getConfig(): Promise<ChatbotConfig> {
    try {
      const response = await apiRequest<ApiResponse<ChatbotConfig>>('/developer-web/chatbot/config');
      return response.data;
    } catch (error: any) {
      console.error('Error getting chatbot config:', error);
      // Retornar configuración por defecto si hay error
      return {
        enabled: true,
        greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
        fallback_message: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
        response_delay: 1000,
        max_conversations_per_day: 1000,
        contact_threshold: 3,
      };
    }
  },

  async updateConfig(configData: Partial<ChatbotConfig>): Promise<ChatbotConfig> {
    try {
      const response = await apiRequest<ApiResponse<ChatbotConfig>>('/developer-web/chatbot/config', {
        method: 'PUT',
        body: JSON.stringify(configData),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating chatbot config:', error);
      throw new Error(error.message || 'Error al actualizar la configuración');
    }
  },

  async resetConfig(): Promise<void> {
    try {
      await apiRequest<ApiResponse<void>>('/developer-web/chatbot/config/reset', {
        method: 'POST',
      });
    } catch (error: any) {
      console.error('Error resetting chatbot config:', error);
      throw new Error(error.message || 'Error al resetear la configuración');
    }
  },

  async getHealthStatus(): Promise<any> {
    try {
      const response = await apiRequest<ApiResponse<any>>('/developer-web/chatbot/config/health');
      return response.data;
    } catch (error: any) {
      console.error('Error getting health status:', error);
      return {
        status: 'unknown',
        error: error.message
      };
    }
  },
};

// ============================================
// Dashboard Service
// ============================================

export interface DashboardStats {
  news: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  alerts: {
    total: number;
    active: number;
    inactive: number;
    expired: number;
  };
  announcements: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    total_views: number;
    total_clicks: number;
  };
  contact_forms: {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    spam: number;
  };
  chatbot: {
    total_faqs: number;
    active_faqs: number;
    total_conversations: number;
  };
}

export const dashboardService = {
  /**
   * Obtiene todas las estadísticas del dashboard
   */
  async getStatistics(): Promise<DashboardStats> {
    const response = await apiRequest<ApiResponse<DashboardStats>>(
      '/developer-web/dashboard/statistics'
    );
    return response.data;
  },

  /**
   * Obtiene estadísticas públicas del sitio web
   */
  async getWebStats(): Promise<any> {
    const response = await apiRequest<ApiResponse<any>>(
      '/developer-web/dashboard/web-stats'
    );
    return response.data;
  },
};