import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRobot, faCog } from '@fortawesome/free-solid-svg-icons';

interface ChatbotConfig {
  enabled: boolean;
  greeting_message: string;
  fallback_message: string;
  response_delay: number;
  max_conversations_per_day: number;
  contact_threshold: number;
}

interface ChatbotConfigModalProps {
  isOpen: boolean;
  config: ChatbotConfig;
  onSave: (config: ChatbotConfig) => void;
  onCancel: () => void;
}

export const ChatbotConfigModal = ({ isOpen, config, onSave, onCancel }: ChatbotConfigModalProps) => {
  const [formData, setFormData] = useState<ChatbotConfig>({
    enabled: true,
    greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
    fallback_message: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
    response_delay: 1000,
    max_conversations_per_day: 1000,
    contact_threshold: 3,
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCog} className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              Configuración del Chatbot
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
          {/* Estado General */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Estado General
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 text-indigo-600"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-300">
                Chatbot activo en el sitio web
              </label>
            </div>
            {!formData.enabled && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Advertencia:</span> El chatbot estará desactivado y no responderá consultas
                </p>
              </div>
            )}
          </div>

          {/* Mensajes Predeterminados */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Mensajes Predeterminados
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje de Bienvenida *
                </label>
                <textarea
                  required
                  value={formData.greeting_message}
                  onChange={(e) => setFormData({ ...formData, greeting_message: e.target.value })}
                  className="input w-full"
                  rows={3}
                  placeholder="¡Hola! Soy el asistente virtual..."
                />
                <p className="text-xs text-gray-300 mt-1">
                  Este mensaje se mostrará cuando un usuario inicie una conversación
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje de Fallback *
                </label>
                <textarea
                  required
                  value={formData.fallback_message}
                  onChange={(e) => setFormData({ ...formData, fallback_message: e.target.value })}
                  className="input w-full"
                  rows={3}
                  placeholder="Lo siento, no entendí tu pregunta..."
                />
                <p className="text-xs text-gray-300 mt-1">
                  Este mensaje se mostrará cuando el chatbot no pueda encontrar una respuesta
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de Comportamiento */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración de Comportamiento
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Retraso de Respuesta (ms)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="100"
                  value={formData.response_delay}
                  onChange={(e) => setFormData({ ...formData, response_delay: parseInt(e.target.value) })}
                  className="input w-full"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Tiempo de espera antes de mostrar la respuesta (simula escritura)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Conversaciones por Día
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.max_conversations_per_day}
                  onChange={(e) => setFormData({ ...formData, max_conversations_per_day: parseInt(e.target.value) })}
                  className="input w-full"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Límite de conversaciones simultáneas (0 = sin límite)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Umbral para Contacto Humano
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.contact_threshold}
                  onChange={(e) => setFormData({ ...formData, contact_threshold: parseInt(e.target.value) })}
                  className="input w-full"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Después de este número de respuestas fallidas, se sugerirá contacto humano
                </p>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-indigo-50 border-indigo-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3">
              Vista Previa
            </h4>
            <div className="space-y-3">
              {/* Mensaje de Bienvenida */}
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 border border-indigo-200 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faRobot} className="text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600">Chatbot</span>
                  </div>
                  <p className="text-sm text-white">
                    {formData.greeting_message}
                  </p>
                </div>
              </div>

              {/* Mensaje del Usuario */}
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p className="text-sm">Pregunta del usuario...</p>
                </div>
              </div>

              {/* Mensaje de Fallback */}
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 border border-indigo-200 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faRobot} className="text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600">Chatbot</span>
                  </div>
                  <p className="text-sm text-white">
                    {formData.fallback_message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
