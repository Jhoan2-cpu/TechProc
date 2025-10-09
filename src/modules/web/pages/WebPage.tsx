import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faBullhorn,
  faBell,
  faEnvelope,
  faRobot,
  faTachometerAlt,
  faPlus,
  faCheck,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import type {
  News,
  Alert,
  Announcement,
  ContactForm,
  ChatbotFAQ,
  NewsStatus,
  AlertStatus,
  AnnouncementStatus,
  ContactFormStatus,
} from '../types';
import {
  WebStatsCard,
  NewsCard,
  AlertCard,
  AnnouncementCard,
  ContactFormCard,
  ChatbotFAQCard,
} from '../components';
import {
  NewsFormModal,
  DeleteNewsModal,
  AlertFormModal,
  DeleteAlertModal,
  AnnouncementFormModal,
  DeleteAnnouncementModal,
  RespondContactModal,
  FAQFormModal,
  DeleteFAQModal,
  ChatbotConfigModal,
} from '../components';

// Datos mock - Noticias
const mockNews: News[] = [
  {
    id_news: 1,
    title: 'Nueva Certificación en Desarrollo Web Disponible',
    slug: 'nueva-certificacion-desarrollo-web',
    summary: 'Ahora ofrecemos una certificación completa en desarrollo web frontend y backend',
    content: 'Contenido completo de la noticia...',
    featured_image: '/images/news/web-cert.jpg',
    author_id: 1,
    author_name: 'Juan Pérez',
    category: 'Educación',
    tags: ['certificación', 'desarrollo web', 'cursos'],
    status: 'published',
    views: 1250,
    published_date: '2024-03-10',
    created_date: '2024-03-08',
    updated_date: '2024-03-09',
  },
  {
    id_news: 2,
    title: 'Convenio con Microsoft para Capacitaciones',
    slug: 'convenio-microsoft-capacitaciones',
    summary: 'Firmamos alianza estratégica con Microsoft para ofrecer cursos certificados',
    content: 'Contenido completo de la noticia...',
    featured_image: '/images/news/microsoft.jpg',
    author_id: 1,
    author_name: 'Juan Pérez',
    category: 'Alianzas',
    tags: ['microsoft', 'convenio', 'certificaciones'],
    status: 'published',
    views: 3420,
    published_date: '2024-03-05',
    created_date: '2024-03-03',
    updated_date: null,
  },
  {
    id_news: 3,
    title: 'Próximo Webinar: Inteligencia Artificial en 2024',
    slug: 'webinar-ia-2024',
    summary: 'Únete a nuestro webinar gratuito sobre las últimas tendencias en IA',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Juan Pérez',
    category: 'Eventos',
    tags: ['webinar', 'ia', 'gratis'],
    status: 'draft',
    views: 0,
    published_date: null,
    created_date: '2024-03-14',
    updated_date: '2024-03-15',
  },
];

// Datos mock - Alertas
const mockAlerts: Alert[] = [
  {
    id_alert: 1,
    message: '¡Inscripciones abiertas para el curso de Python! 50% de descuento hasta el 31 de marzo',
    type: 'success',
    status: 'active',
    link_url: '/cursos/python-basico',
    link_text: 'Inscríbete ahora',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    priority: 1,
    created_by: 1,
    created_date: '2024-03-01',
  },
  {
    id_alert: 2,
    message: 'Mantenimiento programado del 16 al 17 de marzo. El sitio estará temporalmente fuera de línea.',
    type: 'warning',
    status: 'active',
    link_url: null,
    link_text: null,
    start_date: '2024-03-14',
    end_date: '2024-03-18',
    priority: 2,
    created_by: 1,
    created_date: '2024-03-14',
  },
  {
    id_alert: 3,
    message: 'Nueva plataforma de certificaciones disponible. Verifica tus logros.',
    type: 'info',
    status: 'inactive',
    link_url: '/certificaciones',
    link_text: 'Ver más',
    start_date: '2024-02-20',
    end_date: '2024-03-10',
    priority: 3,
    created_by: 1,
    created_date: '2024-02-20',
  },
];

