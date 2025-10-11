import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export const WebsiteNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-secondary-600/95 to-secondary-700/95 backdrop-blur-md shadow-xl border-b border-primary-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gradient">INCADEV</h1>
              <p className="text-xs text-gray-300 leading-tight">Instituto de Capacitación y Desarrollo Virtual</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Noticias
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Anuncios
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Contacto
            </button>
            <a
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium"
            >
              Ingresar
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Noticias
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Anuncios
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-secondary-500/50 rounded-lg transition-colors"
            >
              Contacto
            </button>
            <a
              href="/login"
              className="block w-full text-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg font-medium mt-4"
            >
              Ingresar
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};
