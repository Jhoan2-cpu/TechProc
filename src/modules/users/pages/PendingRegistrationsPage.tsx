import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';
import { registrationRequestsService } from '../services';
import type { RegistrationRequest } from '../types';
import {
  PendingRegistrationCard,
  PendingRegistrationStats,
  PendingRegistrationFilters,
  ApproveRegistrationModal,
  RejectRegistrationModal,
} from '../components';

export const PendingRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'all'
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRequest | null>(
    null
  );

  // Cargar solicitudes
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationRequestsService.getAll();
      setRegistrations(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      alert('Error al cargar las solicitudes de registro');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleApproveClick = (registration: RegistrationRequest) => {
    setSelectedRegistration(registration);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (registration: RegistrationRequest) => {
    setSelectedRegistration(registration);
    setRejectModalOpen(true);
  };

  const handleApproveConfirm = async (role: string) => {
    if (!selectedRegistration) return;

    try {
      await registrationRequestsService.approve(selectedRegistration.id, {
        role,
        status: 'active',
      });

      alert('Solicitud aprobada exitosamente');
      setApproveModalOpen(false);
      setSelectedRegistration(null);
      fetchRegistrations(); // Recargar lista
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      alert('Error al aprobar la solicitud');
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedRegistration) return;

    try {
      await registrationRequestsService.reject(selectedRegistration.id, {
        rejection_reason: reason,
      });

      alert('Solicitud rechazada');
      setRejectModalOpen(false);
      setSelectedRegistration(null);
      fetchRegistrations(); // Recargar lista
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      alert('Error al rechazar la solicitud');
    }
  };

  // Filtrar registros
  const filteredRegistrations = registrations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  // Contar por estado
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'approved').length;
  const rejectedCount = registrations.filter((r) => r.status === 'rejected').length;

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
          Solicitudes de Registro Pendientes
        </h1>
        <p className="text-gray-300">
          Revisa y aprueba las solicitudes de registro de nuevos usuarios
        </p>
      </div>

      {/* Stats */}
      <PendingRegistrationStats
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Filters */}
      <PendingRegistrationFilters
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      {/* Registrations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegistrations.length === 0 ? (
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/30 shadow-lg animate-slide-up">
            <FontAwesomeIcon icon={faUserClock} className="text-5xl text-gray-500 mb-4" />
            <p className="text-gray-300 font-medium">No hay solicitudes con este estado</p>
          </div>
        ) : (
          filteredRegistrations.map((registration, index) => (
            <div key={registration.id} style={{ animationDelay: `${index * 50}ms` }}>
              <PendingRegistrationCard
                registration={registration}
                isExpanded={expandedId === registration.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === registration.id ? null : registration.id)
                }
                onApprove={() => handleApproveClick(registration)}
                onReject={() => handleRejectClick(registration)}
              />
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ApproveRegistrationModal
        isOpen={approveModalOpen}
        registration={selectedRegistration}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedRegistration(null);
        }}
        onConfirm={handleApproveConfirm}
      />

      <RejectRegistrationModal
        isOpen={rejectModalOpen}
        registration={selectedRegistration}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedRegistration(null);
        }}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};
