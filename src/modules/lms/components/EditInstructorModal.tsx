import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Instructor } from '../types';

interface EditInstructorModalProps {
  instructor: Instructor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructor: Instructor) => void;
}

export const EditInstructorModal = ({
  instructor,
  isOpen,
  onClose,
  onSave,
}: EditInstructorModalProps) => {
  const [formData, setFormData] = useState<Partial<Instructor>>({
    first_name: '',
    last_name: '',
    email: '',
    expertise_area: '',
    bio: '',
    country_location: '',
    status: 'activo',
  });

  useEffect(() => {
    if (instructor) {
      setFormData({
        first_name: instructor.first_name,
        last_name: instructor.last_name,
        email: instructor.email,
        expertise_area: instructor.expertise_area,
        bio: instructor.bio,
        country_location: instructor.country_location,
        status: instructor.status,
      });
    }
  }, [instructor]);

  if (!isOpen || !instructor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...instructor,
      ...formData,
    } as Instructor);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Editar Instructor
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Área de Expertise *
              </label>
              <input
                type="text"
                name="expertise_area"
                required
                value={formData.expertise_area}
                onChange={handleChange}
                className="input"
                placeholder="Ej: Desarrollo Web, IA, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía *
              </label>
              <textarea
                name="bio"
                required
                value={formData.bio}
                onChange={handleChange}
                className="input min-h-[120px]"
                placeholder="Biografía del instructor..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
