import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
  faArrowRight,
  faCalendar,
  faFileAlt,
  faPaperPlane,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import type { Escalation } from '../types';

// Datos mock de escalaciones - Técnico actual ID 1
const currentTechnicianId = 1;

const mockEscalations: Escalation[] = [
  // Escalaciones enviadas por el técnico actual
  {
    escalation_id: 1,
    ticket_id: 5,
    technician_origin_id: 1,
    technician_destination_id: 3,
    escalation_reason: 'Requiere conocimiento especializado en seguridad avanzada',
    observations: 'El caso involucra posible intrusión externa que necesita análisis forense',
    escalation_date: '2024-03-15 08:30:00',
    approved: true,
  },
  {
    escalation_id: 3,
    ticket_id: 1,
    technician_origin_id: 1,
    technician_destination_id: 4,
    escalation_reason: 'Problema requiere acceso a infraestructura de producción',
    observations: 'Se necesitan permisos elevados que solo tiene el equipo senior',
    escalation_date: '2024-03-15 11:30:00',
    approved: false,
  },
  // Escalaciones recibidas por el técnico actual
  {
    escalation_id: 2,
    ticket_id: 2,
    technician_origin_id: 2,
    technician_destination_id: 1,
    escalation_reason: 'Sobrecarga de trabajo del técnico actual',
    observations: 'El técnico está manejando casos críticos, se necesita redistribución',
    escalation_date: '2024-03-15 10:00:00',
    approved: false,
  },
  {
    escalation_id: 4,
    ticket_id: 8,
    technician_origin_id: 5,
    technician_destination_id: 1,
    escalation_reason: 'Problema de autenticación 2FA requiere experiencia del técnico',
    observations: 'El técnico junior no puede resolver el caso, necesita escalación',
    escalation_date: '2024-03-15 13:00:00',
    approved: false,
  },
];

type EscalationTab = 'sent' | 'received';

