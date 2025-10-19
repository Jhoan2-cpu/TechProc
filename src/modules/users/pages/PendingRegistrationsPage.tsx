import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faUserCheck, faUserTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { usersService, registrationRequestsService } from '../services';
import type { User } from '../types';
import {
  PendingRegistrationCard,
  PendingRegistrationStats,
  ApproveRegistrationModal,
  RejectRegistrationModal,
} from '../components';
import { getRoleInfo } from '../utils/roleUtils';

export const PendingRegistrationsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Cargar usuarios inactivos
  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll({ status: 'inactive' });
      // Filtrar solo los usuarios con status inactive
      const inactiveUsers = data.users.filter(user => !user.is_active);
      setUsers(inactiveUsers);
    } catch (error) {
      console.error('Error al cargar usuarios inactivos:', error);
      alert('Error al cargar los usuarios pendientes de activación');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleApproveClick = (user: User) => {
    setSelectedUser(user);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (user: User) => {
    setSelectedUser(user);
    setRejectModalOpen(true);
  };

  const handleApproveConfirm = async (role: string) => {
    if (!selectedUser) return;

    try {
      // Usar el servicio de registration requests para aprobar
      await registrationRequestsService.approve(selectedUser.id, {
        status: 'active',
        role: role,
      });

      alert('Usuario activado exitosamente');
      setApproveModalOpen(false);
      setSelectedUser(null);
      fetchInactiveUsers(); // Recargar lista
    } catch (error) {
      console.error('Error al activar usuario:', error);
      alert('Error al activar el usuario');
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedUser) return;

    try {
      // Usar el servicio de registration requests para rechazar
      await registrationRequestsService.reject(selectedUser.id, {
        rejection_reason: reason,
      });

      alert('Solicitud rechazada exitosamente');
      setRejectModalOpen(false);
      setSelectedUser(null);
      fetchInactiveUsers(); // Recargar lista
    } catch (error) {
      console.error('Error al rechazar usuario:', error);
      alert('Error al rechazar el usuario');
    }
  };

  // Estadísticas - todos los usuarios inactivos están pendientes de aprobación
  const pendingCount = users.length;
  const approvedCount = 0; // No mostramos los aprobados aquí
  const rejectedCount = 0; // No mostramos los rechazados aquí

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
          Usuarios Pendientes de Activación
        </h1>
        <p className="text-gray-300">
          Revisa y aprueba los usuarios registrados que están inactivos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-warning/20 shadow-lg shadow-warning/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-warning">{pendingCount}</p>
            </div>
            <FontAwesomeIcon icon={faUserClock} className="text-4xl text-warning" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 shadow-lg shadow-primary-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-primary-400">{pendingCount}</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-primary-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-info/20 shadow-lg shadow-info/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">Por Revisar</p>
              <p className="text-3xl font-bold text-info">{pendingCount}</p>
            </div>
            <FontAwesomeIcon icon={faUserCheck} className="text-4xl text-info" />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {users.length === 0 ? (
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/30 shadow-lg animate-slide-up">
            <FontAwesomeIcon icon={faUserClock} className="text-5xl text-gray-500 mb-4" />
            <p className="text-gray-300 font-medium">No hay usuarios pendientes de activación</p>
          </div>
        ) : (
          users.map((user, index) => {
            const roleInfo = getRoleInfo(user.role);
            return (
              <div key={user.id} style={{ animationDelay: `${index * 50}ms` }}>
                <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FontAwesomeIcon
                          icon={roleInfo.icon}
                          className={`text-2xl ${roleInfo.color}`}
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      {expandedId === user.id && (
                        <div className="mt-4 space-y-2 animate-slide-down">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Usuario</p>
                              <p className="text-sm text-white">{user.username}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Rol Solicitado</p>
                              <p className="text-sm text-white">{roleInfo.label}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Fecha de Registro</p>
                              <p className="text-sm text-white">
                                {new Date(user.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row gap-2 ml-4">
                      <button
                        onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                        className="btn btn-sm bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800"
                      >
                        {expandedId === user.id ? 'Ocultar' : 'Ver Detalles'}
                      </button>
                      <button
                        onClick={() => handleApproveClick(user)}
                        className="btn btn-sm bg-gradient-to-r from-success-700 to-success-500 text-white hover:from-success-90 hover:to-success-70"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectClick(user)}
                        className="btn btn-sm bg-gradient-to-r from-danger-500 to-danger-400 text-white hover:from-danger-90 hover:to-danger-70"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ApproveRegistrationModal
        isOpen={approveModalOpen}
        registration={selectedUser ? {
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          phone_number: selectedUser.phone,
          role: selectedUser.role,
          created_at: selectedUser.created_at,
          status: 'pending'
        } : null}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleApproveConfirm}
      />

      <RejectRegistrationModal
        isOpen={rejectModalOpen}
        registration={selectedUser ? {
          id: selectedUser.id,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          phone_number: selectedUser.phone,
          role: selectedUser.role,
          created_at: selectedUser.created_at,
          status: 'pending'
        } : null}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};
