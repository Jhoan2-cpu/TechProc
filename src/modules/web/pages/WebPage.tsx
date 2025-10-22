import { useLocation } from 'react-router-dom';
import { WebDashboardPage } from './WebDashboardPage';
import { NewsPage } from './NewsPage';
import { AlertsPage } from './AlertsPage';
import { AnnouncementsPage } from './AnnouncementsPage';
import { ContactsPage } from './ContactsPage';
import { ChatbotPage } from './ChatbotPage';

type WebTab = 'dashboard' | 'news' | 'alerts' | 'announcements' | 'contacts' | 'chatbot';

export const WebPage = () => {
  const location = useLocation();

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

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && <WebDashboardPage />}
      {activeTab === 'news' && <NewsPage />}
      {activeTab === 'alerts' && <AlertsPage />}
      {activeTab === 'announcements' && <AnnouncementsPage />}
      {activeTab === 'contacts' && <ContactsPage />}
      {activeTab === 'chatbot' && <ChatbotPage />}
    </div>
  );
};