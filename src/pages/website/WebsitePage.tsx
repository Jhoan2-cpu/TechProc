import { useState, useEffect } from 'react';
import { WebsiteNavbar } from './WebsiteNavbar';
import { WebsiteHero } from './WebsiteHero';
import { WebsiteNews } from './WebsiteNews';
import { WebsiteAnnouncements } from './WebsiteAnnouncements';
import { WebsiteContact } from './WebsiteContact';
import { WebsiteChatbot } from './WebsiteChatbot';
import { WebsiteFooter } from './WebsiteFooter';
import type { News, Alert } from '../../modules/web/types';
import { alertsService } from '../../modules/web/services/webService';

// Mock Data
const mockAlerts: Alert[] = [
  {
    id: 1,
    id_alert: 1,
    message: '¡Inscripciones abiertas para el curso de Python Avanzado! Cupos limitados.',
    type: 'info',
    status: 'active',
    link_url: '#contact',
    link_text: 'Inscríbete ahora',
    start_date: '2024-01-01',
    end_date: null,
    priority: 1,
    created_by: 1,
    created_date: '2024-01-01'
  },
  {
    id: 2,
    id_alert: 2,
    message: 'Descuento del 20% en todos los cursos por tiempo limitado',
    type: 'success',
    status: 'active',
    link_url: '#contact',
    link_text: 'Ver más',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    priority: 2,
    created_by: 1,
    created_date: '2024-01-01'
  }
];

const mockNews: News[] = [
  {
    id: 1,
    id_news: 1,
    title: 'INCADEV lanza nuevo programa de Inteligencia Artificial',
    slug: 'nuevo-programa-ia',
    summary: 'Descubre nuestro innovador programa de IA con certificación internacional y proyectos prácticos.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Educación',
    tags: ['IA', 'Machine Learning', 'Tecnología'],
    status: 'published',
    views: 1250,
    published_date: '2024-03-15',
    created_date: '2024-03-15',
    updated_date: null
  },
  {
    id: 2,
    id_news: 2,
    title: 'Estudiantes de INCADEV ganan hackathon nacional',
    slug: 'hackathon-nacional',
    summary: 'Nuestros estudiantes destacaron en la competencia nacional de programación con un proyecto innovador.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Logros',
    tags: ['Hackathon', 'Estudiantes', 'Competencia'],
    status: 'published',
    views: 890,
    published_date: '2024-03-10',
    created_date: '2024-03-10',
    updated_date: null
  },
  {
    id: 3,
    id_news: 3,
    title: 'Convenio internacional con universidades de tecnología',
    slug: 'convenio-internacional',
    summary: 'INCADEV firma convenio con prestigiosas universidades para ofrecer dobles certificaciones.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Alianzas',
    tags: ['Convenio', 'Internacional', 'Certificación'],
    status: 'published',
    views: 756,
    published_date: '2024-03-08',
    created_date: '2024-03-08',
    updated_date: null
  },
  {
    id: 4,
    id_news: 4,
    title: 'Webinar gratuito: Introducción al Cloud Computing',
    slug: 'webinar-cloud',
    summary: 'Únete a nuestro webinar gratuito sobre los fundamentos de Cloud Computing y AWS.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Eventos',
    tags: ['Webinar', 'Cloud', 'AWS'],
    status: 'published',
    views: 634,
    published_date: '2024-03-05',
    created_date: '2024-03-05',
    updated_date: null
  },
  {
    id: 5,
    id_news: 5,
    title: 'Nuevas becas disponibles para estudiantes destacados',
    slug: 'becas-disponibles',
    summary: 'Conoce los requisitos y beneficios de nuestro programa de becas 2024.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Becas',
    tags: ['Becas', 'Estudiantes', 'Financiamiento'],
    status: 'published',
    views: 1120,
    published_date: '2024-03-01',
    created_date: '2024-03-01',
    updated_date: null
  },
  {
    id: 6,
    id_news: 6,
    title: 'Actualización de plataforma LMS con nuevas funcionalidades',
    slug: 'actualizacion-lms',
    summary: 'Descubre las nuevas características de nuestra plataforma de aprendizaje.',
    content: 'Contenido completo de la noticia...',
    featured_image: null,
    author_id: 1,
    author_name: 'Admin',
    category: 'Tecnología',
    tags: ['LMS', 'Plataforma', 'Actualización'],
    status: 'published',
    views: 543,
    published_date: '2024-02-28',
    created_date: '2024-02-28',
    updated_date: null
  }
];

// Los announcements ahora se obtienen directamente desde la API en el componente WebsiteAnnouncements
// Los FAQs del chatbot ahora se obtienen directamente desde la API en el componente WebsiteChatbot

export const WebsitePage = () => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar alertas activas desde el endpoint público (sin autenticación)
        const alerts = await alertsService.getPublicAlerts();

        // El backend ya devuelve solo las alertas activas y válidas
        // Ordenar por prioridad (menor número = mayor prioridad)
        const sortedAlerts = alerts.sort((a, b) =>
          (a.priority || 999) - (b.priority || 999)
        );

        setActiveAlerts(sortedAlerts);

      } catch (error) {
        console.error('Error al cargar alertas públicas:', error);
        // En caso de error, usar las alertas mock como fallback
        setActiveAlerts(mockAlerts);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-dark-600 to-smoky-700 min-h-screen">
      <WebsiteNavbar />
      <WebsiteHero activeAlerts={activeAlerts} />
      <WebsiteNews news={mockNews} />
      <WebsiteAnnouncements />
      <WebsiteContact />
      <WebsiteFooter />
      <WebsiteChatbot />
    </div>
  );
};
