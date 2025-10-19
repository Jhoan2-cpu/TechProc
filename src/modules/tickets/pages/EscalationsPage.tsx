import { useState, useEffect } from 'react';
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
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import type { Escalation } from '../types';
import { ticketsService } from '../services/ticketsService';
import { authService } from '../../../services/authService';

type EscalationTab = 'sent' | 'received';

export const EscalationsPage = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [activeTab, setActiveTab] = useState<EscalationTab>('sent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadEscalations();
  }, []);

  const loadEscalations = async () => {
    try {
      setLoading(true);
      setError('');

      const allEscalations = await ticketsService.getEscalations();

      // Obtener el employee_id del técnico actual
      const currentEmployee = authService.getCurrentEmployee();

      if (!currentEmployee) {
        setError('No se pudo obtener los datos del empleado');
        return;
      }

      // Filtrar solo las escalaciones donde el técnico de origen es el actual
      const myEscalations = allEscalations.filter(
        escalation => escalation.technician_origin.id === currentEmployee.id
      );

      console.log('Escalaciones filtradas:', myEscalations);
      setEscalations(myEscalations);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las escalaciones');
      console.error('Error loading escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptEscalation = (escalationId: number) => {
    // TODO: Implementar llamada al API para aceptar escalación
    setEscalations(escalations.map(e =>
      e.escalation_id === escalationId
        ? { ...e, approved: true }
        : e
    ));
  };

  const handleRejectEscalation = (escalationId: number) => {
    // TODO: Implementar llamada al API para rechazar escalación
    setEscalations(escalations.filter(e => e.escalation_id !== escalationId));
  };

  // Las escalaciones ya están filtradas para mostrar solo las enviadas por el técnico actual
  // No hay escalaciones recibidas en esta vista según los requisitos
  const sentEscalations = escalations;
  const receivedEscalations: Escalation[] = []; // No se muestran recibidas según indi.txt

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
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Enviadas</p>
              <p className="text-3xl font-heading font-bold text-white">{sentEscalations.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FontAwesomeIcon icon={faPaperPlane} className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Aprobadas</p>
              <p className="text-3xl font-heading font-bold text-white">{sentApproved}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Pendientes</p>
              <p className="text-3xl font-heading font-bold text-white">{sentPending}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <FontAwesomeIcon icon={faClock} className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de escalaciones enviadas */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-6xl text-primary-500 mb-4 animate-spin" />
            <p className="text-xl text-gray-300">Cargando escalaciones...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-4">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
            <button
              onClick={loadEscalations}
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              Reintentar
            </button>
          </div>
        ) : sentEscalations.length > 0 ? (
          sentEscalations.map((escalation, index) => (
            <div
              key={escalation.escalation_id}
              className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">
                    Escalación #{escalation.escalation_id}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Ticket #{escalation.ticket.id}: {escalation.ticket.title}
                  </p>
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
                      <p className="font-semibold text-white">
                        {escalation.technician_origin.name || `Técnico #${escalation.technician_origin.id}`}
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xl flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Destino</p>
                      <p className="font-semibold text-white">
                        {escalation.technician_destiny.name || `Técnico #${escalation.technician_destiny.id}`}
                      </p>
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
                  <p className="text-gray-300 bg-secondary-600/30 border border-secondary-200/30 p-3 rounded-lg">
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
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <FontAwesomeIcon icon={faPaperPlane} className="text-6xl text-gray-500 mb-4" />
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
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Recibidas</p>
              <p className="text-3xl font-heading font-bold text-white">{receivedEscalations.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FontAwesomeIcon icon={faInbox} className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Requieren Acción</p>
              <p className="text-3xl font-heading font-bold text-white">{receivedPending}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FontAwesomeIcon icon={faExchangeAlt} className="text-white text-2xl" />
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
              className={`bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in ${
                !escalation.approved ? 'border-2 border-orange-500/50' : 'border border-gray-700/30 hover:border-primary-500/30'
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
                  <p className="text-gray-300 bg-secondary-600/30 border border-secondary-200/30 p-3 rounded-lg">
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
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-gray-500 mb-4" />
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
        <div className="flex gap-2 border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 rounded-t-lg ${
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-500 bg-primary-900/30'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Escalaciones Enviadas</span>
            {sentPending > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full px-2 py-0.5">{sentPending}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 rounded-t-lg ${
              activeTab === 'received'
                ? 'border-primary-500 text-primary-500 bg-primary-900/30'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-secondary-600/50'
            }`}
          >
            <FontAwesomeIcon icon={faInbox} />
            <span>Escalaciones Recibidas</span>
            {receivedPending > 0 && (
              <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full px-2 py-0.5">{receivedPending}</span>
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
