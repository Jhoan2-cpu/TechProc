import { useState, useEffect } from 'react';
import type { ContactForm, ContactFormStatus, News, Announcement } from '../types';
import {
  WebDashboardStats,
  PendingContactsSection,
  RecentNewsSection,
  ActiveAnnouncementsSection,
  RespondContactModal,
} from '../components';
import {
  dashboardService,
  type DashboardStats,
  newsService,
  announcementsService,
  contactFormsService,
} from '../services/webService';

export const WebDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pendingContacts, setPendingContacts] = useState<ContactForm[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showRespondContactModal, setShowRespondContactModal] = useState(false);
  const [contactToRespond, setContactToRespond] = useState<ContactForm | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas y datos recientes en paralelo
      const [
        statsData,
        { news: newsData },
        { announcements: announcementsData },
        { forms: contactsData },
      ] = await Promise.all([
        dashboardService.getStatistics(),
        newsService.getAll({ limit: 5, status: 'published' }),
        announcementsService.getAll({ limit: 10, status: 'published' }), // Aumentar límite
        contactFormsService.getAll({ limit: 10, status: 'pending' }),
      ]);

      setStats(statsData);
      setNews(newsData);
      setAnnouncements(announcementsData);
      setPendingContacts(contactsData);
    } catch (err: any) {
      console.error('Error al cargar datos del dashboard:', err);
      setError(err.message || 'Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger/20 text-red-700 border-red-300';
      case 'high': return 'bg-orange-900/20 text-orange-700 border-orange-300';
      case 'medium': return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-primary-900/20 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
      case 'resolved':
        return 'bg-success/20 text-green-700 border-green-300';
      case 'draft':
      case 'pending':
      case 'in_progress':
        return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'inactive':
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'spam':
        return 'bg-danger/20 text-red-700 border-red-300';
      default:
        return 'bg-primary-900/20 text-blue-700 border-blue-300';
    }
  };

  const handleRespondContact = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleSaveContactResponse = async (contactId: number, response: string, status: ContactFormStatus) => {
    if (!contactToRespond) return;

    try {
      await contactFormsService.respond(contactId, { response, status });

      // Recargar solo las consultas pendientes
      const { forms } = await contactFormsService.getAll({
        limit: 10,
        status: 'pending'
      });
      setPendingContacts(forms);

      // Recargar estadísticas para actualizar contadores
      const statsData = await dashboardService.getStatistics();
      setStats(statsData);

      setShowRespondContactModal(false);
      setContactToRespond(null);
    } catch (err: any) {
      console.error('Error al guardar respuesta:', err);
      throw err; // Propagar el error al modal para que lo muestre
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <WebDashboardStats
        publishedNews={stats?.news.published || 0}
        activeAlerts={stats?.alerts.active || 0}
        publishedAnnouncements={stats?.announcements.published || 0}
        pendingContacts={stats?.contact_forms.pending || 0}
        totalFAQs={stats?.chatbot.total_faqs || 0}
        contactStats={{
          total: stats?.contact_forms.total || 0,
          pending: stats?.contact_forms.pending || 0,
          in_progress: stats?.contact_forms.in_progress || 0,
          responded: stats?.contact_forms.resolved || 0,
          spam: stats?.contact_forms.spam || 0,
        }}
        isLoading={loading}
      />

      {/* Consultas Pendientes */}
      {pendingContacts.length > 0 && (
        <PendingContactsSection
          contacts={pendingContacts}
          formatDateTime={formatDateTime}
          getPriorityColor={getPriorityColor}
          onRespond={handleRespondContact}
        />
      )}

      {/* Noticias Recientes y Anuncios Activos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentNewsSection 
          news={news} 
          getStatusColor={getStatusColor} 
        />
        <ActiveAnnouncementsSection 
          announcements={announcements} 
        />
      </div>

      {/* Modal de Respuesta */}
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