import { apiRequest } from './api.config';
import type { ContactForm } from '../modules/web/types';

// Interfaces para las respuestas de la API
interface ContactFormApiResponse {
  id: number;
  id_contact: number;
  full_name: string;
  email: string;
  phone: string | null;
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

interface ContactFormStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    in_progress: number;
    responded: number;
    spam: number;
  };
}

export interface ContactFormStats {
  total: number;
  pending: number;
  in_progress: number;
  responded: number;
  spam: number;
}

interface PaginatedContactFormsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: ContactFormApiResponse[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Función para transformar la respuesta de la API al formato de ContactForm
const transformContactForm = (apiForm: ContactFormApiResponse): ContactForm => {
  return {
    id: apiForm.id_contact,
    id_contact: apiForm.id_contact,
    full_name: apiForm.full_name,
    email: apiForm.email,
    phone: apiForm.phone,
    company: apiForm.company,
    subject: apiForm.subject,
    message: apiForm.message,
    form_type: apiForm.form_type as 'contact' | 'quote' | 'support' | 'partnership',
    status: apiForm.status as 'pending' | 'in_progress' | 'resolved' | 'spam',
    priority: 'medium', // La API no devuelve priority, usar un valor por defecto
    assigned_to: apiForm.assigned_to,
    response: apiForm.response,
    response_date: apiForm.response_date,
    submission_date: apiForm.submission_date,
    ip_address: '', // La API no devuelve ip_address
    user_agent: '', // La API no devuelve user_agent
  };
};

// Servicio para obtener formularios de contacto
export const getContactForms = async (
  status: 'all' | 'pending' | 'in_progress' | 'resolved' | 'spam' = 'all',
  page: number = 1,
  perPage: number = 15
): Promise<{
  forms: ContactForm[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
}> => {
  try {
    const response = await apiRequest<PaginatedContactFormsResponse>(
      `/developer-web/contact-forms?status=${status}&page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
      }
    );

    const forms = response.data.data.map(transformContactForm);

    return {
      forms,
      pagination: {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      },
    };
  } catch (error) {
    console.error('Error al obtener formularios de contacto:', error);
    throw error;
  }
};

// Servicio para obtener un formulario de contacto por ID
export const getContactFormById = async (id: number): Promise<ContactForm> => {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: ContactFormApiResponse;
    }>(`/developer-web/contact-forms/${id}`, {
      method: 'GET',
    });

    return transformContactForm(response.data);
  } catch (error) {
    console.error('Error al obtener formulario de contacto:', error);
    throw error;
  }
};

// Servicio para responder a un formulario de contacto
export const respondContactForm = async (
  id: number,
  response: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'spam'
): Promise<ContactForm> => {
  try {
    const apiResponse = await apiRequest<{
      success: boolean;
      data: ContactFormApiResponse;
    }>(`/developer-web/contact-forms/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({
        response,
        status,
      }),
    });

    return transformContactForm(apiResponse.data);
  } catch (error) {
    console.error('Error al responder formulario de contacto:', error);
    throw error;
  }
};

// Servicio para marcar un formulario como spam
export const markContactFormAsSpam = async (id: number): Promise<void> => {
  try {
    await apiRequest<{
      success: boolean;
      message: string;
    }>(`/developer-web/contact-forms/${id}/spam`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error al marcar formulario como spam:', error);
    throw error;
  }
};

// Servicio para eliminar un formulario de contacto
export const deleteContactForm = async (id: number): Promise<void> => {
  try {
    await apiRequest<void>(`/developer-web/contact-forms/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error al eliminar formulario de contacto:', error);
    throw error;
  }
};

// Servicio para obtener estadísticas de formularios de contacto
export const getContactFormStats = async (): Promise<ContactFormStats> => {
  try {
    const response = await apiRequest<ContactFormStatsResponse>(
      '/developer-web/contact-forms/stats/summary',
      {
        method: 'GET',
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de formularios de contacto:', error);
    throw error;
  }
};
