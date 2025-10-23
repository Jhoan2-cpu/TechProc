import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Report } from '../types';

interface DeleteReportModalProps {
  isOpen: boolean;
  report: Report | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteReportModal = ({ isOpen, report, onConfirm, onCancel }: DeleteReportModalProps) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-md w-full animate-slide-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                Eliminar Reporte
              </h3>
              <p className="text-sm text-gray-400">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              ¿Estás seguro de que quieres eliminar el reporte <strong>"{report.report_title}"</strong>?
            </p>
            <div className="mt-2 text-xs text-red-400 space-y-1">
              <p>• El archivo será eliminado permanentemente</p>
              <p>• Los datos del reporte se perderán</p>
              <p>• Esta acción no se puede deshacer</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="btn bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};