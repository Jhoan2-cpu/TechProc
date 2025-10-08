import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faUser, faBuilding, faPhone } from '@fortawesome/free-solid-svg-icons';
import type { ContactForm, ContactFormStatus } from '../types';

interface RespondContactModalProps {
  isOpen: boolean;
  contact: ContactForm | null;
  onSave: (contactId: number, response: string, status: ContactFormStatus, assignedTo: number | null) => void;
  onCancel: () => void;
  formatDateTime: (dateString: string | null) => string;
}

export const RespondContactModal = ({ isOpen, contact, onSave, onCancel, formatDateTime }: RespondContactModalProps) => {
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<ContactFormStatus>('in_progress');
  const [assignedTo, setAssignedTo] = useState<number | null>(null);

  useEffect(() => {
    if (contact) {
      setResponse(contact.response || '');
      setStatus(contact.status);
      setAssignedTo(contact.assigned_to || 1);
    } else {
      setResponse('');
      setStatus('in_progress');
      setAssignedTo(1);
    }
  }, [contact, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      onSave(contact.id_contact, response, status, assignedTo);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-orange-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-secondary-900">
                Responder Consulta
              </h3>
              <p className="text-sm text-secondary-600">
                ID: #{contact.id_contact} • {formatDateTime(contact.submission_date)}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Remitente */}
          <div className="card p-6 bg-blue-50 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
              Información del Remitente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-secondary-600">Nombre</p>
                  <p className="font-semibold text-secondary-900">{contact.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-secondary-600">Email</p>
                  <p className="font-semibold text-secondary-900">{contact.email}</p>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-secondary-600">Teléfono</p>
                    <p className="font-semibold text-secondary-900">{contact.phone}</p>
                  </div>
                </div>
              )}

              {contact.company && (
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-secondary-600">Empresa</p>
                    <p className="font-semibold text-secondary-900">{contact.company}</p>
                  </div>
                </div>
              )}
            </div>

            {(contact.utm_source || contact.utm_medium || contact.utm_campaign) && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-secondary-600 mb-2">Origen de la consulta:</p>
                <div className="flex gap-2 flex-wrap text-xs">
                  {contact.utm_source && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Fuente: {contact.utm_source}
                    </span>
                  )}
                  {contact.utm_medium && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Medio: {contact.utm_medium}
                    </span>
                  )}
                  {contact.utm_campaign && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Campaña: {contact.utm_campaign}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Consulta Original */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-secondary-900 mb-3">
              Consulta Original
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-secondary-600">Asunto</p>
                <p className="font-semibold text-secondary-900">{contact.subject}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600 mb-1">Mensaje</p>
                <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                  <p className="text-secondary-900 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                  {contact.form_type}
                </span>
                <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">
                  {contact.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de Respuesta */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <h4 className="text-lg font-heading font-bold text-secondary-900 mb-4">
                Tu Respuesta
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Respuesta *
                  </label>
                  <textarea
                    required
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="input w-full"
                    rows={6}
                    placeholder="Escribe tu respuesta aquí..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Estado *
                    </label>
                    <select
                      required
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ContactFormStatus)}
                      className="input w-full"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Asignar a (ID Usuario)
                    </label>
                    <input
                      type="number"
                      value={assignedTo || ''}
                      onChange={(e) => setAssignedTo(parseInt(e.target.value) || null)}
                      className="input w-full"
                      placeholder="ID del usuario"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Respuesta Anterior (si existe) */}
            {contact.response && contact.response_date && (
              <div className="card p-6 bg-green-50 border-green-200">
                <h4 className="text-lg font-heading font-bold text-green-900 mb-2">
                  Respuesta Anterior
                </h4>
                <p className="text-xs text-green-700 mb-3">
                  Respondido el {formatDateTime(contact.response_date)}
                  {contact.assigned_to_name && ` por ${contact.assigned_to_name}`}
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-secondary-900 whitespace-pre-wrap">{contact.response}</p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
              <button
                type="button"
                onClick={onCancel}
                className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
              >
                Guardar Respuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
