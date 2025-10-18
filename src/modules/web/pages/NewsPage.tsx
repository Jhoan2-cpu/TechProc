import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { News, NewsStatus } from '../types';
import { NewsCard, NewsFormModal, DeleteNewsModal } from '../components';
import { mockNews } from '../../../services/mockData';

export const NewsPage = () => {
  const [news, setNews] = useState(mockNews);
  const [showNewsFormModal, setShowNewsFormModal] = useState(false);
  const [showDeleteNewsModal, setShowDeleteNewsModal] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/20 text-green-700';
      case 'draft':
        return 'bg-warning/20 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

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

  return (
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
};
