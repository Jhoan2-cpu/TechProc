import { useState } from 'react';
import type { License } from '../types';
import { LicenseCard, LicenseDetailsModal, LicenseFormModal, DeleteLicenseModal, LicensesStats, LicensesHeader } from '../components';

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

  // Estadísticas
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;

  // Licencias por vencer en los próximos 30 días
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringLicenses = licenses.filter(l => {
    if (!l.expiration_date) return false;
    const expirationDate = new Date(l.expiration_date);
    return expirationDate > today && expirationDate <= thirtyDaysFromNow && l.status === 'active';
  }).length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <LicensesStats
        totalLicenses={licenses.length}
        activeLicenses={activeLicenses}
        expiredLicenses={expiredLicenses}
        expiringLicenses={expiringLicenses}
      />

      {/* Header */}
      <LicensesHeader onNewLicense={handleNewLicense} />

      {/* Lista de licencias */}
      <div className="grid grid-cols-1 gap-4">
        {licenses.length > 0 ? (
          licenses.map((license, index) => (
            <LicenseCard
              key={license.id_license}
              license={license}
              formatDate={formatDate}
              index={index}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">No hay licencias registradas</p>
            <p className="text-sm text-gray-400 mt-2">
              Comienza agregando una nueva licencia usando el botón "Nueva Licencia"
            </p>
          </div>
        )}
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
