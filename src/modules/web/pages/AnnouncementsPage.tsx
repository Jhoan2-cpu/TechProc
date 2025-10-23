import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Announcement, AnnouncementStatus } from '../types';
import { AnnouncementCard, AnnouncementFormModal, DeleteAnnouncementModal } from '../components';
import { announcementsService } from '../services/webService';

// Tipos de display predefinidos
const DISPLAY_TYPES = ['banner', 'modal', 'popup', 'notification'] as const;

// Estados predefinidos
const ANNOUNCEMENT_STATUSES: AnnouncementStatus[] = ['draft', 'published', 'archived'];

// Páginas objetivo comunes
const TARGET_PAGES = [
  'home',
  'news',
  'events', 
  'academic',
  'admissions',
  'research',
  'about',
  'contact'
];

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnnouncementFormModal, setShowAnnouncementFormModal] = useState(false);
  const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    status: '' as AnnouncementStatus | '',
    display_type: '' as string,
    target_page: '' as string,
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [filters.status, filters.display_type, filters.target_page]); // Solo se ejecuta cuando cambian estos filtros automáticos

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preparar filtros para la API - INCLUIR search aquí
      const apiFilters: any = {};
      if (filters.status) apiFilters.status = filters.status;
      if (filters.display_type) apiFilters.display_type = filters.display_type;
      if (filters.target_page) apiFilters.target_page = filters.target_page;
      if (filters.search) apiFilters.search = filters.search;

      const { announcements: announcementsData } = await announcementsService.getAll(apiFilters);
      setAnnouncements(announcementsData);
    } catch (err: any) {
      console.error('Error al cargar anuncios:', err);
      setError(err.message || 'Error al cargar los anuncios');
    } finally {
      setLoading(false);
    }
  };

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
        return 'bg-gray-100 text-gray-700';
      case 'archived':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

  const getDisplayTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-purple-900/20 text-purple-700 border-purple-300';
      case 'modal': return 'bg-blue-900/20 text-blue-700 border-blue-300';
      case 'popup': return 'bg-pink-900/20 text-pink-700 border-pink-300';
      case 'notification': return 'bg-yellow-900/20 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: AnnouncementStatus) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Borrador';
      case 'archived': return 'Archivado';
      default: return status;
    }
  };

  const getDisplayTypeLabel = (type: string) => {
    switch (type) {
      case 'banner': return 'Banner';
      case 'modal': return 'Modal';
      case 'popup': return 'Popup';
      case 'notification': return 'Notificación';
      default: return type;
    }
  };

  const getTargetPageLabel = (page: string) => {
    switch (page) {
      case 'home': return 'Inicio';
      case 'news': return 'Noticias';
      case 'events': return 'Eventos';
      case 'academic': return 'Académico';
      case 'admissions': return 'Admisiones';
      case 'research': return 'Investigación';
      case 'about': return 'Nosotros';
      case 'contact': return 'Contacto';
      default: return page.charAt(0).toUpperCase() + page.slice(1);
    }
  };

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

  const handleToggleAnnouncementStatus = async (announcement: Announcement) => {
    try {
      const newStatus: AnnouncementStatus = announcement.status === 'published' ? 'draft' : 'published';
      await announcementsService.update(announcement.id, { status: newStatus });
      await fetchAnnouncements();
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
      alert('Error: ' + (err.message || 'No se pudo cambiar el estado'));
    }
  };

  const handleSaveAnnouncement = async (announcementData: Partial<Announcement>) => {
    try {
      if (announcementToEdit) {
        await announcementsService.update(announcementToEdit.id, announcementData);
      } else {
        await announcementsService.create(announcementData);
      }
      
      setShowAnnouncementFormModal(false);
      setAnnouncementToEdit(null);
      await fetchAnnouncements();
    } catch (error: any) {
      throw error;
    }
  };

  const handleConfirmDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        await announcementsService.delete(announcementToDelete.id);
        setShowDeleteAnnouncementModal(false);
        setAnnouncementToDelete(null);
        await fetchAnnouncements();
      } catch (err: any) {
        console.error('Error al eliminar anuncio:', err);
        alert('Error: ' + (err.message || 'No se pudo eliminar el anuncio'));
      }
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      display_type: '',
      target_page: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.status || filters.display_type || filters.target_page || filters.search;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando anuncios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Anuncios</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn flex items-center gap-2 ${
              showFilters || hasActiveFilters 
                ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                : 'bg-secondary-200 hover:bg-secondary-300 text-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button
            onClick={handleNewAnnouncement}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Anuncio
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card p-6 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-bold text-white">Filtros</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn bg-gray-500 hover:bg-gray-600 text-white text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Filtro por estado (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value as AnnouncementStatus)}
                className="input w-full"
              >
                <option value="">Todos los estados</option>
                {ANNOUNCEMENT_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por tipo de display (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Display
              </label>
              <select
                value={filters.display_type}
                onChange={(e) => handleFilterChange('display_type', e.target.value)}
                className="input w-full"
              >
                <option value="">Todos los tipos</option>
                {DISPLAY_TYPES.map(type => (
                  <option key={type} value={type}>
                    {getDisplayTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por página objetivo (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Página Objetivo
              </label>
              <select
                value={filters.target_page}
                onChange={(e) => handleFilterChange('target_page', e.target.value)}
                className="input w-full"
              >
                <option value="">Todas las páginas</option>
                {TARGET_PAGES.map(page => (
                  <option key={page} value={page}>
                    {getTargetPageLabel(page)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {announcements.length} anuncio{announcements.length !== 1 ? 's' : ''} encontrado{announcements.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' con filtros aplicados'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-400">
              {hasActiveFilters 
                ? 'No hay anuncios que coincidan con los filtros aplicados.' 
                : 'No hay anuncios para mostrar.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn bg-primary-600 hover:bg-primary-700 text-white mt-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              index={index}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getDisplayTypeColor={getDisplayTypeColor}
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onToggleStatus={handleToggleAnnouncementStatus}
            />
          ))
        )}
      </div>

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
};