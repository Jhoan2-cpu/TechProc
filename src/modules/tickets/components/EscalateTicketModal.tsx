import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types';
import { apiRequest } from '../../../services/api.config';
import { authService } from '../../../services/authService';
import { ticketsService } from '../services/ticketsService';

interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string[];
  status: string;
  employee_id: number | null;
  last_access: string | null;
  last_access_ip: string | null;
  created_at: string;
}

interface Technician {
  id: number;
  employee_id: number;
  name: string;
  email: string;
}

interface EscalateTicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EscalateTicketModal = ({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: EscalateTicketModalProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [technicianId, setTechnicianId] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTechnicians();
    }
  }, [isOpen]);

  const loadTechnicians = async () => {
    try {
      setLoadingTechnicians(true);
      setError('');

      // Obtener el empleado actual para excluirlo de la lista
      const currentEmployee = authService.getCurrentEmployee();
      const currentEmployeeId = currentEmployee?.id;

      // Hacer petición directa al API para obtener usuarios sin transformación
      const response = await apiRequest<{
        success: boolean;
        data: {
          users: ApiUser[];
          pagination: any;
        };
      }>('/admin/users');

      console.log('Respuesta del API:', response);
      console.log('Employee ID actual (a excluir):', currentEmployeeId);

      // Filtrar solo técnicos con employee_id, rol support y status active
      const validTechnicians = response.data.users
        .filter(user => {
          console.log('Revisando usuario:', user.first_name, user.last_name, {
            employee_id: user.employee_id,
            status: user.status,
            role: user.role
          });

          // Verificar que tenga employee_id (no null)
          if (!user.employee_id) {
            console.log('  -> Descartado: no tiene employee_id');
            return false;
          }

          // Excluir al técnico actual (no puede escalarse a sí mismo)
          if (user.employee_id === currentEmployeeId) {
            console.log('  -> Descartado: es el técnico actual');
            return false;
          }

          // Verificar que esté activo
          if (user.status !== 'active') {
            console.log('  -> Descartado: no está activo');
            return false;
          }

          // Verificar que tenga rol support
          // El rol viene como array en el API, tomamos el primer elemento
          const userRole = Array.isArray(user.role) ? user.role[0] : user.role;

          // El API devuelve 'support' directamente, no en español
          if (userRole !== 'support') {
            console.log('  -> Descartado: rol no es support, es:', userRole);
            return false;
          }

          console.log('  -> ACEPTADO como técnico válido');
          return true;
        })
        .map(user => ({
          id: user.id,
          employee_id: user.employee_id as number,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        }));

      console.log('Técnicos válidos encontrados:', validTechnicians);
      setTechnicians(validTechnicians);
    } catch (err: any) {
      setError('Error al cargar la lista de técnicos');
      console.error('Error loading technicians:', err);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Obtener el employee actual (técnico origen)
      const currentEmployee = authService.getCurrentEmployee();
      if (!currentEmployee) {
        setError('No se pudo obtener los datos del empleado');
        return;
      }

      // Enviar escalación al API
      await ticketsService.escalate(ticket.ticket_id, {
        technician_origin_id: currentEmployee.id,
        technician_destiny_id: Number(technicianId),
        escalation_reason: reason,
        observations: observations,
      });

      // Éxito
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al escalar el ticket');
      console.error('Error escalating ticket:', err);
    } finally {
      setSubmitting(false);
    }
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Technician Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Escalar a Técnico *
            </label>
            {loadingTechnicians ? (
              <div className="flex items-center justify-center p-4">
                <FontAwesomeIcon icon={faSpinner} className="text-2xl text-primary-500 animate-spin mr-2" />
                <span className="text-gray-300">Cargando técnicos...</span>
              </div>
            ) : (
              <select
                required
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="select"
                disabled={submitting}
              >
                <option value="">Seleccione un técnico</option>
                {technicians.map((tech) => (
                  <option key={tech.employee_id} value={tech.employee_id}>
                    {tech.name} - {tech.email}
                  </option>
                ))}
              </select>
            )}
            {!loadingTechnicians && technicians.length === 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                No hay técnicos disponibles para escalación
              </p>
            )}
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
