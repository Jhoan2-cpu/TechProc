import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Storage } from '../types';
import { StorageCard, StorageDetailsModal, StorageFormModal, DeleteStorageModal } from '../components';

interface StoragePageProps {
  storage: Storage[];
  onUpdateStorage: (storage: Storage[]) => void;
}

export const StoragePage = ({ storage, onUpdateStorage }: StoragePageProps) => {
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storageToEdit, setStorageToEdit] = useState<Storage | null>(null);
  const [storageToDelete, setStorageToDelete] = useState<Storage | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDetails = (store: Storage) => {
    setSelectedStorage(store);
    setShowDetailsModal(true);
  };

  const handleEdit = (store: Storage) => {
    setStorageToEdit(store);
    setShowFormModal(true);
  };

  const handleDelete = (store: Storage) => {
    setStorageToDelete(store);
    setShowDeleteModal(true);
  };

  const handleNewStorage = () => {
    setStorageToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveStorage = (storageData: Partial<Storage>) => {
    if (storageToEdit) {
      // Editar almacenamiento existente
      const updatedStorage = storage.map(store =>
        store.id_storage === storageToEdit.id_storage
          ? { ...store, ...storageData }
          : store
      );
      onUpdateStorage(updatedStorage);
    } else {
      // Crear nuevo almacenamiento
      const newStorage: Storage = {
        id_storage: Date.now(),
        ...storageData as Omit<Storage, 'id_storage'>,
      };
      onUpdateStorage([newStorage, ...storage]);
    }
    setShowFormModal(false);
    setStorageToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (storageToDelete) {
      const updatedStorage = storage.filter(
        store => store.id_storage !== storageToDelete.id_storage
      );
      onUpdateStorage(updatedStorage);
      setShowDeleteModal(false);
      setStorageToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Almacenamiento</h2>
        <button
          onClick={handleNewStorage}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Almacenamiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storage.map((store, index) => (
          <StorageCard
            key={store.id_storage}
            storage={store}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modales */}
      <StorageDetailsModal
        isOpen={showDetailsModal}
        storage={selectedStorage}
        onClose={() => setShowDetailsModal(false)}
        formatDate={formatDate}
      />

      <StorageFormModal
        isOpen={showFormModal}
        storage={storageToEdit}
        onSave={handleSaveStorage}
        onCancel={() => {
          setShowFormModal(false);
          setStorageToEdit(null);
        }}
      />

      <DeleteStorageModal
        isOpen={showDeleteModal}
        storage={storageToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setStorageToDelete(null);
        }}
      />
    </div>
  );
};
