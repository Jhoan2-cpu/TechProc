import { useState, useEffect } from 'react';
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
import { lmsService } from '../services';

export const LMSPage = () => {
  const [stats, setStats] = useState<LMSStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, coursesData, enrollmentsData] = await Promise.all([
          lmsService.getStats(),
          lmsService.getRecentCourses(),
          lmsService.getRecentEnrollments(),
        ]);

        setStats(statsData);
        setRecentCourses(coursesData);
        setRecentEnrollments(enrollmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
        console.error('Error fetching LMS data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/20 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total de Cursos',
      value: stats.total_courses,
      icon: faBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-primary-900/20',
      textColor: 'text-blue-600',
    },
    {
      title: 'Cursos Publicados',
      value: stats.published_courses,
      icon: faCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-success/20',
      textColor: 'text-green-600',
    },
    {
      title: 'Total de Estudiantes',
      value: stats.total_students,
      icon: faGraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-900/20',
      textColor: 'text-purple-600',
    },
    {
      title: 'Inscripciones Activas',
      value: stats.active_enrollments,
      icon: faUsers,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-900/20',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Dashboard fsf
        </h1>
        <p className="text-gray-400">
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
              <div className="w-10 h-10 rounded-lg bg-primary-900/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-white">
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
              <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-white">
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
