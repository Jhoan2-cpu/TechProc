import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBell } from '@fortawesome/free-solid-svg-icons';
import type { Alert, AlertType, AlertStatus } from '../types';

interface AlertFormModalProps {
  isOpen: boolean;
  alert: Alert | null;
  onSave: (alert: Partial<Alert>) => void;
  onCancel: () => void;
}

export const AlertFormModal = ({ isOpen, alert, onSave, onCancel }: AlertFormModalProps) => {
  const [formData, setFormData] = useState({
    message: '',
    type: 'info' as AlertType,
    status: 'active' as AlertStatus,
    link_url: '',
    link_text: '',
    start_date: '',
    end_date: '',
    priority: 1,
    created_by: 1,
  });

  useEffect(() => {
    if (alert) {
      setFormData({
        message: alert.message,
        type: alert.type,
        status: alert.status,
        link_url: alert.link_url || '',
        link_text: alert.link_text || '',
        start_date: alert.start_date,
        end_date: alert.end_date || '',
        priority: alert.priority,
        created_by: alert.created_by,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        message: '',
        type: 'info',
        status: 'active',
        link_url: '',
        link_text: '',
        start_date: today,
        end_date: '',
        priority: 1,
        created_by: 1,
      });
    }
  }, [alert, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faBell} className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {alert ? 'Editar Alerta' : 'Nueva Alerta'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información de la Alerta */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Contenido de la Alerta
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input w-full"
                  rows={3}
                  placeholder="Mensaje de la alerta que se mostrará en el sitio web"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AlertType })}
                    className="input w-full"
                  >
                    <option value="info">Información</option>
                    <option value="success">Éxito</option>
                    <option value="warning">Advertencia</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AlertStatus })}
                    className="input w-full"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                    <option value="expired">Expirada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prioridad *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-300 mt-1">
                    Orden de visualización (1-10)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enlace (Opcional) */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Enlace (Opcional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL del Enlace
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="input w-full"
                  placeholder="/cursos/python-basico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texto del Enlace
                </label>
                <input
                  type="text"
                  value={formData.link_text}
                  onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                  className="input w-full"
                  placeholder="Ver más"
                />
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Periodo de Vigencia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="input w-full"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Dejar vacío para alerta sin fecha de fin
                </p>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3">
              Vista Previa
            </h4>
            <div className={`p-4 rounded-lg border-2 ${
              formData.type === 'success' ? 'bg-success/20 border-green-300' :
              formData.type === 'warning' ? 'bg-warning/20 border-yellow-300' :
              formData.type === 'error' ? 'bg-danger/20 border-red-300' :
              'bg-primary-900/20 border-blue-300'
            }`}>
              <p className="text-sm font-medium text-white">
                {formData.message || 'Tu mensaje aparecerá aquí...'}
                {formData.link_url && formData.link_text && (
                  <span className="ml-2 underline font-bold">
                    {formData.link_text}
                  </span>
                )}
              </p>
            </div>
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
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {alert ? 'Guardar Cambios' : 'Crear Alerta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
