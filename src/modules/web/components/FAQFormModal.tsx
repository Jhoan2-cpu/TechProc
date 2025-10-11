import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRobot, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../types';

interface FAQFormModalProps {
  isOpen: boolean;
  faq: ChatbotFAQ | null;
  onSave: (faq: Partial<ChatbotFAQ>) => void;
  onCancel: () => void;
}

export const FAQFormModal = ({ isOpen, faq, onSave, onCancel }: FAQFormModalProps) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    keywords: [] as string[],
    active: true,
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        keywords: faq.keywords,
        active: faq.active,
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        category: '',
        keywords: [],
        active: true,
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim().toLowerCase()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faRobot} className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {faq ? 'Editar FAQ' : 'Nueva FAQ'}
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
          {/* Pregunta y Respuesta */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Pregunta y Respuesta
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pregunta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="input w-full"
                  placeholder="¿Cuál es tu pregunta?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Respuesta *
                </label>
                <textarea
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="input w-full"
                  rows={5}
                  placeholder="Escribe la respuesta que el chatbot proporcionará..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: General, Cursos, Pagos, Certificaciones"
                />
              </div>
            </div>
          </div>

          {/* Palabras Clave */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Palabras Clave para Detección
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Agrega palabras clave que ayudarán al chatbot a identificar cuándo usar esta respuesta
            </p>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  className="input flex-1"
                  placeholder="Agregar palabra clave"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Agregar
                </button>
              </div>
            </div>

            {formData.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="text-indigo-700 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Recomendación:</span> Agrega al menos 3-5 palabras clave para mejorar la detección
                </p>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Estado
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-indigo-600"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-300">
                FAQ activa (visible para el chatbot)
              </label>
            </div>
            {!formData.active && (
              <p className="text-xs text-gray-300 mt-2">
                Las FAQs inactivas no serán utilizadas por el chatbot
              </p>
            )}
          </div>

          {/* Vista Previa */}
          <div className="card p-6 bg-indigo-50 border-indigo-200">
            <h4 className="text-lg font-heading font-bold text-white mb-3">
              Vista Previa del Chatbot
            </h4>
            <div className="space-y-3">
              {/* Mensaje del Usuario */}
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p className="text-sm">{formData.question || 'Pregunta del usuario...'}</p>
                </div>
              </div>
              {/* Respuesta del Bot */}
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 border border-indigo-200 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faRobot} className="text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600">Chatbot</span>
                  </div>
                  <p className="text-sm text-white">
                    {formData.answer || 'Respuesta del chatbot...'}
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
              className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {faq ? 'Guardar Cambios' : 'Crear FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
