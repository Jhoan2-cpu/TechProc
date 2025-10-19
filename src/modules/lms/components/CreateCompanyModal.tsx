import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Company, CreateCompanyData } from '../types';

interface CreateCompanyModalProps {
  isOpen: boolean;
  company?: Company | null;
  onClose: () => void;
  onSave: (data: CreateCompanyData) => Promise<void>;
}

export const CreateCompanyModal = ({
  isOpen,
  company,
  onClose,
  onSave,
}: CreateCompanyModalProps) => {
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    industry: '',
    contact_name: '',
    contact_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isEditMode = !!company;

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry,
        contact_name: company.contact_name,
        contact_email: company.contact_email,
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        contact_name: '',
        contact_email: '',
      });
    }
    setError('');
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la compañía');
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      industry: '',
      contact_name: '',
      contact_email: '',
    });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            {isEditMode ? 'Editar Compañía' : 'Agregar Nueva Compañía'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre de la Compañía */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la Compañía *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Tech Solutions S.A."
              />
            </div>

            {/* Industria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industria *
              </label>
              <input
                type="text"
                name="industry"
                required
                value={formData.industry}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Tecnología"
              />
            </div>

            {/* Nombre de Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Contacto *
              </label>
              <input
                type="text"
                name="contact_name"
                required
                value={formData.contact_name}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            {/* Email de Contacto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email de Contacto *
              </label>
              <input
                type="email"
                name="contact_email"
                required
                value={formData.contact_email}
                onChange={handleChange}
                className="input"
                placeholder="contacto@empresa.com"
              />
            </div>
          </div>

          {!isEditMode && (
            <div className="bg-primary-900/20 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> La compañía se agregará al sistema y podrá ser asignada a estudiantes.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </span>
              ) : (
                isEditMode ? 'Actualizar Compañía' : 'Crear Compañía'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
