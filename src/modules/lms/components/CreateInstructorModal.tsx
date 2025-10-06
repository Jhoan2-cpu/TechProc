import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Instructor } from '../types';

interface CreateInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructor: Omit<Instructor, 'id'>) => void;
}

export const CreateInstructorModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateInstructorModalProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    expertise_area: '',
    bio: '',
    country_location: '',
    status: 'activo' as const,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const newInstructor: Omit<Instructor, 'id'> = {
      ...formData,
      role: 'instructor' as const,
      email_verified_at: now,
      address: '',
      birth_date: '1980-01-01',
      gender: 'Otro' as const,
      profile_photo: null,
      state: 'activo',
      last_access_ip: null,
      last_access: null,
      created_at: now,
      updated_at: now,
    };

    onSave(newInstructor);

    // Resetear formulario
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      expertise_area: '',
      bio: '',
      country_location: '',
      status: 'activo',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      expertise_area: '',
      bio: '',
      country_location: '',
      status: 'activo',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Agregar Nuevo Instructor
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="input"
                placeholder="Nombre del instructor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                placeholder="Apellido del instructor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Área de Expertise *
              </label>
              <input
                type="text"
                name="expertise_area"
                required
                value={formData.expertise_area}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Desarrollo Web, IA, Diseño UX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                País *
              </label>
              <input
                type="text"
                name="country_location"
                required
                value={formData.country_location}
                onChange={handleChange}
                className="input"
                placeholder="País de residencia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estado *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Biografía *
              </label>
              <textarea
                name="bio"
                required
                value={formData.bio}
                onChange={handleChange}
                className="input min-h-[120px]"
                placeholder="Describe la experiencia, especialidades y logros del instructor..."
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-700">
              <strong>Nota:</strong> Se enviará un correo al instructor con las credenciales de acceso y los pasos para configurar su perfil.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-secondary-200 text-secondary-700 hover:bg-secondary-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Crear Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
