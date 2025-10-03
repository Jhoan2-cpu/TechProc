import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBookOpen,
  faUsers,
  faCheckCircle,
  faGraduationCap,
  faChalkboardTeacher,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { LMSStats, RecentCourse, RecentEnrollment } from '../types';

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

  const getStatusBadge = (status: string) => {
    const styles = {
      publicado: 'bg-green-100 text-green-700',
      borrador: 'bg-yellow-100 text-yellow-700',
      archivado: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.borrador;
  };

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
          <div
            key={index}
            className="card p-6 animate-slide-up hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-2xl" />
              </div>
              <FontAwesomeIcon icon={faChartLine} className="text-secondary-400" />
            </div>
            <h3 className="text-sm font-medium text-secondary-600 mb-1">{stat.title}</h3>
            <p className="text-3xl font-heading font-bold text-secondary-900">{stat.value}</p>
          </div>
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
              <div
                key={course.id}
                className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      Código: {course.code}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary-500 mt-3">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                    {course.instructor_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} />
                    {new Date(course.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
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
              <div
                key={enrollment.id}
                className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {enrollment.student_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 text-sm mb-1">
                      {enrollment.student_name}
                    </h3>
                    <p className="text-xs text-secondary-600 mb-1">
                      {enrollment.student_email}
                    </p>
                    <p className="text-xs text-secondary-700 font-medium">
                      → {enrollment.course_title}
                    </p>
                    <p className="text-xs text-secondary-500 mt-2">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {new Date(enrollment.enrolled_at).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
