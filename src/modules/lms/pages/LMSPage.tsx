import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faGraduationCap,
  faChalkboardTeacher,
  faCalendar,
  faBuilding,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { LMSStats, RecentCourse } from '../types';
import { RecentCourseCard } from '../components';
import {
  lmsService,
  instructorsService,
  companiesService,
  courseContentsService,
  academicPeriodsService,
} from '../services';

export const LMSPage = () => {
  const [stats, setStats] = useState<LMSStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [topInstructors, setTopInstructors] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [activePeriods, setActivePeriods] = useState<any[]>([]);
  const [totalContents, setTotalContents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar datos en paralelo
        const [
          statsData,
          coursesData,
          instructorsData,
          companiesData,
          periodsData,
        ] = await Promise.all([
          lmsService.getStats(),
          lmsService.getRecentCourses(),
          instructorsService.getAll({ limit: 5 }).catch(() => ({ instructors: [], pagination: null })),
          companiesService.getAll({ limit: 5 }).catch(() => ({ companies: [], pagination: null })),
          academicPeriodsService.getAll().catch(() => []),
        ]);

        setStats(statsData);
        setRecentCourses(coursesData);

        // Top instructores
        setTopInstructors(instructorsData.instructors.slice(0, 5));

        // Top compañías
        setTopCompanies(companiesData.companies.slice(0, 5));

        // Periodos activos
        setActivePeriods(periodsData.filter((p: any) => p.status === 'open').slice(0, 3));

        // Calcular total de contenidos
        const contents = await courseContentsService.getAll().catch(() => []);
        setTotalContents(contents.length);

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
          <p className="mt-4 text-gray-400">Cargando dashboard...</p>
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

  const mainStatCards = [
    {
      title: 'Total de Cursos',
      value: stats.total_courses,
      icon: faBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-900/20',
      textColor: 'text-blue-600',
      description: `${stats.published_courses} publicados`,
    },
    {
      title: 'Total de Estudiantes',
      value: stats.total_students,
      icon: faGraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-900/20',
      textColor: 'text-purple-600',
      description: 'Estudiantes registrados',
    },
    {
      title: 'Instructores',
      value: stats.total_instructors,
      icon: faChalkboardTeacher,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-900/20',
      textColor: 'text-green-600',
      description: 'Instructores activos',
    },
    {
      title: 'Contenidos',
      value: totalContents,
      icon: faFileAlt,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-900/20',
      textColor: 'text-orange-600',
      description: 'Recursos disponibles',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Dashboard LMS
        </h1>
        <p className="text-gray-400">
          Sistema de Gestión de Aprendizaje - Panel de Control
        </p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStatCards.map((stat, index) => (
          <div
            key={index}
            className="card p-6 animate-slide-up hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <FontAwesomeIcon icon={stat.icon} className={`text-2xl ${stat.textColor}`} />
                </div>
                <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Cursos Recientes */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-white">
                Cursos Recientes
              </h2>
            </div>
            <span className="text-sm text-gray-400">{recentCourses.length} cursos</span>
          </div>

          <div className="space-y-3">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <RecentCourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-3 opacity-50" />
                <p>No hay cursos recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Segunda Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Instructores */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-white">
              Instructores
            </h2>
          </div>

          <div className="space-y-3">
            {topInstructors.length > 0 ? (
              topInstructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex items-center gap-3 p-3 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{instructor.first_name} {instructor.last_name}</p>
                    <p className="text-xs text-gray-400 truncate">{instructor.expertise_area || 'Instructor'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    instructor.state === 'active' ? 'bg-success/20 text-green-700' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {instructor.state === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-3xl mb-2 opacity-50" />
                <p className="text-sm">No hay instructores</p>
              </div>
            )}
          </div>
        </div>

        {/* Periodos Académicos Activos */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendar} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-white">
              Periodos Activos
            </h2>
          </div>

          <div className="space-y-3">
            {activePeriods.length > 0 ? (
              activePeriods.map((period) => (
                <div
                  key={period.id}
                  className="p-4 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-medium">{period.name}</p>
                    <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-green-700">
                      Abierto
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon icon={faCalendar} className="text-3xl mb-2 opacity-50" />
                <p className="text-sm">No hay periodos activos</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Compañías */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-white">
              Compañías
            </h2>
          </div>

          <div className="space-y-3">
            {topCompanies.length > 0 ? (
              topCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 p-3 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{company.name}</p>
                    <p className="text-xs text-gray-400 truncate">{company.industry || 'Industria'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon icon={faBuilding} className="text-3xl mb-2 opacity-50" />
                <p className="text-sm">No hay compañías</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
