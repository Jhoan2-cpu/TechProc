import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { UserRole, UserFormModalProps, UpdateUserData, CreateUserData, Gender } from '../types';
import { usersService } from '../services';

export const UserFormModal = ({ title, user, onClose, onSave }: UserFormModalProps) => {
  const isEditing = !!user;
  const primaryRole = user?.role && user.role.length > 0 ? user.role[0] : 'student';

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    full_name: user?.full_name || '',
    dni: user?.dni || '',
    document: user?.document || '',
    email: user?.email || '',
    password: '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
    birth_date: user?.birth_date || '',
    gender: (user?.gender || 'other') as Gender,
    country: user?.country || 'Peru',
    country_location: user?.country_location || '',
    timezone: user?.timezone || 'America/Lima',
    profile_photo: user?.profile_photo || null,
    role: (primaryRole || 'student') as UserRole,
    status: user?.status || 'active',
    synchronized: user?.synchronized !== undefined ? user.synchronized : true,
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
          full_name: formData.full_name || `${formData.first_name} ${formData.last_name}`,
          phone_number: formData.phone_number || undefined,
          address: formData.address || undefined,
          birth_date: formData.birth_date || undefined,
          gender: formData.gender,
          country: formData.country || undefined,
          country_location: formData.country_location || undefined,
          timezone: formData.timezone || undefined,
          status: formData.status as any,
          role: formData.role,
        };

        await usersService.update(user.id, updateData);
        onClose();
        // Recargar usuarios
        onSave(user); // Trigger parent to reload
      } else {
        // Crear nuevo usuario
        const createData: CreateUserData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          full_name: formData.full_name || `${formData.first_name} ${formData.last_name}`,
          dni: formData.dni || undefined,
          document: formData.document || undefined,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number || undefined,
          address: formData.address || undefined,
          birth_date: formData.birth_date || undefined,
          gender: formData.gender,
          country: formData.country,
          country_location: formData.country_location || undefined,
          timezone: formData.timezone || 'America/Lima',
          profile_photo: formData.profile_photo,
          role: formData.role,
          status: formData.status as any,
          synchronized: formData.synchronized,
        };

        console.log('Datos enviados al API:', JSON.stringify(createData, null, 2));

        const response = await usersService.create(createData);

        if (response.success) {
          alert(`Usuario creado exitosamente. ID: ${response.data.id}`);
          onClose();
          // Trigger parent to reload
          onSave(user!);
        } else {
          setError(response.message || 'Error al crear el usuario');
        }
      }
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      console.error('Detalles del error:', err.details || err);

      // Mostrar detalles de validación si existen
      if (err.details) {
        if (Array.isArray(err.details)) {
          const errorMessages = err.details
            .map((detail: any) => `${detail.field}: ${detail.message}`)
            .join('\n');
          setError(`Error de validación:\n${errorMessages}`);
        } else if (typeof err.details === 'object') {
          const errorMessages = Object.entries(err.details)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              } else {
                return `${field}: ${messages}`;
              }
            })
            .join('\n');
          setError(`Error de validación:\n${errorMessages}`);
        } else {
          setError(err.message || 'Error al guardar el usuario. Por favor, intenta de nuevo.');
        }
      } else {
        setError(err.message || 'Error al guardar el usuario. Por favor, intenta de nuevo.');
      }
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

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Av. Principal 123, Lima"
                disabled={loading}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                disabled={loading}
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                <option value="male" className="bg-secondary-700">Masculino</option>
                <option value="female" className="bg-secondary-700">Femenino</option>
                <option value="other" className="bg-secondary-700">Otro</option>
              </select>
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">País</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Peru"
                disabled={loading}
              />
            </div>

            {/* Ciudad/Ubicación */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Ciudad</label>
              <input
                type="text"
                value={formData.country_location}
                onChange={(e) => setFormData({ ...formData, country_location: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                placeholder="Lima"
                disabled={loading}
              />
            </div>

            {/* Rol */}
            <div>
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
                <option value="admin" className="bg-secondary-700">Administrador</option>
                <option value="instructor" className="bg-secondary-700">Instructor</option>
                <option value="student" className="bg-secondary-700">Estudiante</option>
                <option value="lms" className="bg-secondary-700">Gestor LMS</option>
                <option value="seg" className="bg-secondary-700">Seguridad</option>
                <option value="infra" className="bg-secondary-700">Infraestructura</option>
                <option value="web" className="bg-secondary-700">Desarrollo Web</option>
                <option value="data" className="bg-secondary-700">Analista de Datos</option>
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
