// Enums
export type NewsStatus = 'draft' | 'published' | 'archived';
export type AlertType = 'info' | 'warning' | 'error' | 'success' | 'maintenance';
export type AlertStatus = 'active' | 'inactive' | 'expired';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';
export type ContactFormStatus = 'pending' | 'resolved' | 'spam';
export type ContactFormPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ChatbotStatus = 'active' | 'inactive' | 'training';

export type NewsCategory = 
  | 'educación' 
  | 'tecnología' 
  | 'eventos' 
  | 'investigación' 
  | 'noticias' 
  | 'anuncios' 
  | 'becas' 
  | 'internacionalización'
  | 'desarrollo-estudiantil'
  | 'vinculación';

// Actualizar la interfaz News para usar el tipo de categoría
export interface News {
  id: number;
  id_news: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string | null;
  author_id: number;
  author_name?: string;
  category: NewsCategory; // Cambiar a NewsCategory
  tags: string[];
  status: NewsStatus;
  views: number;
  published_date: string | null;
  created_date: string;
  updated_date: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

// Interfaces - Alertas (Banner superior del sitio)
export interface Alert {
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_alert: number; // ID legible para humanos
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
  creator?: any; // Relación con usuario
}

// Interfaces - Anuncios (Pop-ups, banners laterales, etc.)
export interface Announcement {
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_announcement: number;
  title: string;
  content: string;
  image_url: string | null;
  display_type: 'banner' | 'modal' | 'popup' | 'notification';
  target_page: string;
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
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_contact: number;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  form_type: 'contact' | 'quote' | 'support' | 'partnership' | 'general' | 'sales';
  status: ContactFormStatus;
  priority: ContactFormPriority;
  assigned_to: number | null;
  assigned_to_name?: string;
  response: string | null;
  response_date: string | null;
  submission_date: string;
  ip_address?: string;
  user_agent?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Agregar este tipo para la configuración del chatbot
export interface ChatbotConfig {
  enabled: boolean;
  greeting_message: string;
  fallback_message: string;
  response_delay: number;
  max_conversations_per_day: number;
  contact_threshold: number;
  updated_at?: string;
}

// Mantener los tipos existentes pero actualizar ChatbotConfig si es necesario
export interface ChatbotConfigLegacy {
  id: number;
  id_config: number;
  chatbot_name: string;
  welcome_message: string;
  fallback_message: string;
  status: ChatbotStatus;
  language: string;
  theme_color: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  auto_open: boolean;
  auto_open_delay: number;
  working_hours_enabled: boolean;
  working_hours_start: string | null;
  working_hours_end: string | null;
  offline_message: string | null;
  updated_by: number;
  updated_date: string;
}

// Interfaces - Preguntas Frecuentes del Chatbot
export interface ChatbotFAQ {
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_faq: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  active: boolean;
  usage_count: number;
  created_date: string;
  updated_date: string | null;
}

// Interfaces - Conversaciones del Chatbot
export interface ChatbotConversation {
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_conversation: number;
  started_date: string;
  ended_date: string | null;
  satisfaction_rating: number | null;
  feedback: string | null;
  resolved: boolean;
  handed_to_human: boolean;
}

// Interfaces - Mensajes individuales del chat
export interface ChatbotMessage {
  id: number; // Clave primaria - USAR ESTE PARA OPERACIONES
  id_message: number;
  conversation_id: number;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: string;
  faq_matched?: number | null;
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