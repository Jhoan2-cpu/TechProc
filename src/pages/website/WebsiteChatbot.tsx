import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faTimes,
  faPaperPlane,
  faUser,
  faChevronDown,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  startConversation,
  sendMessage,
  endConversation,
  getAllActiveFaqs,
  validateMessage,
  type ConversationFeedback
} from '../../services/chatbotService';

// ELIMINAR: No necesitamos la prop faqs ya que siempre cargamos desde el backend
interface WebsiteChatbotProps {} // ← Vacío, sin prop faqs

interface Message {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  source?: 'faq' | 'gemini' | 'fallback';
}

// ELIMINAR: No recibir faqs como prop
export const WebsiteChatbot = ({}: WebsiteChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ELIMINAR: Estado para FAQs locales, ahora solo usamos los de la BD
  const [faqs, setFaqs] = useState<ChatbotFAQ[]>([]); // ← Siempre vacío inicial, se carga desde BD
  
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar FAQs SOLO desde el backend cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      loadFaqs();
    }
  }, [isOpen]); // ← Solo cuando se abre el chat

  // Iniciar conversación cuando se abre el chat
  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen]);

  const loadFaqs = async () => {
    try {
      // ELIMINAR: No hay FAQs locales, siempre cargamos desde el backend
      const loadedFaqs = await getAllActiveFaqs();
      console.log('FAQs cargados desde BD:', loadedFaqs);
      setFaqs(loadedFaqs);
    } catch (err) {
      console.error('Error al cargar FAQs desde el backend:', err);
      setError('No se pudieron cargar las preguntas frecuentes');
      // IMPORTANTE: En caso de error, dejamos faqs como array vacío
      setFaqs([]);
    }
  };

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      const { conversationId: newConvId, welcomeMessage } = await startConversation();
      
      console.log('Conversación iniciada:', newConvId);
      setConversationId(newConvId);
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          message: welcomeMessage,
          timestamp: new Date()
        }
      ]);
      setError(null);
    } catch (err) {
      console.error('Error al iniciar conversación:', err);
      setError('No se pudo iniciar la conversación. Por favor, intenta nuevamente.');
      // Mensaje de bienvenida de respaldo
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          message: '¡Hola! Soy el asistente virtual de INCADEV. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    
    if (!messageToSend || !validateMessage(messageToSend)) {
      return;
    }

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      message: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);

    try {
      // Si no hay conversationId, iniciar una nueva
      let currentConvId = conversationId;
      if (!currentConvId) {
        const { conversationId: newConvId } = await startConversation();
        currentConvId = newConvId;
        setConversationId(newConvId);
      }

      // ELIMINADO: No hay búsqueda local, siempre usamos el backend
      // Enviar mensaje al backend
      const response = await sendMessage(messageToSend, currentConvId);

      // Agregar respuesta del bot
      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        message: response.response,
        timestamp: new Date(),
        source: response.source
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('No se pudo enviar el mensaje. Por favor, intenta nuevamente.');
      
      // Respuesta de error del bot
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        message: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = async () => {
    // Finalizar conversación en el backend si existe
    if (conversationId) {
      try {
        await endConversation(conversationId);
      } catch (err) {
        console.error('Error al finalizar conversación:', err);
      }
    }

    setIsOpen(false);
    // Resetear estado para la próxima vez que se abra
    setTimeout(() => {
      setMessages([]);
      setConversationId(null);
      setShowSuggestions(true);
      setError(null);
      // ELIMINAR: No reseteamos faqs para no perder los datos cargados
    }, 300);
  };

  // ELIMINADO: No hay FAQs locales, solo usamos los de la BD
  // Usar SOLO FAQs cargados desde el backend
  const popularQuestions = faqs
    .filter(faq => faq.active)
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 4);

  const categories = [...new Set(
    faqs
      .filter(f => f.active && f.category)
      .map(f => f.category)
  )];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 hover:scale-110 transition-all duration-300 z-50 ${
          isOpen ? 'rotate-180' : ''
        }`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faRobot} className="text-2xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-2xl border border-primary-500/30 z-50 flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Asistente INCADEV</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-white/80">En línea</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar chat"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-500/20 border-b border-red-500/30">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-primary-600'
                      : 'bg-secondary-700'
                  }`}>
                    <FontAwesomeIcon
                      icon={msg.sender === 'user' ? faUser : faRobot}
                      className="text-white text-sm"
                    />
                  </div>
                  <div>
                    <div className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-700 text-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      {msg.source && msg.sender === 'bot' && (
                        <span className="text-xs opacity-60 mt-1 block">
                          {msg.source === 'faq' && '📚 FAQ'}
                          {msg.source === 'gemini' && '🤖 AI'}
                          {msg.source === 'fallback' && '💬 Respuesta general'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary-700">
                    <FontAwesomeIcon icon={faRobot} className="text-white text-sm" />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary-700 text-gray-200">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span className="ml-2 text-sm">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions - SOLO si hay FAQs cargados desde BD */}
            {showSuggestions && popularQuestions.length > 0 && !isLoading && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm text-gray-400 font-medium">Preguntas frecuentes:</p>
                {popularQuestions.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSendMessage(faq.question)}
                    disabled={isLoading}
                    className="w-full text-left p-3 bg-secondary-700/50 hover:bg-secondary-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            {/* Categories - SOLO si hay FAQs cargados desde BD */}
            {categories.length > 0 && messages.length <= 1 && !isLoading && (
              <div className="space-y-2 mt-4 animate-fade-in">
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  Categorías:
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleSendMessage(`¿Información sobre ${category}?`)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full hover:bg-primary-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay FAQs cargados */}
            {showSuggestions && faqs.length === 0 && !isLoading && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No hay preguntas frecuentes disponibles en este momento.</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-secondary-400 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                maxLength={1000}
                className="flex-1 px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <FontAwesomeIcon icon={isLoading ? faSpinner : faPaperPlane} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {inputMessage.length}/1000 caracteres
            </p>
          </div>
        </div>
      )}
    </>
  );
};