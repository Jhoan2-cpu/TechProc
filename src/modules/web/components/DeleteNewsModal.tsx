import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { News } from '../types';

interface DeleteNewsModalProps {
  isOpen: boolean;
  news: News | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteNewsModal = ({ isOpen, news, onConfirm, onCancel }: DeleteNewsModalProps) => {
  if (!isOpen || !news) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Borrador';
      case 'archived': return 'Archivado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success/20 text-green-700';
      case 'draft': return 'bg-warning/20 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-primary-900/20 text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Eliminar Noticia</h3>
            <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar la siguiente noticia?
          </p>

          <div className="bg-secondary-600/50 rounded-lg p-4 border-2 border-secondary-200">
            <div className="flex items-start gap-3 mb-3">
              <h4 className="font-bold text-white flex-1">{news.title}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(news.status)}`}>
                {getStatusLabel(news.status)}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{news.summary}</p>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
              <div>
                <span className="text-gray-400">Categoría:</span>
                <span className="ml-1 font-medium">{news.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Vistas:</span>
                <span className="ml-1 font-medium">{news.views}</span>
              </div>
              <div>
                <span className="text-gray-400">Autor:</span>
                <span className="ml-1 font-medium">{news.author_name || 'Desconocido'}</span>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <span className="ml-1 font-mono font-medium">{news.id_news}</span>
              </div>
            </div>

            {news.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-secondary-200">
                {news.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
                {news.tags.length > 3 && (
                  <span className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">
                    +{news.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-danger/20 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-300 font-semibold">
              ⚠ Esta noticia será eliminada permanentemente del sistema.
            </p>
            {news.status === 'published' && (
              <p className="text-xs text-red-400 mt-2">
                Nota: Esta noticia está actualmente publicada y visible para los usuarios.
              </p>
            )}
          </div>
        </div>

        <div className="bg-secondary-600/50 p-6 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Eliminar Noticia
          </button>
        </div>
      </div>
    </div>
  );
};