// Datos mock - Anuncios
const mockAnnouncements: Announcement[] = [
  {
    id_announcement: 1,
    title: '¡Semana de Descuentos!',
    content: 'Todos los cursos con 40% de descuento esta semana. No te lo pierdas.',
    image_url: '/images/banners/descuentos.png',
    display_type: 'popup',
    target_page: 'all',
    link_url: '/cursos',
    button_text: 'Ver Cursos',
    status: 'active',
    start_date: '2024-03-15',
    end_date: '2024-03-22',
    views: 5420,
    clicks: 892,
    created_by: 1,
    created_date: '2024-03-14',
  },
  {
    id_announcement: 2,
    title: 'Nuevo Campus Virtual',
    content: 'Descubre nuestro renovado campus virtual con mejor experiencia de usuario',
    image_url: null,
    display_type: 'banner',
    target_page: 'home',
    link_url: '/campus',
    button_text: 'Explorar',
    status: 'active',
    start_date: '2024-03-10',
    end_date: null,
    views: 12350,
    clicks: 1240,
    created_by: 1,
    created_date: '2024-03-09',
  },
];

// Datos mock - Consultas
const mockContactForms: ContactForm[] = [
  {
    id_contact: 1,
    full_name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    phone: '+51 987654321',
    company: 'Tech Solutions SAC',
    subject: 'Cotización para Capacitación Empresarial',
    message: 'Buenos días, estamos interesados en capacitar a nuestro equipo de desarrollo en tecnologías cloud. Somos 15 personas.',
    form_type: 'quote',
    status: 'pending',
    priority: 'high',
    assigned_to: null,
    response: null,
    response_date: null,
    submission_date: '2024-03-15 09:30:00',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0...',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'empresas-2024',
  },
  {
    id_contact: 2,
    full_name: 'Carlos Ramírez',
    email: 'carlos.ram@gmail.com',
    phone: null,
    company: null,
    subject: 'Consulta sobre Certificaciones',
    message: '¿Las certificaciones que ofrecen tienen validez internacional?',
    form_type: 'contact',
    status: 'in_progress',
    priority: 'medium',
    assigned_to: 1,
    assigned_to_name: 'Juan Pérez',
    response: 'Estimado Carlos, sí todas nuestras certificaciones tienen validez internacional...',
    response_date: '2024-03-14 15:20:00',
    submission_date: '2024-03-14 10:15:00',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0...',
  },
  {
    id_contact: 3,
    full_name: 'Ana Torres',
    email: 'ana.torres@startup.pe',
    phone: '+51 912345678',
    company: 'Startup Innovadora',
    subject: 'Propuesta de Alianza Estratégica',
    message: 'Somos una startup de EdTech y nos gustaría explorar una posible alianza.',
    form_type: 'partnership',
    status: 'pending',
    priority: 'urgent',
    assigned_to: null,
    response: null,
    response_date: null,
    submission_date: '2024-03-15 14:00:00',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0...',
  },
  {
    id_contact: 4,
    full_name: 'Spam Bot',
    email: 'spam@test.com',
    phone: null,
    company: null,
    subject: 'Buy cheap products now!!!',
    message: 'Click here for amazing deals...',
    form_type: 'contact',
    status: 'spam',
    priority: 'low',
    assigned_to: null,
    response: null,
    response_date: null,
    submission_date: '2024-03-15 08:00:00',
    ip_address: '192.168.1.103',
    user_agent: 'Bot...',
  },
];

