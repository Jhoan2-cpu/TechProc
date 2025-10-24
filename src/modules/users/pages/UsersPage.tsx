import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../types';
import {
  UserStatsCard,
  UserFilters,
  UserTableRow,
  UserFormModal,
  ViewUserDetailsModal,
} from '../components';
import { usersService } from '../services';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const fullName = user.full_name?.toLowerCase() || '';
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.dni && user.dni.toLowerCase().includes(searchTerm.toLowerCase()));

    const primaryRole = user.role && user.role.length > 0 ? user.role[0] : '';
    const matchesRole = filterRole === 'all' || primaryRole === filterRole;

    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Auto-ocultar mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Recargar usuarios desde API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      if (err instanceof Error) {
        setError(err.message || 'Error al cargar los usuarios. Por favor, intenta nuevamente.');
      } else {
        setError('Error al cargar los usuarios. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Crear/Editar usuario
  const handleSaveUser = () => {
    fetchUsers(); // Recargar lista
    setShowCreateModal(false);
    setEditingUser(null);
    setSuccessMessage('Usuario guardado exitosamente');
  };

  // Estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mostrar animación de carga
  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-heading font-bold text-gradient mb-6">Gestión de Usuarios</h1>

        <div className="flex flex-col items-center justify-center py-20">
          {/* Spinner animado */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-secondary-600 border-t-primary-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-primary-500 animate-pulse" />
            </div>
          </div>

          {/* Texto de carga */}
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-white mb-2">Cargando usuarios...</p>
            <p className="text-sm text-gray-400">Por favor espere un momento</p>
          </div>

          {/* Barras de skeleton animadas */}
          <div className="mt-8 w-full max-w-2xl space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gradient-to-r from-secondary-600 via-secondary-500 to-secondary-600 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                    onViewDetails={setViewingUser}
                  />
                ))
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
          onSave={handleSaveUser}
        />
      )}

      {/* Modal Editar Usuario */}
      {editingUser && (
        <UserFormModal
          title="Editar Usuario"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal Ver Detalles */}
      {viewingUser && (
        <ViewUserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
};
