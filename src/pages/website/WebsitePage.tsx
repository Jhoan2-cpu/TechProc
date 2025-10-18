import { WebsiteNavbar } from './WebsiteNavbar';
import { WebsiteHero } from './WebsiteHero';
import { WebsiteNews } from './WebsiteNews';
import { WebsiteAnnouncements } from './WebsiteAnnouncements';
import { WebsiteContact } from './WebsiteContact';
import { WebsiteChatbot } from './WebsiteChatbot';
import { WebsiteFooter } from './WebsiteFooter';
import type { News, Alert, ChatbotFAQ } from '../../modules/web/types';

// Mock Data
const mockAlerts: Alert[] = [
  {
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

const mockFAQs: ChatbotFAQ[] = [
  {
    id_faq: 1,
    question: '¿Cuáles son los requisitos para inscribirme?',
    answer: 'Los requisitos básicos son: tener acceso a internet, una computadora con especificaciones mínimas, y disposición para aprender. Algunos cursos avanzados pueden requerir conocimientos previos específicos.',
    category: 'Admisión',
    keywords: ['requisitos', 'inscripción', 'inscribirse', 'admisión'],
    active: true,
    usage_count: 450,
    created_date: '2024-01-01',
    updated_date: null
  },
  {
    id_faq: 2,
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias, y pagos en línea a través de plataformas seguras. También ofrecemos planes de financiamiento sin intereses.',
    category: 'Pagos',
    keywords: ['pago', 'precio', 'costo', 'tarjeta', 'financiamiento'],
    active: true,
    usage_count: 380,
    created_date: '2024-01-01',
    updated_date: null
  },
  {
    id_faq: 3,
    question: '¿Los certificados tienen validez internacional?',
    answer: 'Sí, nuestros certificados son reconocidos internacionalmente. Además, ofrecemos preparación para certificaciones oficiales de empresas como Microsoft, AWS, Google, y otras.',
    category: 'Certificación',
    keywords: ['certificado', 'validez', 'internacional', 'reconocimiento'],
    active: true,
    usage_count: 320,
    created_date: '2024-01-01',
    updated_date: null
  },
  {
    id_faq: 4,
    question: '¿Cuál es la duración de los cursos?',
    answer: 'La duración varía según el programa. Los cursos regulares duran entre 8 y 16 semanas, mientras que los bootcamps intensivos pueden completarse en 12 semanas. Todos incluyen acceso de por vida al material.',
    category: 'Cursos',
    keywords: ['duración', 'tiempo', 'semanas', 'cuánto dura'],
    active: true,
    usage_count: 290,
    created_date: '2024-01-01',
    updated_date: null
  },
  {
    id_faq: 5,
    question: '¿Ofrecen becas o descuentos?',
    answer: 'Sí, contamos con un programa de becas para estudiantes destacados y descuentos por pronto pago, grupos, y situaciones especiales. Contáctanos para más información sobre las oportunidades disponibles.',
    category: 'Financiamiento',
    keywords: ['beca', 'descuento', 'financiamiento', 'ayuda económica'],
    active: true,
    usage_count: 275,
    created_date: '2024-01-01',
    updated_date: null
  },
  {
    id_faq: 6,
    question: '¿Puedo estudiar mientras trabajo?',
    answer: 'Absolutamente. Nuestros programas están diseñados para personas que trabajan. Las clases son en horarios flexibles, con acceso 24/7 al material grabado, y puedes estudiar a tu propio ritmo.',
    category: 'Modalidad',
    keywords: ['trabajo', 'horario', 'flexible', 'tiempo'],
    active: true,
    usage_count: 260,
    created_date: '2024-01-01',
    updated_date: null
  }
];

export const WebsitePage = () => {
  return (
    <div className="bg-gradient-to-br from-dark-600 to-smoky-700 min-h-screen">
      <WebsiteNavbar />
      <WebsiteHero activeAlerts={mockAlerts} />
      <WebsiteNews news={mockNews} />
      <WebsiteAnnouncements />
      <WebsiteContact />
      <WebsiteFooter />
      <WebsiteChatbot faqs={mockFAQs} />
    </div>
  );
};
