import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Announcement, AnnouncementStatus } from '../types';
import { AnnouncementCard, AnnouncementFormModal, DeleteAnnouncementModal } from '../components';
import { mockAnnouncements } from '../../../services/mockData';

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showAnnouncementFormModal, setShowAnnouncementFormModal] = useState(false);
  const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'scheduled':
        return 'bg-primary-900/20 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  return (
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
