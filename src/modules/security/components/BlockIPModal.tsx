import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

interface BlockIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (ipAddress: string, reason: string) => void;
}

export const BlockIPModal = ({ isOpen, onClose, onBlock }: BlockIPModalProps) => {
  const [ipAddress, setIpAddress] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ipAddress.trim() && reason.trim()) {
      onBlock(ipAddress.trim(), reason.trim());
      setIpAddress('');
      setReason('');
    }
  };

  const handleClose = () => {
    setIpAddress('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faBan} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-secondary-900 mb-6">
            Bloquear Dirección IP
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Dirección IP *
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="Ej: 192.168.1.100"
                className="input w-full"
                required
                pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                title="Ingrese una dirección IP válida (Ej: 192.168.1.100)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Razón del Bloqueo *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe el motivo del bloqueo..."
                className="input w-full min-h-[100px] resize-none"
                required
              />
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Advertencia:</span> Esta IP será bloqueada inmediatamente y no podrá acceder al sistema.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                Bloquear IP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
