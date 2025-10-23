import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';
import { SoftwareCard, SoftwareDetailsModal, SoftwareFormModal, DeleteSoftwareModal } from '../components';
import { SoftwareServices } from '../services/software.service';

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
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [softwares, setSoftwares]= useState<Software[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fetchSoftwares = async() => {
    try{
      setLoading(true);
      setError(null);
      const res = await SoftwareServices.getAll();
      setSoftwares(res);
      setSuccessMessage("Softwares cargados con éxtio");
    } catch(error){
      console.error('Error al cargar los softwares:', error);
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchSoftwares();
    }, []);


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
            {loading && <div className="text-sm">Cargando... </div>}
            {successMessage && <div className="text-sm text-green-400">{successMessage}</div>}
            {/* Lista de licencias */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {softwares.length > 0 ? (
                softwares.map((software:Software, index: number) => (
                  <SoftwareCard
                    key={software.id_software}
                    software={software}
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
