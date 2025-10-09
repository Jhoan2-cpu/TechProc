import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';
import { SoftwareCard, SoftwareDetailsModal, SoftwareFormModal, DeleteSoftwareModal } from '../components';

interface SoftwarePageProps {
  software: Software[];
  onUpdateSoftware: (software: Software[]) => void;
}

export const SoftwarePage = ({ software, onUpdateSoftware }: SoftwarePageProps) => {
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [softwareToEdit, setSoftwareToEdit] = useState<Software | null>(null);
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(null);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDetails = (soft: Software) => {
    setSelectedSoftware(soft);
    setShowDetailsModal(true);
  };

  const handleEdit = (soft: Software) => {
    setSoftwareToEdit(soft);
    setShowFormModal(true);
  };

  const handleDelete = (soft: Software) => {
    setSoftwareToDelete(soft);
    setShowDeleteModal(true);
  };

  const handleNewSoftware = () => {
    setSoftwareToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveSoftware = (softwareData: Partial<Software>) => {
    if (softwareToEdit) {
      // Editar software existente
      const updatedSoftware = software.map(soft =>
        soft.id_software === softwareToEdit.id_software
          ? { ...soft, ...softwareData }
          : soft
      );
      onUpdateSoftware(updatedSoftware);
    } else {
      // Crear nuevo software
      const newSoftware: Software = {
        id_software: Date.now(),
        ...softwareData as Omit<Software, 'id_software'>,
      };
      onUpdateSoftware([newSoftware, ...software]);
    }
    setShowFormModal(false);
    setSoftwareToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (softwareToDelete) {
      const updatedSoftware = software.filter(
        soft => soft.id_software !== softwareToDelete.id_software
      );
      onUpdateSoftware(updatedSoftware);
      setShowDeleteModal(false);
      setSoftwareToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Software</h2>
        <button
          onClick={handleNewSoftware}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Registrar Software
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {software.map((soft, index) => (
          <SoftwareCard
            key={soft.id_software}
            software={soft}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modales */}
      <SoftwareDetailsModal
        isOpen={showDetailsModal}
        software={selectedSoftware}
        onClose={() => setShowDetailsModal(false)}
        formatDate={formatDate}
      />

      <SoftwareFormModal
        isOpen={showFormModal}
        software={softwareToEdit}
        onSave={handleSaveSoftware}
        onCancel={() => {
          setShowFormModal(false);
          setSoftwareToEdit(null);
        }}
      />

      <DeleteSoftwareModal
        isOpen={showDeleteModal}
        software={softwareToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSoftwareToDelete(null);
        }}
      />
    </div>
  );
};
