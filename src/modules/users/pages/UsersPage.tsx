import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEdit,
  faToggleOn,
  faToggleOff,
  faShieldHalved,
  faGraduationCap,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faFilter,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

// Tipos
interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  phone?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

// Datos mock
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@techproc.com',
    first_name: 'Super',
    last_name: 'Admin',
    name: 'Administrador',
    role: 'administrador',
    phone: '+52 555 000 0001',
    department: 'Administración',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'lms',
    email: 'lms@techproc.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    name: 'Gestor LMS',
    role: 'gestor_lms',
    phone: '+52 555 000 0002',
    department: 'Educación',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    last_login: '2024-03-14T15:20:00Z',
  },
  {
    id: '3',
    username: 'seg',
    email: 'security@techproc.com',
    first_name: 'María',
    last_name: 'González',
    name: 'Soporte Seguridad',
    role: 'soporte_seguridad',
    phone: '+52 555 000 0003',
    department: 'Seguridad',
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    last_login: '2024-03-13T09:45:00Z',
  },
  {
    id: '4',
    username: 'infra',
    email: 'infra@techproc.com',
    first_name: 'Carlos',
    last_name: 'Ruiz',
    name: 'Soporte Infraestructura',
    role: 'soporte_infraestructura',
    phone: '+52 555 000 0004',
    department: 'Infraestructura',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    last_login: '2024-03-15T08:15:00Z',
  },
  {
    id: '5',
    username: 'web',
    email: 'web@techproc.com',
    first_name: 'Ana',
    last_name: 'Torres',
    name: 'Developer Web',
    role: 'developer_web',
    phone: '+52 555 000 0005',
    department: 'Desarrollo',
    is_active: true,
    created_at: '2024-02-10T00:00:00Z',
    last_login: '2024-03-12T16:30:00Z',
  },
  {
    id: '6',
    username: 'data',
    email: 'data@techproc.com',
    first_name: 'Pedro',
    last_name: 'Sánchez',
    name: 'Analista de Datos',
    role: 'analista_datos',
    phone: '+52 555 000 0006',
    department: 'Analítica',
    is_active: false,
    created_at: '2024-02-15T00:00:00Z',
    last_login: '2024-03-01T12:00:00Z',
  },
];

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Información de roles
  const getRoleInfo = (role: string) => {
    const roles: Record<string, { label: string; icon: any; color: string }> = {
      administrador: { label: 'Administrador', icon: faShieldHalved, color: 'text-red-600' },
      gestor_lms: { label: 'Gestor LMS', icon: faGraduationCap, color: 'text-blue-600' },
      soporte_seguridad: { label: 'Soporte - Seguridad', icon: faLock, color: 'text-purple-600' },
      soporte_infraestructura: { label: 'Soporte - Infraestructura', icon: faServer, color: 'text-green-600' },
      developer_web: { label: 'Developer Web', icon: faGlobe, color: 'text-orange-600' },
      analista_datos: { label: 'Analista de Datos', icon: faChartLine, color: 'text-cyan-600' },
    };
    return roles[role] || { label: role, icon: faUserCircle, color: 'text-gray-600' };
  };

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

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-heading font-bold text-gradient mb-6">users/management</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 shadow-lg shadow-primary-500/10 hover:shadow-xl hover:shadow-primary-500/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Total Usuarios</p>
              <p className="text-4xl font-heading font-bold text-gradient">{totalUsers}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-primary-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-success/20 shadow-lg shadow-success/10 hover:shadow-xl hover:shadow-success/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Activos</p>
              <p className="text-4xl font-heading font-bold text-success">{activeUsers}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faToggleOn} className="text-3xl text-success" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-danger/20 shadow-lg shadow-danger/10 hover:shadow-xl hover:shadow-danger/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Inactivos</p>
              <p className="text-4xl font-heading font-bold text-danger">{inactiveUsers}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-danger/20 to-danger/30 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faToggleOff} className="text-3xl text-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Header con filtros */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/30 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400"
              />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-secondary-700/50 px-4 py-2 rounded-lg border border-gray-700/50">
              <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-secondary-700">Todos los roles</option>
                <option value="administrador" className="bg-secondary-700">Administrador</option>
                <option value="gestor_lms" className="bg-secondary-700">Gestor LMS</option>
                <option value="soporte_seguridad" className="bg-secondary-700">Soporte - Seguridad</option>
                <option value="soporte_infraestructura" className="bg-secondary-700">Soporte - Infraestructura</option>
                <option value="developer_web" className="bg-secondary-700">Developer Web</option>
                <option value="analista_datos" className="bg-secondary-700">Analista de Datos</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
            >
              <option value="all" className="bg-secondary-700">Todos los estados</option>
              <option value="active" className="bg-secondary-700">Activos</option>
              <option value="inactive" className="bg-secondary-700">Inactivos</option>
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faPlus} />
              Crear Usuario
            </button>
          </div>
        </div>
      </div>

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
            <tbody className="divide-y divide-gray-700/50">
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
                    <tr key={user.id} className="hover:bg-secondary-700/50 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                            <span className="text-primary-400 font-bold text-sm">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{user.name}</div>
                            <div className="text-xs text-gray-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                        {user.phone && <div className="text-xs text-gray-400">{user.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 bg-secondary-700/50 px-3 py-1.5 rounded-lg border border-gray-700/50 w-fit">
                          <FontAwesomeIcon icon={roleInfo.icon} className="text-primary-400" />
                          <span className="text-sm text-white font-medium">{roleInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.department || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                            user.is_active
                              ? 'bg-success/20 text-success border border-success/30'
                              : 'bg-danger/20 text-danger border border-danger/30'
                          }`}
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 bg-secondary-700/50 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
                            title="Editar usuario"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-2 rounded-lg border transition-all duration-300 hover:scale-110 ${
                              user.is_active
                                ? 'bg-danger/20 hover:bg-danger/30 text-danger border-danger/30 hover:border-danger/50'
                                : 'bg-success/20 hover:bg-success/30 text-success border-success/30 hover:border-success/50'
                            }`}
                            title={user.is_active ? 'Desactivar' : 'Activar'}
                          >
                            <FontAwesomeIcon icon={user.is_active ? faToggleOff : faToggleOn} />
                          </button>
                        </div>
                      </td>
                    </tr>
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

// Componente Modal para Crear/Editar Usuario
interface UserFormModalProps {
  title: string;
  user?: User;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}

const UserFormModal = ({ title, user, onClose, onSave }: UserFormModalProps) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    role: user?.role || 'analista_datos',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 animate-scale-in">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <h2 className="text-2xl font-heading font-bold text-gradient">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nombre <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Apellido <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Apellido"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Usuario <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="usuario123"
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="usuario@techproc.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="+52 555 000 0000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Ej: Desarrollo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Rol <span className="text-danger">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
              >
                <option value="administrador" className="bg-secondary-700">Administrador (Acceso Total)</option>
                <option value="gestor_lms" className="bg-secondary-700">Gestor LMS</option>
                <option value="soporte_seguridad" className="bg-secondary-700">Soporte - Seguridad</option>
                <option value="soporte_infraestructura" className="bg-secondary-700">Soporte - Infraestructura</option>
                <option value="developer_web" className="bg-secondary-700">Developer Web</option>
                <option value="analista_datos" className="bg-secondary-700">Analista de Datos</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium"
            >
              {user ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
