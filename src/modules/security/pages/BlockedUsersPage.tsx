import { useState, useEffect } from 'react';
import { BlockedUserCard, BlockUserModal, UnblockUserModal, BlockedUsersStats, BlockedUsersFilters } from '../components';
import { blockedUsersService } from '../services';
import type { BlockedUser } from '../types';

export const BlockedUsersPage = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const data = await blockedUsersService.getAll();
        setBlockedUsers(data);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleBlockUser = (userId: number, userName: string, userEmail: string, reason: string) => {
    const now = new Date().toISOString();
    const newBlockedUser: BlockedUser = {
      id_blocked_user: blockedUsers.length + 1,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      reason: reason,
      block_date: now,
      blocked_by: 1,
      blocked_by_name: 'Admin Principal',
      active: true,
    };
    setBlockedUsers([newBlockedUser, ...blockedUsers]);
    setShowBlockModal(false);
  };

  const handleUnblockUser = (id: number) => {
    const user = blockedUsers.find(u => u.id_blocked_user === id);
    if (user) {
      setUserToUnblock({ id, name: user.user_name });
    }
  };

  const handleConfirmUnblock = () => {
    if (userToUnblock) {
      const now = new Date().toISOString();
      setBlockedUsers(blockedUsers.map(user =>
        user.id_blocked_user === userToUnblock.id
          ? { ...user, active: false, unblock_date: now }
          : user
      ));
      setUserToUnblock(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrar usuarios bloqueados por búsqueda
  const filteredUsers = blockedUsers.filter((user) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const activeBlocked = blockedUsers.filter(user => user.active).length;
  const today = new Date().toDateString();
  const unblockedToday = blockedUsers.filter(user =>
    !user.active && user.unblock_date && new Date(user.unblock_date).toDateString() === today
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando usuarios bloqueados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white mb-6">
        Blocked Users
      </h1>

      {/* Estadísticas */}
      <BlockedUsersStats
        totalBlocked={blockedUsers.length}
        activeBlocked={activeBlocked}
        unblockedToday={unblockedToday}
      />

      {/* Filtros */}
      <BlockedUsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBlockClick={() => setShowBlockModal(true)}
      />

      {/* Lista de usuarios bloqueados */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <BlockedUserCard
              key={user.id_blocked_user}
              blockedUser={user}
              formatDate={formatDate}
              onUnblock={handleUnblockUser}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">No se encontraron usuarios bloqueados</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm ? 'Intenta ajustar la búsqueda' : 'No hay usuarios bloqueados en este momento'}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <BlockUserModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onBlock={handleBlockUser}
      />

      <UnblockUserModal
        isOpen={!!userToUnblock}
        userName={userToUnblock?.name || null}
        onConfirm={handleConfirmUnblock}
        onCancel={() => setUserToUnblock(null)}
      />
    </div>
  );
};
