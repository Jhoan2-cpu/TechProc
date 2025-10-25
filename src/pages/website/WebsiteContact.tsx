import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faCheckCircle,
  faGraduationCap,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import { websiteService } from '../../services/websiteService';

export const WebsiteContact = () => {
  const [showEnrollmentMessage, setShowEnrollmentMessage] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    form_type: 'general'
  });

  // Detectar si viene desde inscripción
  useEffect(() => {
    const checkEnrollmentIntent = () => {
      const hash = window.location.hash;
      if (hash === '#contact-enrollment') {
        setShowEnrollmentMessage(true);
        setFormData(prev => ({
          ...prev,
          subject: 'Inscripción a curso',
          form_type: 'enrollment'
        }));

        // Hacer scroll suave a la sección de contacto
        setTimeout(() => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

        // Ocultar el mensaje después de 10 segundos
        setTimeout(() => {
          setShowEnrollmentMessage(false);
        }, 10000);
      }
    };

    checkEnrollmentIntent();

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', checkEnrollmentIntent);
    return () => window.removeEventListener('hashchange', checkEnrollmentIntent);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await websiteService.submitContactForm({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        subject: formData.subject,
        message: formData.message,
        form_type: formData.form_type,
      });

      if (response.success) {
        setSuccessMessage(response.message);
        setIsSuccess(true);

        // Resetear formulario
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          form_type: 'general'
        });

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al enviar el formulario. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-dark-600/50 to-smoky-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 shadow-lg shadow-green-500/30">
            <FontAwesomeIcon icon={faEnvelope} className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <p className="text-gray-400">contacto@incadev.edu.pe</p>
                  <p className="text-gray-400">admision@incadev.edu.pe</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="text-green-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Teléfono</h3>
                  <p className="text-gray-400">+51 999 999 999</p>
                  <p className="text-gray-400">+51 888 888 888</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ubicación</h3>
                  <p className="text-gray-400">Lima, Perú</p>
                  <p className="text-gray-400">100% Online</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-gradient-to-br from-primary-600/20 to-primary-700/20 border border-primary-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Horario de Atención</h3>
              <div className="space-y-2 text-gray-400">
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábados: 10:00 AM - 2:00 PM</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl p-8">
            {/* Mensaje de inscripción */}
            {showEnrollmentMessage && (
              <div className="mb-6 bg-gradient-to-r from-primary-500/20 via-orange-500/20 to-primary-500/20 border-2 border-primary-500/50 rounded-xl p-6 animate-pulse-slow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faRocket} className="text-primary-400" />
                      <h3 className="text-xl font-bold text-white">
                        ¡Excelente decisión!
                      </h3>
                    </div>
                    <p className="text-gray-200 leading-relaxed mb-2">
                      ¿Quieres que te ayudemos con la inscripción? Completa el formulario y un asesor se pondrá en contacto contigo en menos de 24 horas.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                        Respuesta rápida
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                        Asesoría gratuita
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                        Sin compromiso
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSuccess ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gray-400">
                  {successMessage || 'Gracias por contactarnos. Te responderemos pronto.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg animate-fade-in">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="input w-full"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input w-full"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input w-full"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa / Institución
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input w-full"
                    placeholder="Tech Solutions SAC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Asunto <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input w-full"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input w-full"
                    rows={6}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
