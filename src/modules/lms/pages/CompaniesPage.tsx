import { useState, useEffect } from 'react';
import type { Company, CreateCompanyData, UpdateCompanyData } from '../types';
import {
  CompanyCard,
  CreateCompanyModal,
  ViewCompanyModal,
  CompanyFilters,
} from '../components';
import { companiesService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await companiesService.getAll();
      setCompanies(data.companies);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las compañías');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (companyData: CreateCompanyData) => {
    try {
      const newCompany = await companiesService.create(companyData);
      setCompanies([newCompany, ...companies]);
      setShowCreateModal(false);

      // Recargar la lista de compañías para obtener los datos actualizados
      fetchCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      throw error; // Re-lanzar el error para que el modal lo maneje
    }
  };

  const handleEditCompany = async (updatedData: CreateCompanyData) => {
    if (companyToEdit) {
      try {
        // Actualizar la compañía usando la API
        const updated = await companiesService.update(
          companyToEdit.id,
          updatedData as UpdateCompanyData
        );
        setCompanies(companies.map((c) => (c.id === companyToEdit.id ? updated : c)));
        setCompanyToEdit(null);

        // Recargar la lista de compañías para obtener los datos actualizados
        fetchCompanies();
      } catch (error) {
        console.error('Error updating company:', error);
        throw error; // Re-lanzar el error para que el modal lo maneje
      }
    }
  };

  const handleDeleteCompany = async () => {
    if (companyToDelete) {
      try {
        await companiesService.delete(companyToDelete.id);
        setCompanies(companies.filter((c) => c.id !== companyToDelete.id));
        setCompanyToDelete(null);

        // Recargar la lista de compañías para asegurar que esté actualizada
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact_email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando compañías...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-6">Compañías</h1>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchCompanies}
              className="btn bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Header con filtros */}
      <CompanyFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Grid de compañías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company, index) => (
          <CompanyCard
            key={company.id}
            company={company}
            index={index}
            onView={(company) => setSelectedCompany(company)}
            onEdit={(company) => setCompanyToEdit(company)}
            onDelete={(company) => setCompanyToDelete(company)}
          />
        ))}
      </div>

      {/* Mensaje si no hay compañías */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron compañías</p>
        </div>
      )}

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateCompanyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCompany}
        />
      )}

      {/* Modal de visualización */}
      {selectedCompany && (
        <ViewCompanyModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Modal de edición */}
      {companyToEdit && (
        <CreateCompanyModal
          isOpen={!!companyToEdit}
          company={companyToEdit}
          onClose={() => setCompanyToEdit(null)}
          onSave={handleEditCompany}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={!!companyToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar la compañía?"
        itemName={companyToDelete ? companyToDelete.name : ''}
        onConfirm={handleDeleteCompany}
        onCancel={() => setCompanyToDelete(null)}
      />
    </div>
  );
};
