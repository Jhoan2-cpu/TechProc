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
            <h4 className="font-bold text-white mb-2">{news.title}</h4>
            <p className="text-sm text-gray-400 mb-2">{news.summary}</p>
            <div className="flex items-center gap-4 text-xs text-gray-300">
              <span>Categoría: {news.category}</span>
              <span>Vistas: {news.views}</span>
              <span className="px-2 py-1 rounded bg-primary-900/20 text-blue-700">{news.status}</span>
            </div>
          </div>

          <div className="bg-danger/20 border-l-4 border-red-400 p-4">
            <p className="text-sm text-danger font-semibold">
              Esta noticia será eliminada permanentemente del sistema.
            </p>
          </div>
        </div>

        <div className="bg-secondary-600/50 p-6 flex gap-3 justify-end rounded-b-lg">
          <button
            onClick={onCancel}
            className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex items-center gap-2"
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
