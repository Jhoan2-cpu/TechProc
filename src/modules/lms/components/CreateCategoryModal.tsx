import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CreateCategoryData, Category } from '../types';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCategoryData) => Promise<void>;
  categoryToEdit?: Category | null;
}

export const CreateCategoryModal = ({ isOpen, onClose, onSave, categoryToEdit }: CreateCategoryModalProps) => {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    slug: '',
    image: '',
    category_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        image: categoryToEdit.image,
        category_id: categoryToEdit.category_id,
      });
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', slug: '', image: '', category_id: null });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-white">{categoryToEdit ? 'Editar' : 'Crear'} Categoría</h2>
            <button onClick={handleClose} disabled={loading} className="text-white hover:bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4"><p className="text-red-400 text-sm">{error}</p></div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="Ej: Desarrollo Web" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
            <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="input" placeholder="Ej: desarrollo-web" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL de Imagen *</label>
            <input type="url" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input" placeholder="https://example.com/image.jpg" disabled={loading} />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button type="button" onClick={handleClose} disabled={loading} className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300">Cancelar</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando...' : categoryToEdit ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
