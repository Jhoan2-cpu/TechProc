import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBan } from '@fortawesome/free-solid-svg-icons';
import type { RejectRegistrationModalProps } from '../types';

export const RejectRegistrationModal = ({
  isOpen,
  registration,
  onClose,
  onConfirm,
}: RejectRegistrationModalProps) => {
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !registration) return null;

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }
    onConfirm(rejectionReason);
    setRejectionReason('');
  };

  const handleClose = () => {
    setRejectionReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-md w-full border border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-white">Rechazar Solicitud</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-secondary-700/50 rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">Usuario:</strong>{' '}
              {registration.first_name} {registration.last_name}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-white">Email:</strong> {registration.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motivo del rechazo <span className="text-danger">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Información incompleta o no cumple con los requisitos..."
              rows={4}
              className="w-full px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
            />
          </div>

          <div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              El usuario será notificado del rechazo con el motivo que especifiques.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-secondary-700/50 hover:bg-secondary-600/50 text-white rounded-lg border border-gray-700/50 transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-danger hover:bg-danger/80 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faBan} />
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};
