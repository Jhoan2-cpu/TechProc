import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faUsers,
  faCheckCircle,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { LMSStats, RecentCourse, RecentEnrollment } from '../types';
import {
  LMSStatsCard,
  RecentCourseCard,
  RecentEnrollmentCard,
} from '../components';

// Datos mock (luego conectar con backend)
const mockStats: LMSStats = {
  total_courses: 45,
  published_courses: 38,
  draft_courses: 7,
  total_students: 1250,
  active_enrollments: 3420,
  total_instructors: 28,
};

const mockRecentCourses: RecentCourse[] = [
  {
    id: '1',
    title: 'Desarrollo Web Full Stack',
    code: 'WEB-101',
    instructor_name: 'Juan Pérez',
    status: 'publicado',
    created_at: '2024-03-15',
  },
  {
    id: '2',
    title: 'Inteligencia Artificial',
    code: 'IA-201',
    instructor_name: 'María González',
    status: 'publicado',
    created_at: '2024-03-14',
  },
  {
    id: '3',
    title: 'Diseño UX/UI',
    code: 'DIS-150',
    instructor_name: 'Carlos Ruiz',
    status: 'borrador',
    created_at: '2024-03-13',
  },
];

const mockRecentEnrollments: RecentEnrollment[] = [
  {
    id: '1',
    student_name: 'Ana Torres',
    student_email: 'ana.torres@email.com',
    course_title: 'Desarrollo Web Full Stack',
    enrolled_at: '2024-03-15 10:30',
  },
  {
    id: '2',
    student_name: 'Pedro Sánchez',
    student_email: 'pedro.sanchez@email.com',
    course_title: 'Inteligencia Artificial',
    enrolled_at: '2024-03-15 09:15',
  },
  {
    id: '3',
    student_name: 'Laura Martínez',
    student_email: 'laura.martinez@email.com',
    course_title: 'Diseño UX/UI',
    enrolled_at: '2024-03-14 16:45',
  },
];

export const LMSPage = () => {
  const [stats] = useState<LMSStats>(mockStats);
  const [recentCourses] = useState<RecentCourse[]>(mockRecentCourses);
  const [recentEnrollments] = useState<RecentEnrollment[]>(mockRecentEnrollments);

  const statCards = [
    {
      title: 'Total de Cursos',
      value: stats.total_courses,
      icon: faBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Cursos Publicados',
      value: stats.published_courses,
      icon: faCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total de Estudiantes',
      value: stats.total_students,
      icon: faGraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Inscripciones Activas',
      value: stats.active_enrollments,
      icon: faUsers,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">
          Dashboard LMS
        </h1>
        <p className="text-secondary-600">
          Sistema de Gestión de Aprendizaje
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <LMSStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Grid de Cursos y Estudiantes Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos Recientes */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-secondary-900">
                Cursos Recientes
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {recentCourses.map((course) => (
              <RecentCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Inscripciones Recientes */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-secondary-900">
                Inscripciones Recientes
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <RecentEnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
