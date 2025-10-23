import { apiRequest } from './api.config';
import type { ChatbotFAQ } from '../modules/web/types';

// Interfaces para las respuestas de la API
interface ChatbotFaqApiResponse {
  id: number;
  id_faq: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface StartConversationResponse {
  success: boolean;
  data: {
    conversation_id: number; // Cambiado a number para coincidir con tu ejemplo
    welcome_message: string; // Cambiado para coincidir con tu ejemplo
  };
}

interface SendMessageResponse {
  success: boolean;
  data: {
    response: string; // Cambiado de bot_response a response
    source: 'faq' | 'gemini' | 'fallback'; // Agregado source
    conversation_id: number;
    faq_id?: number | null;
  };
}

interface EndConversationResponse {
  success: boolean;
  message: string;
}

interface FaqsByCategoryResponse {
  success: boolean;
  data: ChatbotFaqApiResponse[];
}

// Interfaces para las peticiones
interface StartConversationRequest {
  user_agent?: string;
  ip_address?: string;
  initial_context?: string;
}

// interface SendMessageRequest {
//   conversation_id: number; // Cambiado a number
//   message: string;
// }

// Función para transformar la respuesta de la API al formato de ChatbotFAQ
const transformChatbotFaq = (apiFaq: ChatbotFaqApiResponse): ChatbotFAQ => {
  return {
    id: apiFaq.id,
    id_faq: apiFaq.id_faq,
    question: apiFaq.question,
    answer: apiFaq.answer,
    category: apiFaq.category,
    keywords: apiFaq.keywords,
    active: apiFaq.active,
    usage_count: apiFaq.usage_count,
    created_date: apiFaq.created_at,
    updated_date: apiFaq.updated_at,
  };
};

/**
 * Inicia una nueva conversación con el chatbot
 */
export const startConversation = async (data: StartConversationRequest = {}): Promise<{
  conversationId: number;
  welcomeMessage: string;
}> => {
  try {
    const response = await apiRequest<StartConversationResponse>(
      '/developer-web/chatbot/conversation/start',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return {
      conversationId: response.data.conversation_id,
      welcomeMessage: response.data.welcome_message,
    };
  } catch (error) {
    console.error('Error al iniciar conversación con el chatbot:', error);
    throw error;
  }
};

/**
 * Envía un mensaje al chatbot
 */
export const sendMessage = async (
  message: string,
  conversationId: number
): Promise<{
  response: string;
  source: 'faq' | 'gemini' | 'fallback';
  conversationId: number;
  faqId?: number | null;
}> => {
  try {
    const response = await apiRequest<SendMessageResponse>(
      '/developer-web/chatbot/conversation/message',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      }
    );

    return {
      response: response.data.response,
      source: response.data.source,
      conversationId: response.data.conversation_id,
      faqId: response.data.faq_id,
    };
  } catch (error) {
    console.error('Error al enviar mensaje al chatbot:', error);
    throw error;
  }
};

/**
 * Finaliza una conversación con el chatbot
 */
export const endConversation = async (
  conversationId: number,
  feedback?: {
    rating?: number;
    comment?: string;
    resolved?: boolean;
  }
): Promise<void> => {
  try {
    const body: any = {
      conversation_id: conversationId,
    };

    if (feedback) {
      body.feedback = feedback;
    }

    await apiRequest<EndConversationResponse>(
      '/developer-web/chatbot/conversation/end',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
  } catch (error) {
    console.error('Error al finalizar conversación con el chatbot:', error);
    throw error;
  }
};

/**
 * Servicio para obtener FAQs por categoría
 */
export const getFaqsByCategory = async (category?: string): Promise<ChatbotFAQ[]> => {
  try {
    const endpoint = category 
      ? `/developer-web/chatbot/categories/faqs/${category}`
      : '/developer-web/chatbot/categories/faqs';
    
    const response = await apiRequest<FaqsByCategoryResponse>(endpoint, {
      method: 'GET',
    });

    return response.data.map(transformChatbotFaq);
  } catch (error) {
    console.error('Error al obtener FAQs por categoría:', error);
    throw error;
  }
};

/**
 * Servicio para obtener todas las FAQs activas
 */
export const getAllActiveFaqs = async (): Promise<ChatbotFAQ[]> => {
  try {
    const response = await apiRequest<FaqsByCategoryResponse>(
      '/developer-web/chatbot/categories/faqs',
      {
        method: 'GET',
      }
    );

    return response.data.map(transformChatbotFaq);
  } catch (error) {
    console.error('Error al obtener todas las FAQs activas:', error);
    throw error;
  }
};

/**
 * Valida un mensaje antes de enviarlo
 */
export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.length <= 1000;
};

export type ConversationFeedback = {
  rating?: number;
  comment?: string;
  resolved?: boolean;
};