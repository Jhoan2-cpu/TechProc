import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faCog, faSync } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ, ChatbotConfig } from '../types';
import { ChatbotFAQCard, FAQFormModal, DeleteFAQModal, ChatbotConfigModal } from '../components';
import { chatbotFAQsService, chatbotService } from '../services';

export const ChatbotPage = () => {
  const [faqs, setFaqs] = useState<ChatbotFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFAQFormModal, setShowFAQFormModal] = useState(false);
  const [showDeleteFAQModal, setShowDeleteFAQModal] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<ChatbotFAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<ChatbotFAQ | null>(null);
  const [showChatbotConfigModal, setShowChatbotConfigModal] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>({
    enabled: true,
    greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
    fallback_message: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
    response_delay: 1000,
    max_conversations_per_day: 1000,
    contact_threshold: 3,
  });
  const [conversationsToday, setConversationsToday] = useState(0);
  const [configLoading, setConfigLoading] = useState(false);

  // Cargar FAQs desde la API
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { faqs: faqsData } = await chatbotFAQsService.getAll();
      setFaqs(faqsData);
    } catch (err: any) {
      console.error('Error al cargar FAQs:', err);
      setError(err.message || 'Error al cargar las FAQs');
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración del chatbot
  const fetchChatbotConfig = async () => {
    try {
      setConfigLoading(true);
      const config = await chatbotService.getConfig();
      setChatbotConfig(config);
    } catch (err: any) {
      console.error('Error al cargar configuración del chatbot:', err);
      setError('Error al cargar la configuración del chatbot');
    } finally {
      setConfigLoading(false);
    }
  };

  // Cargar estadísticas del chatbot
  const fetchChatbotStats = async () => {
    try {
      const analytics = await chatbotService.getAnalytics();
      setConversationsToday(analytics.conversations_today || 0);
    } catch (err: any) {
      console.error('Error al cargar estadísticas del chatbot:', err);
      // No mostramos error aquí para no interrumpir la experiencia
    }
  };

  // Verificar salud del servicio
  const checkHealthStatus = async () => {
    try {
      const health = await chatbotService.getHealthStatus();
      console.log('Estado del chatbot:', health);
    } catch (err: any) {
      console.error('Error en health check:', err);
    }
  };

  useEffect(() => {
    fetchFAQs();
    fetchChatbotConfig();
    fetchChatbotStats();
    checkHealthStatus();
  }, []);

  const handleNewFAQ = () => {
    setFaqToEdit(null);
    setShowFAQFormModal(true);
  };

  const handleEditFAQ = (faq: ChatbotFAQ) => {
    setFaqToEdit(faq);
    setShowFAQFormModal(true);
  };

  const handleDeleteFAQ = (faq: ChatbotFAQ) => {
    setFaqToDelete(faq);
    setShowDeleteFAQModal(true);
  };

  const handleToggleFAQActive = async (faq: ChatbotFAQ) => {
    try {
      await chatbotFAQsService.update(faq.id, { active: !faq.active });
      await fetchFAQs(); // Recargar la lista
    } catch (err: any) {
      console.error('Error al cambiar estado de FAQ:', err);
      alert('Error al cambiar el estado de la FAQ');
    }
  };

  const handleSaveFAQ = async (faqData: Partial<ChatbotFAQ>) => {
    try {
      if (faqToEdit) {
        await chatbotFAQsService.update(faqToEdit.id, {
          ...faqData,
          updated_date: new Date().toISOString().split('T')[0]
        });
      } else {
        await chatbotFAQsService.create({
          ...faqData,
          usage_count: 0,
          created_date: new Date().toISOString().split('T')[0],
          updated_date: null,
        });
      }
      setShowFAQFormModal(false);
      setFaqToEdit(null);
      await fetchFAQs(); // Recargar la lista
    } catch (err: any) {
      console.error('Error al guardar FAQ:', err);
      alert('Error al guardar la FAQ');
    }
  };

  const handleConfirmDeleteFAQ = async () => {
    if (faqToDelete) {
      try {
        await chatbotFAQsService.delete(faqToDelete.id);
        setShowDeleteFAQModal(false);
        setFaqToDelete(null);
        await fetchFAQs(); // Recargar la lista
      } catch (err: any) {
        console.error('Error al eliminar FAQ:', err);
        alert('Error al eliminar la FAQ');
      }
    }
  };

  const handleOpenChatbotConfig = () => {
    setShowChatbotConfigModal(true);
  };

  const handleSaveChatbotConfig = async (config: ChatbotConfig) => {
    try {
      await chatbotService.updateConfig(config);
      setChatbotConfig(config);
      setShowChatbotConfigModal(false);
      alert('Configuración guardada exitosamente');
    } catch (err: any) {
      console.error('Error al guardar configuración:', err);
      alert('Error al guardar la configuración');
    }
  };

  const handleResetConfig = async () => {
    if (confirm('¿Estás seguro de que quieres resetear la configuración a los valores por defecto?')) {
      try {
        await chatbotService.resetConfig();
        await fetchChatbotConfig(); // Recargar la configuración
        alert('Configuración reseteada exitosamente');
      } catch (err: any) {
        console.error('Error al resetear configuración:', err);
        alert('Error al resetear la configuración');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión del Chatbot</h2>
        <div className="flex gap-2">
          <button
            onClick={handleResetConfig}
            className="btn bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
            title="Resetear configuración"
          >
            <FontAwesomeIcon icon={faSync} />
            Resetear
          </button>
          <button
            onClick={handleOpenChatbotConfig}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCog} />
            Configuración
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="card p-6 bg-success/20 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-success mb-1">Estado del Chatbot</h3>
            <p className="text-sm text-green-700">
              {chatbotConfig.enabled 
                ? 'El chatbot está activo y respondiendo consultas' 
                : 'El chatbot está desactivado'
              }
            </p>
            {configLoading && (
              <p className="text-xs text-green-700 mt-1">
                <FontAwesomeIcon icon={faSync} className="animate-spin mr-1" />
                Actualizando configuración...
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-green-700">Conversaciones hoy</p>
              <p className="text-2xl font-bold text-success">{conversationsToday}</p>
              <p className="text-xs text-green-700">
                Límite: {chatbotConfig.max_conversations_per_day}
              </p>
            </div>
            <button className={`btn ${chatbotConfig.enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}>
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              {chatbotConfig.enabled ? 'Activo' : 'Inactivo'}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-bold text-white">Preguntas Frecuentes</h3>
          <button
            onClick={handleNewFAQ}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay FAQs para mostrar.</p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <ChatbotFAQCard
                key={faq.id}
                faq={faq}
                index={index}
                onEdit={handleEditFAQ}
                onDelete={handleDeleteFAQ}
                onToggleActive={handleToggleFAQActive}
              />
            ))
          )}
        </div>
      </div>

      <FAQFormModal
        isOpen={showFAQFormModal}
        faq={faqToEdit}
        onSave={handleSaveFAQ}
        onCancel={() => {
          setShowFAQFormModal(false);
          setFaqToEdit(null);
        }}
      />

      <DeleteFAQModal
        isOpen={showDeleteFAQModal}
        faq={faqToDelete}
        onConfirm={handleConfirmDeleteFAQ}
        onCancel={() => {
          setShowDeleteFAQModal(false);
          setFaqToDelete(null);
        }}
      />

      <ChatbotConfigModal
        isOpen={showChatbotConfigModal}
        config={chatbotConfig}
        onSave={handleSaveChatbotConfig}
        onCancel={() => setShowChatbotConfigModal(false)}
      />
    </div>
  );
};