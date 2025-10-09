import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import type { Incident, IncidentStatus } from '../types';

interface ChangeIncidentStatusModalProps {
  isOpen: boolean;
  incident: (Incident & { description?: string; severity?: string; assigned_to?: string }) | null;
  onConfirm: (incidentId: number, newStatus: IncidentStatus, notes: string) => void;
  onCancel: () => void;
}

export const ChangeIncidentStatusModal = ({
  isOpen,
  incident,
  onConfirm,
  onCancel
}: ChangeIncidentStatusModalProps) => {
  const [newStatus, setNewStatus] = useState<IncidentStatus>('investigating');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (incident) {
      onConfirm(incident.id_incident, newStatus, notes);
      setNotes('');
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'open':
        return 'bg-primary-900/20 text-blue-700 border-blue-300';
      case 'investigating':
        return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'resolved':
        return 'bg-success/20 text-green-700 border-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: IncidentStatus) => {
    const texts: Record<IncidentStatus, string> = {
      open: 'Abierto',
      investigating: 'Investigando',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return texts[status];
  };

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'resolved':
        return faCheckCircle;
      case 'closed':
        return faLock;
      case 'investigating':
        return faClock;
      default:
        return faExclamationTriangle;
    }
  };

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="bg-primary-600 text-white p-6 flex items-center gap-4 rounded-t-lg">
          <FontAwesomeIcon icon={faClock} className="text-4xl" />
          <div>
            <h3 className="text-2xl font-heading font-bold">Cambiar Estado del Incidente</h3>
            <p className="text-primary-100 text-sm">Actualiza el estado del incidente #{incident.id_incident}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Incidente */}
          <div className="bg-secondary-600/50 rounded-lg p-4 border-2 border-secondary-200">
            <h4 className="font-heading font-bold text-white mb-2">{incident.title}</h4>
            <p className="text-sm text-gray-400 mb-3">{incident.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300">Estado actual:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(incident.status)}`}>
                <FontAwesomeIcon icon={getStatusIcon(incident.status)} className="mr-1" />
                {getStatusText(incident.status)}
              </span>
            </div>
          </div>

          {/* Selector de Nuevo Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nuevo Estado *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewStatus('open')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  newStatus === 'open'
                    ? 'border-blue-500 bg-primary-900/20'
                    : 'border-secondary-200 hover:border-blue-300'
                }`}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-600 text-2xl mb-2" />
                <p className="font-bold text-sm text-white">Abierto</p>
              </button>

              <button
                type="button"
                onClick={() => setNewStatus('investigating')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  newStatus === 'investigating'
                    ? 'border-yellow-500 bg-warning/20'
                    : 'border-secondary-200 hover:border-yellow-300'
                }`}
              >
                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-2xl mb-2" />
                <p className="font-bold text-sm text-white">Investigando</p>
              </button>

              <button
                type="button"
                onClick={() => setNewStatus('resolved')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  newStatus === 'resolved'
                    ? 'border-green-500 bg-success/20'
                    : 'border-secondary-200 hover:border-green-300'
                }`}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-2xl mb-2" />
                <p className="font-bold text-sm text-white">Resuelto</p>
              </button>

              <button
                type="button"
                onClick={() => setNewStatus('closed')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  newStatus === 'closed'
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-secondary-200 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faLock} className="text-gray-600 text-2xl mb-2" />
                <p className="font-bold text-sm text-white">Cerrado</p>
              </button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas sobre el cambio de estado
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input w-full"
              rows={3}
              placeholder="Describe las razones del cambio de estado, acciones tomadas, etc..."
            />
            <p className="text-xs text-gray-300 mt-1">
              Estas notas quedarán registradas en el historial del incidente
            </p>
          </div>

          {/* Información según el estado */}
          {newStatus === 'resolved' && (
            <div className="bg-success/20 border-l-4 border-green-400 p-4">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Resolución:</span> El incidente se marcará como resuelto.
                Se registrará la fecha de resolución automáticamente.
              </p>
            </div>
          )}

          {newStatus === 'closed' && (
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Cierre:</span> El incidente se archivará y no podrá ser modificado posteriormente.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
            >
              <FontAwesomeIcon icon={getStatusIcon(newStatus)} />
              Cambiar a {getStatusText(newStatus)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
