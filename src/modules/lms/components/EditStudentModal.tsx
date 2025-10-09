import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const EditStudentModal = ({
  student,
  isOpen,
  onClose,
  onSave,
}: EditStudentModalProps) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    first_name: '',
    last_name: '',
    email: '',
    country_location: '',
    state: 'activo',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        country_location: student.country_location,
        state: student.state,
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      ...formData,
    } as Student);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            Editar Estudiante
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
                placeholder="Nombre del estudiante"
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
                placeholder="Apellido del estudiante"
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
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="select"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
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