export const EscalationsPage = () => {
  const [escalations, setEscalations] = useState<Escalation[]>(mockEscalations);
  const [activeTab, setActiveTab] = useState<EscalationTab>('sent');

  const handleAcceptEscalation = (escalationId: number) => {
    setEscalations(escalations.map(e =>
      e.escalation_id === escalationId
        ? { ...e, approved: true }
        : e
    ));
  };

  const handleRejectEscalation = (escalationId: number) => {
    setEscalations(escalations.filter(e => e.escalation_id !== escalationId));
  };

  // Filtrar escalaciones enviadas y recibidas
  const sentEscalations = escalations.filter(e => e.technician_origin_id === currentTechnicianId);
  const receivedEscalations = escalations.filter(e => e.technician_destination_id === currentTechnicianId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sentApproved = sentEscalations.filter(e => e.approved).length;
  const sentPending = sentEscalations.filter(e => !e.approved).length;
  const receivedPending = receivedEscalations.filter(e => !e.approved).length;

  const renderSentEscalations = () => (
    <div className="space-y-6">
      {/* Estadísticas de Enviadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total Enviadas</p>
              <p className="text-3xl font-heading font-bold text-primary-400">{sentEscalations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faPaperPlane} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Aprobadas</p>
              <p className="text-3xl font-heading font-bold text-success">{sentApproved}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Pendientes</p>
              <p className="text-3xl font-heading font-bold text-warning">{sentPending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de escalaciones enviadas */}
      <div className="space-y-4">
        {sentEscalations.length > 0 ? (
          sentEscalations.map((escalation, index) => (
            <div
              key={escalation.escalation_id}
              className="card p-6 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">
                    Escalación #{escalation.escalation_id} - Ticket #{escalation.ticket_id}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                    <span>{formatDate(escalation.escalation_date)}</span>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                    escalation.approved
                      ? 'bg-success/20 text-green-700'
                      : 'bg-warning/20 text-yellow-700'
                  }`}
                >
                  <FontAwesomeIcon icon={escalation.approved ? faCheckCircle : faClock} />
                  {escalation.approved ? 'Aprobada' : 'Esperando aprobación'}
                </span>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tú (Origen)</p>
                      <p className="font-semibold text-white">Técnico #{escalation.technician_origin_id}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xl flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Destino</p>
                      <p className="font-semibold text-white">Técnico #{escalation.technician_destination_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-orange-600" />
                    <label className="text-sm font-semibold text-gray-300">Razón de Escalación</label>
                  </div>
                  <p className="text-white bg-white border border-secondary-200 p-3 rounded-lg">
                    {escalation.escalation_reason}
                  </p>
                </div>

                {escalation.observations && (
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">Observaciones</label>
                    <p className="text-gray-300 text-sm bg-primary-900/20 border-l-4 border-blue-500 p-3 rounded">
                      {escalation.observations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <FontAwesomeIcon icon={faPaperPlane} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-gray-300">No has enviado escalaciones</p>
            <p className="text-sm text-gray-400 mt-2">Cuando necesites ayuda con un ticket, podrás escalarlo desde la pestaña "Mis Tickets"</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReceivedEscalations = () => (
    <div className="space-y-6">
      {/* Estadísticas de Recibidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Total Recibidas</p>
              <p className="text-3xl font-heading font-bold text-purple-400">{receivedEscalations.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faInbox} className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 mb-1">Requieren Acción</p>
              <p className="text-3xl font-heading font-bold text-orange-400">{receivedPending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de escalaciones recibidas */}
      <div className="space-y-4">
        {receivedEscalations.length > 0 ? (
          receivedEscalations.map((escalation, index) => (
            <div
              key={escalation.escalation_id}
              className={`card p-6 hover:shadow-lg transition-all animate-fade-in ${
                !escalation.approved ? 'border-2 border-orange-300' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">
                    Escalación #{escalation.escalation_id} - Ticket #{escalation.ticket_id}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                    <span>{formatDate(escalation.escalation_date)}</span>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                    escalation.approved
                      ? 'bg-success/20 text-green-700'
                      : 'bg-orange-900/20 text-orange-700'
                  }`}
                >
                  <FontAwesomeIcon icon={escalation.approved ? faCheckCircle : faExchangeAlt} />
                  {escalation.approved ? 'Aceptada' : 'Pendiente de Acción'}
                </span>
              </div>

              <div className="bg-secondary-600/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">De</p>
                      <p className="font-semibold text-white">Técnico #{escalation.technician_origin_id}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xl flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Para ti</p>
                      <p className="font-semibold text-white">Técnico #{escalation.technician_destination_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-orange-600" />
                    <label className="text-sm font-semibold text-gray-300">Razón de Escalación</label>
                  </div>
                  <p className="text-white bg-white border border-secondary-200 p-3 rounded-lg">
                    {escalation.escalation_reason}
                  </p>
                </div>

                {escalation.observations && (
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">Observaciones</label>
                    <p className="text-gray-300 text-sm bg-primary-900/20 border-l-4 border-blue-500 p-3 rounded">
                      {escalation.observations}
                    </p>
                  </div>
                )}
              </div>

              {!escalation.approved && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-secondary-200">
                  <button
                    onClick={() => handleAcceptEscalation(escalation.escalation_id)}
                    className="btn bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Aceptar Escalación
                  </button>
                  <button
                    onClick={() => handleRejectEscalation(escalation.escalation_id)}
                    className="btn bg-red-600 hover:bg-red-700 text-white flex-1 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-secondary-300 mb-4" />
            <p className="text-xl text-gray-300">No tienes escalaciones recibidas</p>
            <p className="text-sm text-gray-400 mt-2">Cuando otros técnicos te escalen tickets aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-6">
          tickets/escalations
        </h2>

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-secondary-200">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'sent'
                ? 'border-primary-600 text-primary-600 bg-primary-900/20'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Escalaciones Enviadas</span>
            {sentPending > 0 && (
              <span className="bg-warning/20 text-white text-xs rounded-full px-2 py-0.5">{sentPending}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'received'
                ? 'border-primary-600 text-primary-600 bg-primary-900/20'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
            }`}
          >
            <FontAwesomeIcon icon={faInbox} />
            <span>Escalaciones Recibidas</span>
            {receivedPending > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">{receivedPending}</span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === 'sent' && renderSentEscalations()}
      {activeTab === 'received' && renderReceivedEscalations()}
    </div>
  );
};
