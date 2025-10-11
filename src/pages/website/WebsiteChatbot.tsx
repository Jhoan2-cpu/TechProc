import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faTimes,
  faPaperPlane,
  faUser,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import type { ChatbotFAQ } from '../../modules/web/types';

interface WebsiteChatbotProps {
  faqs: ChatbotFAQ[];
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export const WebsiteChatbot = ({ faqs }: WebsiteChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      message: '¡Hola! Soy el asistente virtual de INCADEV. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (userMessage: string): ChatbotFAQ | null => {
    const normalizedMessage = userMessage.toLowerCase();

    // Buscar coincidencia exacta en preguntas
    let bestMatch = faqs.find(faq =>
      faq.active && faq.question.toLowerCase().includes(normalizedMessage)
    );

    // Si no hay coincidencia, buscar en keywords
    if (!bestMatch) {
      bestMatch = faqs.find(faq =>
        faq.active && faq.keywords.some(keyword =>
          normalizedMessage.includes(keyword.toLowerCase())
        )
      );
    }

    return bestMatch || null;
  };

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

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

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const matchedFAQ = findBestMatch(messageToSend);

      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        message: matchedFAQ
          ? matchedFAQ.answer
          : 'Lo siento, no tengo una respuesta específica para esa pregunta. ¿Podrías reformularla o elegir una de las preguntas sugeridas?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const popularQuestions = faqs
    .filter(faq => faq.active)
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 4);

  const categories = [...new Set(faqs.filter(f => f.active).map(f => f.category))];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 hover:scale-110 transition-all duration-300 z-50 ${
          isOpen ? 'rotate-180' : ''
        }`}
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
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

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
                      <p className="text-sm">{msg.message}</p>
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

            {/* Suggestions */}
            {showSuggestions && popularQuestions.length > 0 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm text-gray-400 font-medium">Preguntas frecuentes:</p>
                {popularQuestions.map((faq) => (
                  <button
                    key={faq.id_faq}
                    onClick={() => handleSendMessage(faq.question)}
                    className="w-full text-left p-3 bg-secondary-700/50 hover:bg-secondary-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-600/30"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && messages.length <= 1 && (
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
                      className="px-3 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full hover:bg-primary-600/30 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
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
                className="flex-1 px-4 py-2 bg-secondary-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
