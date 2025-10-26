import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPlug,
  faCheckCircle,
  faTimesCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { apiRequest } from '../../services/api.config';

export const WebsiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState<string>('');

  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('');

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        timestamp: string;
      }>('/test-public', {
        method: 'GET',
      });

      if (response.success) {
        setConnectionStatus('success');
        setConnectionMessage(response.message);
        setTimeout(() => {
          setConnectionStatus('idle');
          setConnectionMessage('');
        }, 5000);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setConnectionMessage(error.message || 'Error al conectar con el servidor');
      setTimeout(() => {
        setConnectionStatus('idle');
        setConnectionMessage('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-secondary-700 to-secondary-800 border-t border-primary-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gradient">INCADEV</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Instituto de Capacitación y Desarrollo Virtual. Formamos profesionales en tecnología con los más altos estándares de calidad.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-secondary-600 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-600 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faYoutube} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Noticias
                </a>
              </li>
              <li>
                <a href="#announcements" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Anuncios
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Contacto
                </a>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Portal de Estudiantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4">Programas</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Desarrollo Web
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Data Science
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Ciberseguridad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Cloud Computing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Inteligencia Artificial
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">contacto@incadev.edu.pe</p>
                  <p className="text-gray-400 text-sm">admision@incadev.edu.pe</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-primary-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">+51 999 999 999</p>
                  <p className="text-gray-400 text-sm">+51 888 888 888</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Lima, Perú</p>
                  <p className="text-gray-400 text-sm">100% Online</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {currentYear} INCADEV. Todos los derechos reservados.
              </p>

              {/* Botón de prueba de conexión */}
              <button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2
                  ${connectionStatus === 'idle' ? 'bg-secondary-600 hover:bg-secondary-500 text-gray-300' : ''}
                  ${connectionStatus === 'testing' ? 'bg-blue-600 text-white cursor-wait' : ''}
                  ${connectionStatus === 'success' ? 'bg-green-600 text-white' : ''}
                  ${connectionStatus === 'error' ? 'bg-red-600 text-white' : ''}
                `}
                title="Probar conexión con el servidor"
              >
                <FontAwesomeIcon
                  icon={
                    connectionStatus === 'testing' ? faSpinner :
                    connectionStatus === 'success' ? faCheckCircle :
                    connectionStatus === 'error' ? faTimesCircle :
                    faPlug
                  }
                  className={connectionStatus === 'testing' ? 'animate-spin' : ''}
                />
                <span>
                  {connectionStatus === 'idle' && 'Test API'}
                  {connectionStatus === 'testing' && 'Conectando...'}
                  {connectionStatus === 'success' && 'Conectado'}
                  {connectionStatus === 'error' && 'Error'}
                </span>
              </button>
            </div>

            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Libro de Reclamaciones
              </a>
            </div>
          </div>

          {/* Mensaje de estado de conexión */}
          {connectionMessage && (
            <div className="mt-4 text-center">
              <p className={`text-xs ${connectionStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {connectionMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
