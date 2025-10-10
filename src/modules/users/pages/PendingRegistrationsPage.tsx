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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
          users/pending-registrations
        </h1>
        <p className="text-gray-300">
          Revisa y aprueba las solicitudes de registro de nuevos usuarios
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-warning/20 shadow-lg shadow-warning/10 hover:shadow-xl hover:shadow-warning/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Pendientes</p>
              <p className="text-4xl font-heading font-bold text-warning">{pendingCount}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-warning/20 to-warning/30 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUserClock} className="text-3xl text-warning" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-success/20 shadow-lg shadow-success/10 hover:shadow-xl hover:shadow-success/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Aprobados</p>
              <p className="text-4xl font-heading font-bold text-success">{approvedCount}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-success" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-danger/20 shadow-lg shadow-danger/10 hover:shadow-xl hover:shadow-danger/20 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1 font-medium">Rechazados</p>
              <p className="text-4xl font-heading font-bold text-danger">{rejectedCount}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-danger/20 to-danger/30 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-3xl text-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 shadow-lg">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-primary-400" />
          <select
            className="px-4 py-2 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all" className="bg-secondary-700">Todas las solicitudes</option>
            <option value="pending" className="bg-secondary-700">Pendientes</option>
            <option value="approved" className="bg-secondary-700">Aprobadas</option>
            <option value="rejected" className="bg-secondary-700">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Registrations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegistrations.length === 0 ? (
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/30 shadow-lg">
            <FontAwesomeIcon icon={faUserClock} className="text-5xl text-gray-500 mb-4" />
            <p className="text-gray-300 font-medium">No hay solicitudes con este estado</p>
          </div>
        ) : (
          filteredRegistrations.map((registration) => {
            const roleInfo = getRoleInfo(registration.role);
            return (
              <div
                key={registration.id}
                className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-lg hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                        <FontAwesomeIcon
                          icon={roleInfo.icon}
                          className="text-xl text-primary-400"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg text-white">
                          {registration.firstName} {registration.lastName}
                        </h3>
                        <p className="text-sm text-gray-300">{roleInfo.label}</p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold border ${
                          registration.status === 'pending'
                            ? 'bg-warning/20 text-warning border-warning/30'
                            : registration.status === 'approved'
                            ? 'bg-success/20 text-success border-success/30'
                            : 'bg-danger/20 text-danger border-danger/30'
                        }`}
                      >
                        {registration.status === 'pending'
                          ? 'Pendiente'
                          : registration.status === 'approved'
                          ? 'Aprobado'
                          : 'Rechazado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
                        <span>{registration.email}</span>
                      </div>
                      {registration.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faPhone} className="text-primary-400" />
                          <span>{registration.phone}</span>
                        </div>
                      )}
                      {registration.department && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                          <span>{registration.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} className="text-primary-400" />
                        <span>{registration.submittedAt}</span>
                      </div>
                    </div>

                    {selectedRegistration?.id === registration.id && (
                      <div className="mt-4 p-4 bg-secondary-700/50 rounded-lg border border-gray-700/50 animate-slide-down">
                        <p className="text-sm font-semibold text-primary-400 mb-2">
                          Motivo de registro:
                        </p>
                        <p className="text-sm text-gray-300 leading-relaxed">{registration.reason}</p>
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
                      className="p-2 bg-secondary-700/50 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:scale-110"
                      title="Ver detalles"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {registration.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(registration.id)}
                          className="p-2 bg-success/20 hover:bg-success/30 text-success rounded-lg border border-success/30 hover:border-success/50 transition-all duration-300 hover:scale-110"
                          title="Aprobar"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleReject(registration.id)}
                          className="p-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg border border-danger/30 hover:border-danger/50 transition-all duration-300 hover:scale-110"
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
