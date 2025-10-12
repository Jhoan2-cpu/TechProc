import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../types';
import { getRoleInfo } from '../utils/roleUtils';
import {
  UserStatsCard,
  UserFilters,
  UserTableRow,
  UserFormModal,
} from '../components';
import { usersService } from '../services';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Activar/Desactivar usuario
  const toggleUserStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const action = user.is_active ? 'desactivar' : 'activar';
      if (window.confirm(`¿Está seguro de ${action} a ${user.name}?`)) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
        );
      }
    }
  };

  // Crear usuario
  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: String(users.length + 1),
      username: userData.username || '',
      email: userData.email || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      name: `${userData.first_name} ${userData.last_name}`,
      role: userData.role || 'analista_datos',
      phone: userData.phone,
      department: userData.department,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setShowCreateModal(false);
  };

  // Editar usuario
  const handleEditUser = (userData: Partial<User>) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...userData,
                name: `${userData.first_name || u.first_name} ${userData.last_name || u.last_name}`,
              }
            : u
        )
      );
      setEditingUser(null);
    }
  };

  // Estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const inactiveUsers = users.filter((u) => !u.is_active).length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersService.getAll();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
//        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-heading font-bold text-gradient mb-6">Gestión de Usuarios</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <UserStatsCard
          title="Total Usuarios"
          value={totalUsers}
          icon={faUserCircle}
          color="text-primary-200"
          borderColor="border-primary-500/20"
          shadowColor="shadow-primary-500/10"
        />
        <UserStatsCard
          title="Activos"
          value={activeUsers}
          icon={faToggleOn}
          color="text-success"
          borderColor="border-success/20"
          shadowColor="shadow-success/10"
        />
        <UserStatsCard
          title="Inactivos"
          value={inactiveUsers}
          icon={faToggleOff}
          color="text-danger"
          borderColor="border-danger/20"
          shadowColor="shadow-danger/10"
        />
      </div>

      {/* Header con filtros */}
      <UserFilters
        searchTerm={searchTerm}
        filterRole={filterRole}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onRoleChange={setFilterRole}
        onStatusChange={setFilterStatus}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Tabla de usuarios */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-secondary-600 to-secondary-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-gray-500" />
                      <p className="text-gray-400 font-medium">No se encontraron usuarios</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      roleInfo={roleInfo}
                      onEdit={setEditingUser}
                      onToggleStatus={toggleUserStatus}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <UserFormModal
          title="Crear Nuevo Usuario"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateUser}
        />
      )}

      {/* Modal Editar Usuario */}
      {editingUser && (
        <UserFormModal
          title="Editar Usuario"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditUser}
        />
      )}
    </div>
  );
};