// Datos mock - FAQs del Chatbot
const mockChatbotFAQs: ChatbotFAQ[] = [
  {
    id_faq: 1,
    question: '¿Cuáles son los horarios de atención?',
    answer: 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 1:00 PM.',
    category: 'General',
    keywords: ['horarios', 'atención', 'horario', 'cuando'],
    active: true,
    usage_count: 245,
    created_date: '2024-01-10',
    updated_date: '2024-02-15',
  },
  {
    id_faq: 2,
    question: '¿Cómo me inscribo a un curso?',
    answer: 'Para inscribirte, ve a nuestra sección de Cursos, selecciona el curso de tu interés y haz clic en "Inscribirse". Luego completa el formulario y realiza el pago.',
    category: 'Cursos',
    keywords: ['inscribir', 'inscripción', 'registrar', 'curso', 'matrícula'],
    active: true,
    usage_count: 892,
    created_date: '2024-01-10',
    updated_date: null,
  },
  {
    id_faq: 3,
    question: '¿Ofrecen certificados?',
    answer: 'Sí, al completar exitosamente un curso recibirás un certificado digital con validez internacional que puedes compartir en LinkedIn.',
    category: 'Certificaciones',
    keywords: ['certificado', 'certificación', 'diploma', 'título'],
    active: true,
    usage_count: 567,
    created_date: '2024-01-10',
    updated_date: '2024-03-01',
  },
  {
    id_faq: 4,
    question: '¿Cuáles son las formas de pago?',
    answer: 'Aceptamos tarjetas de crédito/débito, transferencias bancarias, y pagos por Yape o Plin.',
    category: 'Pagos',
    keywords: ['pago', 'pagar', 'precio', 'costo', 'tarjeta', 'transferencia'],
    active: true,
    usage_count: 423,
    created_date: '2024-01-10',
    updated_date: null,
  },
];

type WebTab = 'dashboard' | 'news' | 'alerts' | 'announcements' | 'contacts' | 'chatbot';

