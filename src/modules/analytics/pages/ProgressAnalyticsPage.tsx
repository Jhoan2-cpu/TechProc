import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faExclamationTriangle,
  faGraduationCap,
  faChartLine,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAllStudentsProgress,
  getCompletionRate,
} from '../services';
import type {
  StudentProgressData,
  GroupCompletionRate,
  CompletionRateOverall,
  ProgressLevelType,
} from '../types';
import { StudentProgressCard } from '../components';

export const ProgressAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentProgressData[]>([]);
  const [completionData, setCompletionData] = useState<GroupCompletionRate[]>([]);
  const [completionOverall, setCompletionOverall] = useState<CompletionRateOverall | null>(null);

  const [filterCourse, setFilterCourse] = useState<number | 'all'>('all');
  const [filterProgress, setFilterProgress] = useState<ProgressLevelType | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [studentsResponse, completionResponse] = await Promise.all([
        getAllStudentsProgress(),
        getCompletionRate(),
      ]);

      setStudents(studentsResponse.data);
      setCompletionData(completionResponse.data);
      setCompletionOverall(completionResponse.overall);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de progreso');
      console.error('Error loading progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesCourse = filterCourse === 'all' || student.course_id === filterCourse;
    const matchesProgress = filterProgress === 'all' || student.progress_level === filterProgress;
    return matchesCourse && matchesProgress;
  });

  const uniqueCourses = Array.from(
    new Set(students.map((s) => JSON.stringify({ id: s.course_id, title: s.course_title })))
  ).map((s) => JSON.parse(s));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-400 mb-4" />
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">Análisis de Progreso Académico</h2>
      </div>

      {/* Overall Statistics */}
      {completionOverall && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faUserGraduate} className="text-2xl text-blue-400" />
              <span className="text-2xl font-bold text-white">{completionOverall.total_students}</span>
            </div>
            <p className="text-sm text-gray-400">Total Estudiantes</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faGraduationCap} className="text-2xl text-green-400" />
              <span className="text-2xl font-bold text-white">{completionOverall.total_groups}</span>
            </div>
            <p className="text-sm text-gray-400">Total Grupos</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl text-primary-400" />
              <span className="text-2xl font-bold text-white">{completionOverall.avg_completion_rate.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-gray-400">Tasa de Completación</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-400" />
              <span className="text-2xl font-bold text-white">{completionOverall.avg_dropout_rate.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-gray-400">Tasa de Deserción</p>
          </div>
        </div>
      )}

      {/* Completion Rate by Group */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Tasa de Completación por Grupo</h3>
        <div className="space-y-3">
          {completionData.map((group) => (
            <div key={group.group_id} className="bg-secondary-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-white">{group.group_name}</h4>
                  <p className="text-sm text-gray-400">{group.course_title}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  group.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                  group.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                  group.status === 'needs_attention' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {group.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-400">Total:</span>
                  <span className="ml-2 text-white font-medium">{group.total_students}</span>
                </div>
                <div>
                  <span className="text-gray-400">Completado:</span>
                  <span className="ml-2 text-green-400 font-medium">{group.completed_students}</span>
                </div>
                <div>
                  <span className="text-gray-400">En progreso:</span>
                  <span className="ml-2 text-blue-400 font-medium">{group.in_progress_students}</span>
                </div>
                <div>
                  <span className="text-gray-400">Abandonaron:</span>
                  <span className="ml-2 text-red-400 font-medium">{group.dropped_students}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Completación</span>
                  <span className="text-white font-medium">{group.completion_rate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${group.completion_rate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Curso</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2"
            >
              <option value="all">Todos los cursos</option>
              {uniqueCourses.map((course: any) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nivel de Progreso</label>
            <select
              value={filterProgress}
              onChange={(e) => setFilterProgress(e.target.value as any)}
              className="w-full bg-secondary-700/50 border border-gray-600 text-white rounded-lg px-4 py-2"
            >
              <option value="all">Todos los niveles</option>
              <option value="excellent">Excelente</option>
              <option value="good">Bueno</option>
              <option value="regular">Regular</option>
              <option value="poor">Bajo</option>
              <option value="very_poor">Muy Bajo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        <div className="text-sm text-gray-400">
          Mostrando {filteredStudents.length} de {students.length} estudiantes
        </div>
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student) => (
              <StudentProgressCard key={`${student.student_id}-${student.course_id}-${student.group_id}`} student={student} />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">
              No se encontraron estudiantes con los filtros aplicados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
