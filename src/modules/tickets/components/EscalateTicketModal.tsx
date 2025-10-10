import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';

// Lista mock de técnicos disponibles para escalación
const availableTechnicians = [
  { id: 2, name: 'Carlos Rodríguez', specialty: 'Seguridad Avanzada', level: 'Senior' },
  { id: 3, name: 'Ana García', specialty: 'Infraestructura', level: 'Senior' },
  { id: 4, name: 'Luis Martínez', specialty: 'Desarrollo', level: 'Lead' },
  { id: 5, name: 'María Fernández', specialty: 'Redes', level: 'Senior' },
];

interface EscalateTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (ticketId: number, technicianId: number, reason: string, observations: string) => void;
}

export const EscalateTicketModal = ({
  ticket,
  isOpen,
  onClose,
  onEscalate,
}: EscalateTicketModalProps) => {
  const [technicianId, setTechnicianId] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEscalate(ticket.ticket_id, Number(technicianId), reason, observations);
    // Reset form
    setTechnicianId('');
    setReason('');
    setObservations('');
  };

  const handleClose = () => {
    setTechnicianId('');
    setReason('');
    setObservations('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-yellow-500/30">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-white" />
            <h2 className="text-2xl font-heading font-bold text-white">
              Escalar Ticket
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-opacity-90 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Ticket Info */}
          <div className="bg-orange-900/20 border border-orange-200 rounded-lg p-4">
            <h3 className="font-heading font-bold text-lg text-orange-400 mb-2">
              Ticket #{ticket.ticket_id}
            </h3>
            <p className="text-sm text-white-400">{ticket.title}</p>
            <div className="mt-2 flex gap-2 items-center">
              <span className="text-xs text-white-700">
                Prioridad: <span className="font-semibold">{ticket.priority}</span>
              </span>
              <span className="text-orange-300">•</span>
              <span className="text-xs text-white-700">
                Usuario ID: <span className="font-semibold">{ticket.user_id}</span>
              </span>
            </div>
          </div>

          {/* Technician Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Escalar a Técnico *
            </label>
            <select
              required
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              className="select"
            >
              <option value="">Seleccione un técnico</option>
              {availableTechnicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialty} ({tech.level})
                </option>
              ))}
            </select>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motivo de Escalación *
            </label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="select"
            >
              <option value="">Seleccione un motivo</option>
              <option value="requiere_especialista">Requiere Especialista</option>
              <option value="fuera_alcance">Fuera de mi Alcance Técnico</option>
              <option value="alta_complejidad">Alta Complejidad</option>
              <option value="requiere_autorizacion">Requiere Autorización Superior</option>
              <option value="falta_recursos">Falta de Recursos/Herramientas</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observaciones y Contexto *
            </label>
            <textarea
              required
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="input min-h-[150px]"
              placeholder="Describe los pasos realizados, diagnóstico inicial, y por qué necesitas escalar este ticket..."
            />
          </div>

          {/* Warning */}
          <div className="bg-warning/20 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-white/85">
              <strong>Importante:</strong> Al escalar este ticket, será reasignado a un técnico de nivel superior.
              Asegúrate de documentar toda la información relevante que hayas recopilado.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-red-700 text-white hover:bg-red-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-orange-600 hover:bg-orange-700 text-white"
            >
              Escalar Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
