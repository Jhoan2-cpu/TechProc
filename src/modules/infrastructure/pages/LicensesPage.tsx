import {useEffect, useState } from 'react';
import type { License } from '../types';
import { LicenseCard, LicenseDetailsModal, LicenseFormModal, DeleteLicenseModal, LicensesStats, LicensesHeader } from '../components';
import { LicenseServices } from '../services/license.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

//interface LicensesPageProps {
  //licenses: License[];
  //onUpdateLicenses: (licenses: License[]) => void;
//}


export const LicensesPage = () => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [licenseToEdit, setLicenseToEdit] = useState<License | null>(null);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [licenses, setLicenses]= useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await LicenseServices.getAll();
      setLicenses(res);
    }catch (error){
      console.error('Error al cargar licencias: ', error);
    } finally {
      setLoading(false);
    }
  };

  // función helper

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };




  useEffect(() => {
    fetchLicenses();
  }, []);

  useEffect(() => {
    if(successMessage){
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if(error){
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  

  const handleSaveLicense = async(licenseData: Partial<License>) => {
    try{
        setError(null);
        setLoading(true);
      if (licenseToEdit) {
        // Editar licencia existente
        const updated = await LicenseServices.update(
          licenseToEdit.id,
          licenseData
        );
        setLicenses( prev =>
          prev.map(l => l.id === updated.id? updated : l));
          setSuccessMessage('Licencia actualizada correctamente');
      } else {
        // Crear nueva licencia
        const createdApi = await LicenseServices.create({
          software_name: licenseData.softwareName!,
          license_key: licenseData.licenseKey!,
          license_type: licenseData.licenseType!,
          provider: licenseData.provider!,
          purchase_date: licenseData.purchaseDate!,
          expiration_date: licenseData.expirationDate!,
          seats_total: licenseData.seatsTotal!,
          seats_used: licenseData.seatsUsed!,
          cost_annual: licenseData.costAnnual!,
          status: licenseData.status!,
          notes: licenseData.notes || '',
          responsible_id: 1, //modificar después
        });
        const created = createdApi;
        setLicenses(prev => [created, ...prev]);
        setSuccessMessage('Licencia creada correctamente');
      }
      //await fetchLicenses().then(() => {
        //setShowFormModal(false);
        //setLicenseToEdit(null);
        //setSuccessMessage(licenseToEdit ? 'Licencia actualizada correctamente': 'Licencia creada correctamente');
      //});
      setShowFormModal(false);
      setLicenseToEdit(null);
    } catch(err: unknown){
      console.error('Error al guardar licencia:', err);
    } finally {
      setLoading(false);
    }
    
  };

  const handleConfirmDelete = async () => { //falta codear;
    if (licenseToDelete) {
      await LicenseServices.delete(licenseToDelete.id);
      await fetchLicenses();
      setLicenses(licenses.filter(l => l.id !== licenseToDelete.id));
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
    if (!l.expirationDate) return false;
    const expirationDate = new Date(l.expirationDate);
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

      {loading && <div className="text-sm">Cargando... </div>}
      {successMessage && <div className="text-sm text-green-400">{successMessage}</div>}
      {/* Lista de licencias */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {licenses.length > 0 ? (
          licenses.map((license: License, index: number) => (
            <LicenseCard
              key={license.id}
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
