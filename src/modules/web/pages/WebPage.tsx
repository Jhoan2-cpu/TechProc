import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
  WebDashboardStats,
  PendingContactsSection,
  RecentNewsSection,
  ActiveAnnouncementsSection,
  NewsCard,
  AlertCard,
  AnnouncementCard,
  ContactFormCard,
  ChatbotFAQCard,
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
import {
  mockNews,
  mockAlerts,
  mockAnnouncements,
  mockChatbotFAQs,
} from '../../../services/mockData';
import {
  getContactForms,
  respondContactForm,
  markContactFormAsSpam,
} from '../../../services/webService';

type WebTab = 'dashboard' | 'news' | 'alerts' | 'announcements' | 'contacts' | 'chatbot';

export const WebPage = () => {
  const location = useLocation();
  const [news, setNews] = useState(mockNews);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [faqs, setFaqs] = useState(mockChatbotFAQs);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [contactsFilter, setContactsFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'spam'>('all');

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

  // Efecto para cargar los formularios de contacto desde la API
  useEffect(() => {
    const loadContactForms = async () => {
      setIsLoadingContacts(true);
      setContactsError(null);

      try {
        const { forms } = await getContactForms(contactsFilter);
        setContacts(forms);
      } catch (error) {
        console.error('Error al cargar formularios de contacto:', error);
        setContactsError('Error al cargar los formularios de contacto. Por favor, intenta nuevamente.');
      } finally {
        setIsLoadingContacts(false);
      }
    };

    loadContactForms();
  }, [contactsFilter]);

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

  const handleMarkAsSpam = async (contact: ContactForm) => {
    try {
      await markContactFormAsSpam(contact.id_contact);

      // Actualizar la lista local
      const updatedContacts = contacts.map(c =>
        c.id_contact === contact.id_contact
          ? { ...c, status: 'spam' as ContactFormStatus }
          : c
      );
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error al marcar como spam:', error);
      alert('Error al marcar el formulario como spam. Por favor, intenta nuevamente.');
    }
  };

  const handleResolve = async (contact: ContactForm) => {
    try {
      const updatedContact = await respondContactForm(
        contact.id_contact,
        contact.response || 'Resuelto',
        'resolved'
      );

      // Actualizar la lista local
      const updatedContacts = contacts.map(c =>
        c.id_contact === contact.id_contact ? updatedContact : c
      );
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error al resolver:', error);
      alert('Error al resolver el formulario. Por favor, intenta nuevamente.');
    }
  };

  const handleViewContactDetails = (contact: ContactForm) => {
    // Abre el mismo modal de responder pero en modo lectura
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleSaveContactResponse = async (
    contactId: number,
    response: string,
    status: ContactFormStatus,
    assignedTo: number | null
  ) => {
    try {
      const updatedContact = await respondContactForm(contactId, response, status);

      // Actualizar la lista local
      const updatedContacts = contacts.map(c =>
        c.id_contact === contactId ? updatedContact : c
      );
      setContacts(updatedContacts);
      setShowRespondContactModal(false);
      setContactToRespond(null);
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      alert('Error al guardar la respuesta. Por favor, intenta nuevamente.');
    }
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
      <WebDashboardStats
        publishedNews={publishedNews}
        activeAlerts={activeAlerts}
        activeAnnouncements={activeAnnouncements}
        pendingContacts={pendingContacts}
        totalFAQs={totalFAQs}
      />

      {/* Consultas Pendientes */}
      <PendingContactsSection
        contacts={contacts}
        formatDateTime={formatDateTime}
        getPriorityColor={getPriorityColor}
        onRespond={handleRespondContact}
      />

      {/* Noticias Recientes y Anuncios Activos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentNewsSection news={news} getStatusColor={getStatusColor} />
        <ActiveAnnouncementsSection announcements={announcements} />
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
          <select
            className="select"
            value={contactsFilter}
            onChange={(e) => setContactsFilter(e.target.value as typeof contactsFilter)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Progreso</option>
            <option value="resolved">Resueltos</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {isLoadingContacts && (
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando formularios de contacto...</p>
        </div>
      )}

      {contactsError && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {contactsError}
        </div>
      )}

      {!isLoadingContacts && !contactsError && contacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No hay formularios de contacto para mostrar.</p>
        </div>
      )}

      {!isLoadingContacts && !contactsError && contacts.length > 0 && (
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
      )}
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
