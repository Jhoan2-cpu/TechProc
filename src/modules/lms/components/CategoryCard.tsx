import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faFolder,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryCard = ({
  category,
  index,
  onView,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <div
      className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faFolder} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-white">
              {category.name}
            </h3>
            <p className="text-xs text-gray-400">{category.slug}</p>
          </div>
        </div>
      </div>

      {/* Imagen */}
      {category.image && (
        <div className="mb-4 rounded-lg overflow-hidden h-32 bg-secondary-600">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen falla al cargar, mostrar un placeholder
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Información */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBook} className="text-gray-400 text-sm w-4" />
          <span className="text-sm text-gray-300">
            {category.courses_count} {category.courses_count === 1 ? 'curso' : 'cursos'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
        <span className="text-xs text-gray-400">
          Creado: {new Date(category.created_at).toLocaleDateString('es-ES')}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onView(category)}
            className="text-blue-600 hover:bg-primary-900/20 p-2 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="text-orange-600 hover:bg-orange-900/20 p-2 rounded-lg transition-colors"
            title="Editar"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="text-red-600 hover:bg-danger/20 p-2 rounded-lg transition-colors"
            title="Eliminar"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
