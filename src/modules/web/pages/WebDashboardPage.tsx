import { useState, useEffect } from 'react';
import type { ContactForm, News, Announcement } from '../types';
import {
  WebDashboardStats,
  PendingContactsSection,
  RecentNewsSection,
  ActiveAnnouncementsSection,
  RespondContactModal,
} from '../components';
import {
  getContactForms,
  respondContactForm,
  getContactFormStats,
  type ContactFormStats
} from '../../../services/webService';
import { mockNews, mockAnnouncements } from '../../../services/mockData';

export const WebDashboardPage = () => {
  const [news] = useState(mockNews);
  const [announcements] = useState(mockAnnouncements);
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [stats, setStats] = useState<ContactFormStats | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showRespondContactModal, setShowRespondContactModal] = useState(false);
  const [contactToRespond, setContactToRespond] = useState<ContactForm | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingContacts(true);
      setIsLoadingStats(true);

      try {
        const [{ forms }, statsData] = await Promise.all([
          getContactForms('pending'),
          getContactFormStats(),
        ]);

        setContacts(forms);
        setStats(statsData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoadingContacts(false);
        setIsLoadingStats(false);
      }
    };

    loadData();
  }, []);

  const publishedNews = news.filter(n => n.status === 'published').length;
  const activeAnnouncements = announcements.filter(a => a.status === 'active').length;
  const pendingContacts = stats?.pending || 0;

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
      case 'urgent': return 'bg-danger/20 text-red-700';
      case 'high': return 'bg-orange-900/20 text-orange-700';
      case 'medium': return 'bg-warning/20 text-yellow-700';
      case 'low': return 'bg-primary-900/20 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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

  const handleRespondContact = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleSaveContactResponse = async (
    contactId: number,
    response: string,
    status: 'pending' | 'in_progress' | 'resolved' | 'spam',
    assignedTo: number | null
  ) => {
    try {
      await respondContactForm(contactId, response, status);
      const { forms } = await getContactForms('pending');
      setContacts(forms);
      setShowRespondContactModal(false);
      setContactToRespond(null);
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      alert('Error al guardar la respuesta. Por favor, intenta nuevamente.');
    }
  };

  return (
    <>
      <WebDashboardStats
        publishedNews={publishedNews}
        activeAlerts={0}
        activeAnnouncements={activeAnnouncements}
        pendingContacts={pendingContacts}
        totalFAQs={0}
        contactStats={stats}
        isLoading={isLoadingStats}
      />

      <PendingContactsSection
        contacts={contacts}
        formatDateTime={formatDateTime}
        getPriorityColor={getPriorityColor}
        onRespond={handleRespondContact}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentNewsSection news={news} getStatusColor={getStatusColor} />
        <ActiveAnnouncementsSection announcements={announcements} />
      </div>

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
    </>
  );
};
