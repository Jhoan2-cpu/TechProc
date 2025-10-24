import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faLink, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import type { CreateClassMaterialData, MaterialType } from '../types';
import { classMaterialService } from '../services';

interface AddClassMaterialModalProps {
  classId: number;
  onClose: () => void;
  onSave: () => void;
}

export const AddClassMaterialModal = ({ classId, onClose, onSave }: AddClassMaterialModalProps) => {
  const [formData, setFormData] = useState<CreateClassMaterialData>({
    class_id: classId,
    material_url: '',
    type: 'PDF',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.material_url.trim()) {
      setError('La URL del material es requerida');
      return;
    }

    // Validar que sea una URL válida
    try {
      new URL(formData.material_url);
    } catch {
      setError('Por favor ingresa una URL válida');
      return;
    }

    try {
      setLoading(true);
      await classMaterialService.create(formData);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear el material');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateClassMaterialData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-2xl font-heading font-bold text-white">
            Agregar Material de Clase
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Tipo de Material */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-primary-400" />
                Tipo de Material *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as MaterialType)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white"
                required
              >
                <option value="PDF">PDF</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">Enlace</option>
                <option value="DOCUMENT">Documento</option>
                <option value="PRESENTATION">Presentación</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            {/* URL del Material */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faLink} className="mr-2 text-primary-400" />
                URL del Material *
              </label>
              <input
                type="url"
                value={formData.material_url}
                onChange={(e) => handleChange('material_url', e.target.value)}
                className="input w-full bg-secondary-500 border-secondary-400 text-white placeholder-gray-400"
                placeholder="https://drive.google.com/file/d/abc123xyz/view"
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Puedes agregar enlaces de Google Drive, Dropbox, YouTube, etc.
              </p>
            </div>

            {/* Ejemplos de URLs */}
            <div className="bg-secondary-500/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Ejemplos de URLs válidas:</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Google Drive: https://drive.google.com/file/d/...</li>
                <li>• YouTube: https://www.youtube.com/watch?v=...</li>
                <li>• Dropbox: https://www.dropbox.com/s/...</li>
                <li>• OneDrive: https://onedrive.live.com/...</li>
              </ul>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-600/50">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btn bg-primary-600 text-white hover:bg-primary-700"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Guardando...' : 'Guardar Material'}
          </button>
        </div>
      </div>
    </div>
  );
};
