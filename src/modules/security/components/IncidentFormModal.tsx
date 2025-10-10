import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { Incident, IncidentStatus } from '../types';

interface IncidentFormModalProps {
  isOpen: boolean;
  incident: (Incident & { description?: string; severity?: string; assigned_to?: string }) | null;
  onSave: (incident: Partial<Incident & { description?: string; severity?: string; assigned_to?: string }>) => void;
  onCancel: () => void;
}

export const IncidentFormModal = ({ isOpen, incident, onSave, onCancel }: IncidentFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'open' as IncidentStatus,
    assigned_to: '',
    alert_id: 0,
    responsible_id: 1,
  });

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title,
        description: incident.description || '',
        severity: (incident.severity as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        status: incident.status,
        assigned_to: incident.assigned_to || '',
        alert_id: incident.alert_id,
        responsible_id: incident.responsible_id,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        assigned_to: '',
        alert_id: 0,
        responsible_id: 1,
      });
    }
  }, [incident, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slide-up">
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {incident ? 'Editar Incidente' : 'Nuevo Incidente'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Información Básica */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Información del Incidente
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Incidente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: Intento de acceso no autorizado detectado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  rows={4}
                  placeholder="Describe el incidente en detalle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Severidad *
                  </label>
                  <select
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="input w-full"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IncidentStatus })}
                    className="input w-full"
                  >
                    <option value="open">Abierto</option>
                    <option value="investigating">Investigando</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asignado a
                </label>
                <input
                  type="text"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="input w-full"
                  placeholder="Nombre del responsable"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Nombre del usuario o equipo responsable de gestionar este incidente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID de Alerta Asociada
                </label>
                <input
                  type="number"
                  value={formData.alert_id || ''}
                  onChange={(e) => setFormData({ ...formData, alert_id: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                  placeholder="0"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Vincular con una alerta de seguridad existente
                </p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-2">
              Recomendaciones
            </h4>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Documenta todos los detalles relevantes del incidente</li>
              <li>Asigna la severidad apropiada según el impacto potencial</li>
              <li>Designa un responsable para el seguimiento del incidente</li>
              <li>Actualiza el estado conforme avance la investigación</li>
              <li>Mantén un registro de las acciones tomadas</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              {incident ? 'Guardar Cambios' : 'Crear Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
