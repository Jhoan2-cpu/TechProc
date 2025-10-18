import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faCog } from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../types';
import { ChatbotFAQCard, FAQFormModal, DeleteFAQModal, ChatbotConfigModal } from '../components';
import { mockChatbotFAQs } from '../../../services/mockData';

export const ChatbotPage = () => {
  const [faqs, setFaqs] = useState(mockChatbotFAQs);
  const [showFAQFormModal, setShowFAQFormModal] = useState(false);
  const [showDeleteFAQModal, setShowDeleteFAQModal] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<ChatbotFAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<ChatbotFAQ | null>(null);
  const [showChatbotConfigModal, setShowChatbotConfigModal] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState({
    enabled: true,
    greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
    fallback_message: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?',
    response_delay: 1000,
    max_conversations_per_day: 1000,
    contact_threshold: 3,
  });

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

  const handleToggleFAQActive = (faq: ChatbotFAQ) => {
    const updatedFAQs = faqs.map(f =>
      f.id_faq === faq.id_faq ? { ...f, active: !f.active } : f
    );
    setFaqs(updatedFAQs);
  };

  const handleSaveFAQ = (faqData: Partial<ChatbotFAQ>) => {
    if (faqToEdit) {
      const updatedFAQs = faqs.map(f =>
        f.id_faq === faqToEdit.id_faq
          ? { ...f, ...faqData, updated_date: new Date().toISOString().split('T')[0] }
          : f
      );
      setFaqs(updatedFAQs);
    } else {
      const newFAQ: ChatbotFAQ = {
        id_faq: Date.now(),
        ...faqData as Omit<ChatbotFAQ, 'id_faq'>,
        usage_count: 0,
        created_date: new Date().toISOString().split('T')[0],
        updated_date: null,
      };
      setFaqs([newFAQ, ...faqs]);
    }
    setShowFAQFormModal(false);
    setFaqToEdit(null);
  };

  const handleConfirmDeleteFAQ = () => {
    if (faqToDelete) {
      setFaqs(faqs.filter(f => f.id_faq !== faqToDelete.id_faq));
      setShowDeleteFAQModal(false);
      setFaqToDelete(null);
    }
  };

  const handleOpenChatbotConfig = () => {
    setShowChatbotConfigModal(true);
  };

  const handleSaveChatbotConfig = (config: typeof chatbotConfig) => {
    setChatbotConfig(config);
    setShowChatbotConfigModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión del Chatbot</h2>
        <button
          onClick={handleOpenChatbotConfig}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faCog} />
          Configuración
        </button>
      </div>

      <div className="card p-6 bg-success/20 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-success mb-1">Estado del Chatbot</h3>
            <p className="text-sm text-green-700">El chatbot está activo y respondiendo consultas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-green-700">Conversaciones hoy</p>
              <p className="text-2xl font-bold text-success">24</p>
            </div>
            <button className="btn bg-green-600 hover:bg-green-700 text-white">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Activo
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
          {faqs.map((faq, index) => (
            <ChatbotFAQCard
              key={faq.id_faq}
              faq={faq}
              index={index}
              onEdit={handleEditFAQ}
              onDelete={handleDeleteFAQ}
              onToggleActive={handleToggleFAQActive}
            />
          ))}
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
