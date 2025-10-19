import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFolder, faBook, faCalendar, faLink } from '@fortawesome/free-solid-svg-icons';
import type { Category } from '../types';

interface ViewCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewCategoryModal = ({ category, isOpen, onClose }: ViewCategoryModalProps) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faFolder} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-white">Detalles de la Categoría</h2>
                <p className="text-sm text-purple-100">{category.slug}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFolder} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Nombre:</span>
            <span className="text-white font-medium">{category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Cursos:</span>
            <span className="text-white font-medium">{category.courses_count}</span>
          </div>
          {category.image && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLink} className="text-purple-400" />
              <span className="text-gray-400 text-sm">Imagen:</span>
              <a href={category.image} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate">{category.image}</a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Creado:</span>
            <span className="text-white font-medium">{new Date(category.created_at).toLocaleString('es-ES')}</span>
          </div>
        </div>
        <div className="p-6 border-t border-secondary-200 flex justify-end">
          <button onClick={onClose} className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
