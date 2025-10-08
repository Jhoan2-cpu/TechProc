import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { License } from '../types';
import { LicenseCard, LicenseDetailsModal, LicenseFormModal, DeleteLicenseModal } from '../components';

interface LicensesPageProps {
  licenses: License[];
  onUpdateLicenses: (licenses: License[]) => void;
}

export const LicensesPage = ({ licenses, onUpdateLicenses }: LicensesPageProps) => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [licenseToEdit, setLicenseToEdit] = useState<License | null>(null);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDetails = (license: License) => {
    setSelectedLicense(license);
    setShowDetailsModal(true);
  };

  const handleEdit = (license: License) => {
    setLicenseToEdit(license);
    setShowFormModal(true);
  };

  const handleDelete = (license: License) => {
    setLicenseToDelete(license);
    setShowDeleteModal(true);
  };

  const handleNewLicense = () => {
    setLicenseToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveLicense = (licenseData: Partial<License>) => {
    if (licenseToEdit) {
      // Editar licencia existente
      const updatedLicenses = licenses.map(license =>
        license.id_license === licenseToEdit.id_license
          ? { ...license, ...licenseData }
          : license
      );
      onUpdateLicenses(updatedLicenses);
    } else {
      // Crear nueva licencia
      const newLicense: License = {
        id_license: Date.now(),
        ...licenseData as Omit<License, 'id_license'>,
        responsible_id: 1,
      };
      onUpdateLicenses([newLicense, ...licenses]);
    }
    setShowFormModal(false);
    setLicenseToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (licenseToDelete) {
      const updatedLicenses = licenses.filter(
        license => license.id_license !== licenseToDelete.id_license
      );
      onUpdateLicenses(updatedLicenses);
      setShowDeleteModal(false);
      setLicenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Licencias</h2>
        <button
          onClick={handleNewLicense}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nueva Licencia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {licenses.map((license, index) => (
          <LicenseCard
            key={license.id_license}
            license={license}
            formatDate={formatDate}
            index={index}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modales */}
      <LicenseDetailsModal
        isOpen={showDetailsModal}
        license={selectedLicense}
        onClose={() => setShowDetailsModal(false)}
        formatDate={formatDate}
      />

      <LicenseFormModal
        isOpen={showFormModal}
        license={licenseToEdit}
        onSave={handleSaveLicense}
        onCancel={() => {
          setShowFormModal(false);
          setLicenseToEdit(null);
        }}
      />

      <DeleteLicenseModal
        isOpen={showDeleteModal}
        license={licenseToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setLicenseToDelete(null);
        }}
      />
    </div>
  );
};