export const WebPage = () => {
  const location = useLocation();
  const [news, setNews] = useState(mockNews);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [contacts, setContacts] = useState(mockContactForms);
  const [faqs, setFaqs] = useState(mockChatbotFAQs);

  // Estados para modales - News
  const [showNewsFormModal, setShowNewsFormModal] = useState(false);
  const [showDeleteNewsModal, setShowDeleteNewsModal] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  // Estados para modales - Alerts
  const [showAlertFormModal, setShowAlertFormModal] = useState(false);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<Alert | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  // Estados para modales - Announcements
  const [showAnnouncementFormModal, setShowAnnouncementFormModal] = useState(false);
  const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  // Estados para modales - Contacts
  const [showRespondContactModal, setShowRespondContactModal] = useState(false);
  const [contactToRespond, setContactToRespond] = useState<ContactForm | null>(null);

  // Estados para modales - FAQs
  const [showFAQFormModal, setShowFAQFormModal] = useState(false);
  const [showDeleteFAQModal, setShowDeleteFAQModal] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<ChatbotFAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<ChatbotFAQ | null>(null);

  // Estados para configuración del Chatbot
  const [showChatbotConfigModal, setShowChatbotConfigModal] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState({
    enabled: true,
    greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
    fallback_message: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
    response_delay: 1000,
    max_conversations_per_day: 1000,
    contact_threshold: 3,
  });

  // Determinar la sección actual basándose en la ruta
  const getCurrentTab = (): WebTab => {
    const path = location.pathname;
    if (path.includes('news')) return 'news';
    if (path.includes('alerts')) return 'alerts';
    if (path.includes('announcements')) return 'announcements';
    if (path.includes('contacts')) return 'contacts';
    if (path.includes('chatbot')) return 'chatbot';
    return 'dashboard';
  };

  const activeTab = getCurrentTab();

  const publishedNews = news.filter(n => n.status === 'published').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const activeAnnouncements = announcements.filter(a => a.status === 'active').length;
  const pendingContacts = contacts.filter(c => c.status === 'pending').length;
  const totalFAQs = faqs.filter(f => f.active).length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
      case 'resolved':
        return 'bg-success/20 text-green-700';
      case 'draft':
      case 'pending':
      case 'in_progress':
        return 'bg-warning/20 text-yellow-700';
      case 'inactive':
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      case 'spam':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger/20 text-red-700';
      case 'high': return 'bg-orange-900/20 text-orange-700';
      case 'medium': return 'bg-warning/20 text-yellow-700';
      case 'low': return 'bg-primary-900/20 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/20 text-green-700 border-green-300';
      case 'warning': return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'error': return 'bg-danger/20 text-red-700 border-red-300';
      case 'info': return 'bg-primary-900/20 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // ==================== HANDLERS - NEWS ====================
  const handleNewNews = () => {
    setNewsToEdit(null);
    setShowNewsFormModal(true);
  };

  const handleEditNews = (newsItem: News) => {
    setNewsToEdit(newsItem);
    setShowNewsFormModal(true);
  };

  const handleDeleteNews = (newsItem: News) => {
    setNewsToDelete(newsItem);
    setShowDeleteNewsModal(true);
  };

  const handlePublishNews = (newsItem: News) => {
    const updatedNews = news.map(n =>
      n.id_news === newsItem.id_news
        ? { ...n, status: 'published' as NewsStatus, published_date: new Date().toISOString().split('T')[0] }
        : n
    );
    setNews(updatedNews);
  };

  const handleArchiveNews = (newsItem: News) => {
    const updatedNews = news.map(n =>
      n.id_news === newsItem.id_news ? { ...n, status: 'archived' as NewsStatus } : n
    );
    setNews(updatedNews);
  };

  const handleSaveNews = (newsData: Partial<News>) => {
    if (newsToEdit) {
      const updatedNews = news.map(n =>
        n.id_news === newsToEdit.id_news ? { ...n, ...newsData, updated_date: new Date().toISOString().split('T')[0] } : n
      );
      setNews(updatedNews);
    } else {
      const newNewsItem: News = {
        id_news: Date.now(),
        ...newsData as Omit<News, 'id_news'>,
        views: 0,
        created_date: new Date().toISOString().split('T')[0],
        updated_date: null,
        published_date: newsData.status === 'published' ? new Date().toISOString().split('T')[0] : null,
      };
      setNews([newNewsItem, ...news]);
    }
    setShowNewsFormModal(false);
    setNewsToEdit(null);
  };

  const handleConfirmDeleteNews = () => {
    if (newsToDelete) {
      setNews(news.filter(n => n.id_news !== newsToDelete.id_news));
      setShowDeleteNewsModal(false);
      setNewsToDelete(null);
    }
  };

  // ==================== HANDLERS - ALERTS ====================
  const handleNewAlert = () => {
    setAlertToEdit(null);
    setShowAlertFormModal(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setAlertToEdit(alert);
    setShowAlertFormModal(true);
  };

  const handleDeleteAlert = (alert: Alert) => {
    setAlertToDelete(alert);
    setShowDeleteAlertModal(true);
  };

  const handleToggleAlertStatus = (alert: Alert) => {
    const newStatus: AlertStatus = alert.status === 'active' ? 'inactive' : 'active';
    const updatedAlerts = alerts.map(a =>
      a.id_alert === alert.id_alert ? { ...a, status: newStatus } : a
    );
    setAlerts(updatedAlerts);
  };

  const handleSaveAlert = (alertData: Partial<Alert>) => {
    if (alertToEdit) {
      const updatedAlerts = alerts.map(a =>
        a.id_alert === alertToEdit.id_alert ? { ...a, ...alertData } : a
      );
      setAlerts(updatedAlerts);
    } else {
      const newAlert: Alert = {
        id_alert: Date.now(),
        ...alertData as Omit<Alert, 'id_alert'>,
        created_date: new Date().toISOString().split('T')[0],
      };
      setAlerts([newAlert, ...alerts]);
    }
    setShowAlertFormModal(false);
    setAlertToEdit(null);
  };

  const handleConfirmDeleteAlert = () => {
    if (alertToDelete) {
      setAlerts(alerts.filter(a => a.id_alert !== alertToDelete.id_alert));
      setShowDeleteAlertModal(false);
      setAlertToDelete(null);
    }
  };

  // ==================== HANDLERS - ANNOUNCEMENTS ====================
  const handleNewAnnouncement = () => {
    setAnnouncementToEdit(null);
    setShowAnnouncementFormModal(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement);
    setShowAnnouncementFormModal(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteAnnouncementModal(true);
  };

  const handleToggleAnnouncementStatus = (announcement: Announcement) => {
    const newStatus: AnnouncementStatus = announcement.status === 'active' ? 'inactive' : 'active';
    const updatedAnnouncements = announcements.map(a =>
      a.id_announcement === announcement.id_announcement ? { ...a, status: newStatus } : a
    );
    setAnnouncements(updatedAnnouncements);
  };

  const handleSaveAnnouncement = (announcementData: Partial<Announcement>) => {
    if (announcementToEdit) {
      const updatedAnnouncements = announcements.map(a =>
        a.id_announcement === announcementToEdit.id_announcement ? { ...a, ...announcementData } : a
      );
      setAnnouncements(updatedAnnouncements);
    } else {
      const newAnnouncement: Announcement = {
        id_announcement: Date.now(),
        ...announcementData as Omit<Announcement, 'id_announcement'>,
        views: 0,
        clicks: 0,
        created_date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    setShowAnnouncementFormModal(false);
    setAnnouncementToEdit(null);
  };

  const handleConfirmDeleteAnnouncement = () => {
    if (announcementToDelete) {
      setAnnouncements(announcements.filter(a => a.id_announcement !== announcementToDelete.id_announcement));
      setShowDeleteAnnouncementModal(false);
      setAnnouncementToDelete(null);
    }
  };

  // ==================== HANDLERS - CONTACTS ====================
  const handleRespondContact = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleMarkAsSpam = (contact: ContactForm) => {
    const updatedContacts = contacts.map(c =>
      c.id_contact === contact.id_contact
        ? { ...c, status: 'spam' as ContactFormStatus }
        : c
    );
    setContacts(updatedContacts);
  };

  const handleResolve = (contact: ContactForm) => {
    const updatedContacts = contacts.map(c =>
      c.id_contact === contact.id_contact
        ? { ...c, status: 'resolved' as ContactFormStatus }
        : c
    );
    setContacts(updatedContacts);
  };

  const handleViewContactDetails = (contact: ContactForm) => {
    // Abre el mismo modal de responder pero en modo lectura
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleSaveContactResponse = (contactId: number, response: string, status: ContactFormStatus, assignedTo: number | null) => {
    const updatedContacts = contacts.map(c =>
      c.id_contact === contactId
        ? {
            ...c,
            response,
            status,
            assigned_to: assignedTo,
            response_date: new Date().toISOString(),
          }
        : c
    );
    setContacts(updatedContacts);
    setShowRespondContactModal(false);
    setContactToRespond(null);
  };

  // ==================== HANDLERS - FAQS ====================
  const handleNewFAQ = () => {
    setFaqToEdit(null);
    setShowFAQFormModal(true);
  };

  const handleEditFAQ = (faq: ChatbotFAQ) => {
    setFaqToEdit(faq);
    setShowFAQFormModal(true);
  };

  const handleDeleteFAQ = (faq: ChatbotFAQ) => {
    setFaqToDelete(faq);
    setShowDeleteFAQModal(true);
  };

  const handleToggleFAQActive = (faq: ChatbotFAQ) => {
    const updatedFAQs = faqs.map(f =>
      f.id_faq === faq.id_faq ? { ...f, active: !f.active } : f
    );
    setFaqs(updatedFAQs);
  };

  const handleSaveFAQ = (faqData: Partial<ChatbotFAQ>) => {
    if (faqToEdit) {
      const updatedFAQs = faqs.map(f =>
        f.id_faq === faqToEdit.id_faq
          ? { ...f, ...faqData, updated_date: new Date().toISOString().split('T')[0] }
          : f
      );
      setFaqs(updatedFAQs);
    } else {
      const newFAQ: ChatbotFAQ = {
        id_faq: Date.now(),
        ...faqData as Omit<ChatbotFAQ, 'id_faq'>,
        usage_count: 0,
        created_date: new Date().toISOString().split('T')[0],
        updated_date: null,
      };
      setFaqs([newFAQ, ...faqs]);
    }
    setShowFAQFormModal(false);
    setFaqToEdit(null);
  };

  const handleConfirmDeleteFAQ = () => {
    if (faqToDelete) {
      setFaqs(faqs.filter(f => f.id_faq !== faqToDelete.id_faq));
      setShowDeleteFAQModal(false);
      setFaqToDelete(null);
    }
  };

  // ==================== HANDLERS - CHATBOT CONFIG ====================
  const handleOpenChatbotConfig = () => {
    setShowChatbotConfigModal(true);
  };

  const handleSaveChatbotConfig = (config: typeof chatbotConfig) => {
    setChatbotConfig(config);
    setShowChatbotConfigModal(false);
  };


  const renderDashboard = () => (
    <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <WebStatsCard
          title="Noticias Publicadas"
          value={publishedNews}
          icon={faNewspaper}
          colorClass="from-blue-50 to-blue-100 text-blue-700 bg-blue-600"
          index={0}
        />
        <WebStatsCard
          title="Alertas Activas"
          value={activeAlerts}
          icon={faBell}
          colorClass="from-green-50 to-green-100 text-green-700 bg-green-600"
          index={1}
        />
        <WebStatsCard
          title="Anuncios Activos"
          value={activeAnnouncements}
          icon={faBullhorn}
          colorClass="from-purple-50 to-purple-100 text-purple-700 bg-purple-600"
          index={2}
        />
        <WebStatsCard
          title="Consultas Pendientes"
          value={pendingContacts}
          icon={faEnvelope}
          colorClass="from-orange-50 to-orange-100 text-orange-700 bg-orange-600"
          index={3}
        />
        <WebStatsCard
          title="FAQs Chatbot"
          value={totalFAQs}
          icon={faRobot}
          colorClass="from-indigo-50 to-indigo-100 text-indigo-700 bg-indigo-600"
          index={4}
        />
      </div>

      {/* Consultas Pendientes */}
      {pendingContacts > 0 && (
        <div className="card p-6 bg-orange-900/20 border-2 border-orange-200">
          <h2 className="text-xl font-heading font-bold text-orange-400 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} />
            Consultas Pendientes - Requieren Atención
          </h2>
          <div className="space-y-3">
            {contacts.filter(c => c.status === 'pending').map((contact) => (
              <div key={contact.id_contact} className="bg-white border border-orange-300 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold text-white">{contact.full_name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{contact.subject}</p>
                    <p className="text-xs text-gray-300">{contact.email} • {formatDateTime(contact.submission_date)}</p>
                  </div>
                  <button
                    onClick={() => handleRespondContact(contact)}
                    className="btn bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Responder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Noticias Recientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-white mb-4">Noticias Recientes</h2>
          <div className="space-y-3">
            {news.slice(0, 3).map((item) => (
              <div key={item.id_news} className="border-l-4 border-blue-500 bg-primary-900/20 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{item.category} • {item.views} vistas</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-white mb-4">Anuncios Activos</h2>
          <div className="space-y-3">
            {announcements.filter(a => a.status === 'active').map((item) => (
              <div key={item.id_announcement} className="border-l-4 border-purple-500 bg-purple-900/20 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.views} vistas • {item.clicks} clics • CTR: {((item.clicks / item.views) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-purple-900/20 text-purple-700">
                    {item.display_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderNews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Noticias</h2>
        <button
          onClick={handleNewNews}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nueva Noticia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.map((item, index) => (
          <NewsCard
            key={item.id_news}
            news={item}
            index={index}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
            onPublish={handlePublishNews}
            onArchive={handleArchiveNews}
          />
        ))}
      </div>

      {/* Modales */}
      <NewsFormModal
        isOpen={showNewsFormModal}
        news={newsToEdit}
        onSave={handleSaveNews}
        onCancel={() => {
          setShowNewsFormModal(false);
          setNewsToEdit(null);
        }}
      />

      <DeleteNewsModal
        isOpen={showDeleteNewsModal}
        news={newsToDelete}
        onConfirm={handleConfirmDeleteNews}
        onCancel={() => {
          setShowDeleteNewsModal(false);
          setNewsToDelete(null);
        }}
      />
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Alertas</h2>
        <button
          onClick={handleNewAlert}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nueva Alerta
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, index) => (
          <AlertCard
            key={alert.id_alert}
            alert={alert}
            index={index}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getAlertTypeColor={getAlertTypeColor}
            onEdit={handleEditAlert}
            onDelete={handleDeleteAlert}
            onToggleStatus={handleToggleAlertStatus}
          />
        ))}
      </div>

      {/* Modales */}
      <AlertFormModal
        isOpen={showAlertFormModal}
        alert={alertToEdit}
        onSave={handleSaveAlert}
        onCancel={() => {
          setShowAlertFormModal(false);
          setAlertToEdit(null);
        }}
      />

      <DeleteAlertModal
        isOpen={showDeleteAlertModal}
        alert={alertToDelete}
        onConfirm={handleConfirmDeleteAlert}
        onCancel={() => {
          setShowDeleteAlertModal(false);
          setAlertToDelete(null);
        }}
      />
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Anuncios</h2>
        <button
          onClick={handleNewAnnouncement}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Anuncio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id_announcement}
            announcement={announcement}
            index={index}
            getStatusColor={getStatusColor}
            onEdit={handleEditAnnouncement}
            onDelete={handleDeleteAnnouncement}
            onToggleStatus={handleToggleAnnouncementStatus}
          />
        ))}
      </div>

      {/* Modales */}
      <AnnouncementFormModal
        isOpen={showAnnouncementFormModal}
        announcement={announcementToEdit}
        onSave={handleSaveAnnouncement}
        onCancel={() => {
          setShowAnnouncementFormModal(false);
          setAnnouncementToEdit(null);
        }}
      />

      <DeleteAnnouncementModal
        isOpen={showDeleteAnnouncementModal}
        announcement={announcementToDelete}
        onConfirm={handleConfirmDeleteAnnouncement}
        onCancel={() => {
          setShowDeleteAnnouncementModal(false);
          setAnnouncementToDelete(null);
        }}
      />
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Consultas y Formularios de Contacto</h2>
        <div className="flex gap-2">
          <select className="select">
            <option>Todos</option>
            <option>Pendientes</option>
            <option>En Progreso</option>
            <option>Resueltos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact, index) => (
          <ContactFormCard
            key={contact.id_contact}
            contact={contact}
            index={index}
            formatDateTime={formatDateTime}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            onRespond={handleRespondContact}
            onMarkAsSpam={handleMarkAsSpam}
            onResolve={handleResolve}
            onViewDetails={handleViewContactDetails}
          />
        ))}
      </div>
    </div>
  );

  const renderChatbot = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión del Chatbot</h2>
        <button
          onClick={handleOpenChatbotConfig}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faCog} />
          Configuración
        </button>
      </div>

      {/* Estado del Chatbot */}
      <div className="card p-6 bg-success/20 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-success mb-1">Estado del Chatbot</h3>
            <p className="text-sm text-green-700">El chatbot está activo y respondiendo consultas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-green-700">Conversaciones hoy</p>
              <p className="text-2xl font-bold text-success">24</p>
            </div>
            <button className="btn bg-green-600 hover:bg-green-700 text-white">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Activo
            </button>
          </div>
        </div>
      </div>

      {/* FAQs del Chatbot */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-bold text-white">Preguntas Frecuentes</h3>
          <button
            onClick={handleNewFAQ}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <ChatbotFAQCard
              key={faq.id_faq}
              faq={faq}
              index={index}
              onEdit={handleEditFAQ}
              onDelete={handleDeleteFAQ}
              onToggleActive={handleToggleFAQActive}
            />
          ))}
        </div>
      </div>

      {/* Modales */}
      <FAQFormModal
        isOpen={showFAQFormModal}
        faq={faqToEdit}
        onSave={handleSaveFAQ}
        onCancel={() => {
          setShowFAQFormModal(false);
          setFaqToEdit(null);
        }}
      />

      <DeleteFAQModal
        isOpen={showDeleteFAQModal}
        faq={faqToDelete}
        onConfirm={handleConfirmDeleteFAQ}
        onCancel={() => {
          setShowDeleteFAQModal(false);
          setFaqToDelete(null);
        }}
      />

      <ChatbotConfigModal
        isOpen={showChatbotConfigModal}
        config={chatbotConfig}
        onSave={handleSaveChatbotConfig}
        onCancel={() => setShowChatbotConfigModal(false)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'news' && renderNews()}
      {activeTab === 'alerts' && renderAlerts()}
      {activeTab === 'announcements' && renderAnnouncements()}
      {activeTab === 'contacts' && renderContacts()}
      {activeTab === 'chatbot' && renderChatbot()}

      {/* Modal Global - RespondContact (usado desde dashboard y contacts) */}
      <RespondContactModal
        isOpen={showRespondContactModal}
        contact={contactToRespond}
        onSave={handleSaveContactResponse}
        onCancel={() => {
          setShowRespondContactModal(false);
          setContactToRespond(null);
        }}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};
