import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { RegistrationRequest } from '../services';

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  registration: RegistrationRequest | null;
  onClose: () => void;
  onConfirm: (role: string) => void;
}

export const ApproveRegistrationModal = ({
  isOpen,
  registration,
  onClose,
  onConfirm,
}: ApproveRegistrationModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  if (!isOpen || !registration) return null;

  const handleConfirm = () => {
    if (!selectedRole) {
      alert('Por favor selecciona un rol');
      return;
    }
    onConfirm(selectedRole);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-md w-full border border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-white">Aprobar Solicitud</h2>
            <button
              onClick={onClose}
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
              Rol asignado <span className="text-danger">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Seleccionar rol...</option>
              <option value="admin">Administrador</option>
              <option value="lms">Gestor LMS</option>
              <option value="soporte">Soporte Técnico</option>
              <option value="seg">Soporte - Seguridad</option>
              <option value="infra">Soporte - Infraestructura</option>
              <option value="web">Developer Web</option>
              <option value="data">Analista de Datos</option>
            </select>
          </div>

          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              Al aprobar esta solicitud, el usuario podrá acceder al sistema con el rol
              seleccionado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-secondary-700/50 hover:bg-secondary-600/50 text-white rounded-lg border border-gray-700/50 transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faCheck} />
            Aprobar
          </button>
        </div>
      </div>
    </div>
  );
};
