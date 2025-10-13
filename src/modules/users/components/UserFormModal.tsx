import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { User, UserRole, UserFormModalProps, CreateUserData, UpdateUserData } from '../types';
import { usersService } from '../services';

export const UserFormModal = ({ title, user, onClose, onSave }: UserFormModalProps) => {
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: '',
    phone_number: user?.phone || '',
    role: user?.role || ('analista_datos' as UserRole),
    status: user?.is_active ? 'active' : 'inactive',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validaciones
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    if (!isEditing && !formData.password.trim()) {
      setError('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      if (isEditing && user) {
        // Actualizar usuario existente
        const updateData: UpdateUserData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number || undefined,
          status: formData.status,
          role: formData.role,
        };

        const updatedUser = await usersService.update(user.id, updateData);
        onSave(updatedUser);
        onClose();
      } else {
        // Crear nuevo usuario
        const createData: CreateUserData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number || undefined,
          role: formData.role,
          status: formData.status,
        };

        const newUser = await usersService.create(createData);
        onSave(newUser);
        onClose();
      }
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setError(err.message || 'Error al guardar el usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-500/30 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-secondary-600 to-secondary-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-gradient">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg animate-slide-down">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
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
                disabled={loading}
              />
            </div>

            {/* Apellido */}
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
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="usuario@techproc.com"
                disabled={loading || isEditing}
              />
              {isEditing && (
                <p className="text-xs text-gray-400 mt-1">El email no se puede modificar</p>
              )}
            </div>

            {/* Contraseña (solo para nuevo usuario) */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  required={!isEditing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  disabled={loading}
                />
              </div>
            )}

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="+51 987 654 321"
                disabled={loading}
              />
            </div>

            {/* Rol */}
            <div className={isEditing ? '' : 'md:col-span-2'}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Rol <span className="text-danger">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                <option value="administrador" className="bg-secondary-700">
                  Administrador (Acceso Total)
                </option>
                <option value="gestor_lms" className="bg-secondary-700">
                  Gestor LMS
                </option>
                <option value="soporte_tecnico" className="bg-secondary-700">
                  Soporte Técnico
                </option>
                <option value="soporte_seguridad" className="bg-secondary-700">
                  Soporte - Seguridad
                </option>
                <option value="soporte_infraestructura" className="bg-secondary-700">
                  Soporte - Infraestructura
                </option>
                <option value="developer_web" className="bg-secondary-700">
                  Developer Web
                </option>
                <option value="analista_datos" className="bg-secondary-700">
                  Analista de Datos
                </option>
              </select>
            </div>

            {/* Estado (solo para edición) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Estado <span className="text-danger">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                  disabled={loading}
                >
                  <option value="active" className="bg-secondary-700">
                    Activo
                  </option>
                  <option value="inactive" className="bg-secondary-700">
                    Inactivo
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  {user ? 'Guardar Cambios' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
