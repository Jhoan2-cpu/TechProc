import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

interface User {
  id_user: number;
  name: string;
  email: string;
}

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (userId: number, userName: string, userEmail: string, reason: string) => void;
}

export const BlockUserModal = ({ isOpen, onClose, onBlock }: BlockUserModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users - esto debería venir de un servicio real
  useEffect(() => {
    if (isOpen) {
      const mockUsers: User[] = [
        { id_user: 10, name: 'Pedro Ramírez', email: 'pedro.ramirez@example.com' },
        { id_user: 11, name: 'Ana Torres', email: 'ana.torres@example.com' },
        { id_user: 12, name: 'Luis Vargas', email: 'luis.vargas@example.com' },
        { id_user: 13, name: 'Carmen Flores', email: 'carmen.flores@example.com' },
        { id_user: 14, name: 'Diego Morales', email: 'diego.morales@example.com' },
      ];
      setUsers(mockUsers);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && reason.trim()) {
      const selectedUser = users.find(u => u.id_user === selectedUserId);
      if (selectedUser) {
        onBlock(selectedUserId, selectedUser.name, selectedUser.email, reason.trim());
        setSelectedUserId(null);
        setReason('');
        setSearchTerm('');
      }
    }
  };

  const handleClose = () => {
    setSelectedUserId(null);
    setReason('');
    setSearchTerm('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger/20 rounded-full mb-4">
            <FontAwesomeIcon icon={faUserSlash} className="text-red-600 text-xl" />
          </div>

          <h3 className="text-xl font-heading font-bold text-center text-white mb-6">
            Bloquear Usuario
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Usuario *
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="input w-full mb-2"
              />
              <select
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="input w-full"
                required
              >
                <option value="">Seleccionar usuario</option>
                {filteredUsers.map((user) => (
                  <option key={user.id_user} value={user.id_user}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                <span className="font-semibold">Advertencia:</span> Este usuario será bloqueado inmediatamente y no podrá acceder al sistema.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                Bloquear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
