// Enums
export type NewsStatus = 'draft' | 'published' | 'archived';
export type AlertType = 'info' | 'warning' | 'error' | 'success';
export type AlertStatus = 'active' | 'inactive' | 'expired';
export type AnnouncementStatus = 'active' | 'inactive' | 'scheduled';
export type ContactFormStatus = 'pending' | 'in_progress' | 'resolved' | 'spam';
export type ContactFormPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ChatbotStatus = 'active' | 'inactive' | 'training';

// Interfaces - Noticias
export interface News {
  id_news: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string | null;
  author_id: number;
  author_name?: string;
  category: string;
  tags: string[];
  status: NewsStatus;
  views: number;
  published_date: string | null;
  created_date: string;
  updated_date: string | null;
  seo_title?: string;
  seo_description?: string;
}

// Interfaces - Alertas (Banner superior del sitio)
export interface Alert {
  id_alert: number;
  message: string;
  type: AlertType;
  status: AlertStatus;
  link_url: string | null;
  link_text: string | null;
  start_date: string;
  end_date: string | null;
  priority: number; // Orden de visualización
  created_by: number;
  created_date: string;
}

// Interfaces - Anuncios (Pop-ups, banners laterales, etc.)
export interface Announcement {
  id_announcement: number;
  title: string;
  content: string;
  image_url: string | null;
  display_type: 'popup' | 'banner' | 'sidebar'; // Tipo de visualización
  target_page: string; // all, home, courses, etc.
  link_url: string | null;
  button_text: string | null;
  status: AnnouncementStatus;
  start_date: string;
  end_date: string | null;
  views: number;
  clicks: number;
  created_by: number;
  created_date: string;
}

// Interfaces - Formularios de Contacto
export interface ContactForm {
  id_contact: number;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  form_type: 'contact' | 'quote' | 'support' | 'partnership'; // Tipo de formulario
  status: ContactFormStatus;
  priority: ContactFormPriority;
  assigned_to: number | null;
  assigned_to_name?: string;
  response: string | null;
  response_date: string | null;
  submission_date: string;
  ip_address: string;
  user_agent: string;
  utm_source?: string; // Para tracking de marketing
  utm_medium?: string;
  utm_campaign?: string;
}

// Interfaces - Configuración del Chatbot
export interface ChatbotConfig {
  id_config: number;
  chatbot_name: string;
  welcome_message: string;
  fallback_message: string; // Mensaje cuando no entiende
  status: ChatbotStatus;
  language: string;
  theme_color: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  auto_open: boolean;
  auto_open_delay: number; // segundos
  working_hours_enabled: boolean;
  working_hours_start: string | null;
  working_hours_end: string | null;
  offline_message: string | null;
  updated_by: number;
  updated_date: string;
}

// Interfaces - Preguntas Frecuentes del Chatbot
export interface ChatbotFAQ {
  id_faq: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[]; // Para mejorar matching
  active: boolean;
  usage_count: number; // Cuántas veces se usó
  created_date: string;
  updated_date: string | null;
}

// Interfaces - Conversaciones del Chatbot
export interface ChatbotConversation {
  id_conversation: number;
  session_id: string;
  user_name: string | null;
  user_email: string | null;
  messages: ChatbotMessage[];
  started_date: string;
  ended_date: string | null;
  satisfaction_rating: number | null; // 1-5 estrellas
  feedback: string | null;
  resolved: boolean;
  handed_to_human: boolean;
}

// Interfaces - Mensajes individuales del chat
export interface ChatbotMessage {
  id_message: number;
  conversation_id: number;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: string;
  faq_matched?: number | null; // ID de FAQ si coincidió con una
}

// Interfaces - Estadísticas del Sitio Web
export interface WebsiteStats {
  total_news: number;
  published_news: number;
  active_alerts: number;
  active_announcements: number;
  pending_contacts: number;
  chatbot_conversations_today: number;
  total_views_today: number;
}
