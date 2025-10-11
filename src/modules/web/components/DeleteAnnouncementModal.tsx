import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Announcement } from '../types';

interface DeleteAnnouncementModalProps {
  isOpen: boolean;
  announcement: Announcement | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteAnnouncementModal = ({ isOpen, announcement, onConfirm, onCancel }: DeleteAnnouncementModalProps) => {
  if (!isOpen || !announcement) return null;

  const ctr = announcement.views > 0 ? ((announcement.clicks / announcement.views) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-red-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Eliminar Anuncio</h3>
            <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar el siguiente anuncio?
          </p>

          <div className="bg-secondary-600/50 rounded-lg p-4 border-2 border-secondary-200">
            <h4 className="font-bold text-white mb-2">{announcement.title}</h4>
            <p className="text-sm text-gray-400 mb-3">{announcement.content}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-300">Tipo:</span>
                <span className="ml-2 px-2 py-1 rounded bg-purple-900/20 text-purple-700">
                  {announcement.display_type}
                </span>
              </div>
              <div>
                <span className="text-gray-300">Estado:</span>
                <span className="ml-2 px-2 py-1 rounded bg-success/20 text-green-700">
                  {announcement.status}
                </span>
              </div>
              <div className="text-gray-400">
                Vistas: <span className="font-bold">{announcement.views}</span>
              </div>
              <div className="text-gray-400">
                Clics: <span className="font-bold">{announcement.clicks}</span> ({ctr}% CTR)
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Nota:</span> Se perderán las estadísticas de este anuncio ({announcement.views} vistas y {announcement.clicks} clics).
            </p>
          </div>

          <div className="bg-danger/20 border-l-4 border-red-400 p-4">
            <p className="text-sm text-danger font-semibold">
              Este anuncio será eliminado permanentemente del sistema.
            </p>
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
            Eliminar Anuncio
          </button>
        </div>
      </div>
    </div>
  );
};
