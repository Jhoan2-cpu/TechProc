import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserClock,
  faCheck,
  faTimes,
  faEye,
  faEnvelope,
  faPhone,
  faBuilding,
  faCalendar,
  faShieldHalved,
  faServer,
  faChartLine,
  faGraduationCap,
  faGlobe,
  faLock,
  faFilter,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

interface PendingRegistration {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  department: string;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Datos mock
const mockRegistrations: PendingRegistration[] = [
  {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '+52 123 456 7890',
    username: 'carlos.mendoza',
    role: 'web',
    department: 'Desarrollo Web',
    reason: 'Necesito acceso para gestionar los proyectos web de la empresa y dar soporte a los tickets relacionados.',
    submittedAt: '2024-03-15 10:30:00',
    status: 'pending',
  },
  {
    id: 2,
    firstName: 'Ana',
    lastName: 'Torres',
    email: 'ana.torres@email.com',
    phone: '+52 987 654 3210',
    username: 'ana.torres',
    role: 'data',
    department: 'Analítica',
    reason: 'Requiero acceso al módulo de analítica para generar reportes mensuales y análisis de datos del LMS.',
    submittedAt: '2024-03-14 15:45:00',
    status: 'pending',
  },
  {
    id: 3,
    firstName: 'Pedro',
    lastName: 'Sánchez',
    email: 'pedro.sanchez@email.com',
    phone: '+52 555 123 4567',
    username: 'pedro.sanchez',
    role: 'infra',
    department: 'Infraestructura',
    reason: 'Soy el nuevo miembro del equipo de infraestructura y necesito acceso para gestionar los servidores y tickets.',
    submittedAt: '2024-03-13 09:20:00',
    status: 'pending',
  },
];

export const PendingRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>(mockRegistrations);
  const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const getRoleInfo = (roleValue: string) => {
    const roles: Record<string, { label: string; icon: any; color: string }> = {
      admin: { label: 'Administrador', icon: faShieldHalved, color: 'text-red-600' },
      lms: { label: 'Gestor LMS', icon: faGraduationCap, color: 'text-blue-600' },
      seg: { label: 'Soporte - Seguridad', icon: faLock, color: 'text-purple-600' },
      infra: { label: 'Soporte - Infraestructura', icon: faServer, color: 'text-green-600' },
      web: { label: 'Developer Web', icon: faGlobe, color: 'text-orange-600' },
      data: { label: 'Analista de Datos', icon: faChartLine, color: 'text-cyan-600' },
    };
    return roles[roleValue] || { label: roleValue, icon: faShieldHalved, color: 'text-gray-600' };
  };

  const handleApprove = (id: number) => {
    const registration = registrations.find(r => r.id === id);
    if (registration) {
      if (window.confirm(`¿Aprobar el registro de ${registration.firstName} ${registration.lastName}?`)) {
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: 'approved' as const } : r))
        );
        setSelectedRegistration(null);
        alert('Registro aprobado exitosamente');
      }
    }
  };

  const handleReject = (id: number) => {
    const registration = registrations.find(r => r.id === id);
    if (registration) {
      const reason = window.prompt(
        `¿Rechazar el registro de ${registration.firstName} ${registration.lastName}?\nMotivo (opcional):`
      );
      if (reason !== null) {
        setRegistrations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: 'rejected' as const } : r))
        );
        setSelectedRegistration(null);
        alert('Registro rechazado');
      }
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary-200">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 flex items-center">
          <FontAwesomeIcon icon={faUserClock} className="mr-3 text-primary-600" />
          Solicitudes de Registro
        </h1>
        <p className="text-secondary-600 mt-2">
          Revisa y aprueba las solicitudes de registro de nuevos usuarios
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Pendientes</p>
              <p className="text-3xl font-heading font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <FontAwesomeIcon icon={faUserClock} className="text-4xl text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Aprobados</p>
              <p className="text-3xl font-heading font-bold text-green-900">{approvedCount}</p>
            </div>
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-600 opacity-50" />
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Rechazados</p>
              <p className="text-3xl font-heading font-bold text-red-900">{rejectedCount}</p>
            </div>
            <FontAwesomeIcon icon={faTimesCircle} className="text-4xl text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <FontAwesomeIcon icon={faFilter} className="text-secondary-400" />
        <select
          className="select max-w-xs"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">Todas las solicitudes</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      {/* Registrations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegistrations.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-secondary-600">No hay solicitudes con este estado</p>
          </div>
        ) : (
          filteredRegistrations.map((registration) => {
            const roleInfo = getRoleInfo(registration.role);
            return (
              <div
                key={registration.id}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={roleInfo.icon}
                        className={`text-2xl ${roleInfo.color}`}
                      />
                      <div>
                        <h3 className="font-heading font-bold text-lg text-secondary-900">
                          {registration.firstName} {registration.lastName}
                        </h3>
                        <p className="text-sm text-secondary-600">{roleInfo.label}</p>
                      </div>
                      <span
                        className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                          registration.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-900'
                            : registration.status === 'approved'
                            ? 'bg-green-100 text-green-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {registration.status === 'pending'
                          ? 'Pendiente'
                          : registration.status === 'approved'
                          ? 'Aprobado'
                          : 'Rechazado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-secondary-600">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-secondary-400" />
                        <span>{registration.email}</span>
                      </div>
                      {registration.phone && (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faPhone} className="text-secondary-400" />
                          <span>{registration.phone}</span>
                        </div>
                      )}
                      {registration.department && (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} className="text-secondary-400" />
                          <span>{registration.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-secondary-400" />
                        <span>{registration.submittedAt}</span>
                      </div>
                    </div>

                    {selectedRegistration?.id === registration.id && (
                      <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm font-semibold text-secondary-700 mb-2">
                          Motivo de registro:
                        </p>
                        <p className="text-sm text-secondary-600">{registration.reason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedRegistration(
                          selectedRegistration?.id === registration.id ? null : registration
                        )
                      }
                      className="btn btn-outline px-3 py-2 text-sm"
                      title="Ver detalles"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {registration.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(registration.id)}
                          className="btn bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm"
                          title="Aprobar"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleReject(registration.id)}
                          className="btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm"
                          title="Rechazar"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
