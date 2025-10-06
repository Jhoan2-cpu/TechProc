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
    <div>
      <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">users/management</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Usuarios</p>
              <p className="text-3xl font-heading font-bold text-primary-900">{totalUsers}</p>
            </div>
            <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-primary-600 opacity-50" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Activos</p>
              <p className="text-3xl font-heading font-bold text-green-900">{activeUsers}</p>
            </div>
            <FontAwesomeIcon icon={faToggleOn} className="text-4xl text-green-600 opacity-50" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Inactivos</p>
              <p className="text-3xl font-heading font-bold text-red-900">{inactiveUsers}</p>
            </div>
            <FontAwesomeIcon icon={faToggleOff} className="text-4xl text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Header con filtros */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-secondary-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="select"
              >
                <option value="all">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="gestor_lms">Gestor LMS</option>
                <option value="soporte_seguridad">Soporte - Seguridad</option>
                <option value="soporte_infraestructura">Soporte - Infraestructura</option>
                <option value="developer_web">Developer Web</option>
                <option value="analista_datos">Analista de Datos</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faPlus} />
              Crear Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-secondary-600">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                            <div className="text-sm text-secondary-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">{user.email}</div>
                        {user.phone && <div className="text-sm text-secondary-500">{user.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={roleInfo.icon} className={roleInfo.color} />
                          <span className="text-sm text-secondary-900">{roleInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">{user.department || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="btn btn-sm btn-outline"
                            title="Editar usuario"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`btn btn-sm ${
                              user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-2xl font-heading font-bold text-secondary-900">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="input w-full"
                placeholder="Nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Apellido <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="input w-full"
                placeholder="Apellido"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Usuario <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input w-full"
                placeholder="usuario123"
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input w-full"
                placeholder="usuario@techproc.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input w-full"
                placeholder="+52 555 000 0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input w-full"
                placeholder="Ej: Desarrollo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Rol <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="select w-full"
              >
                <option value="administrador">Administrador (Acceso Total)</option>
                <option value="gestor_lms">Gestor LMS</option>
                <option value="soporte_seguridad">Soporte - Seguridad</option>
                <option value="soporte_infraestructura">Soporte - Infraestructura</option>
                <option value="developer_web">Developer Web</option>
                <option value="analista_datos">Analista de Datos</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
