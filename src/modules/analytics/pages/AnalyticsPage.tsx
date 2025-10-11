import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faCheckCircle,
  faChartBar,
  faFileCsv,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import type {
  AnalyticsDashboard,
  StudentAttendance,
  StudentProgress,
  StudentPerformance,
  DropoutPrediction,
  Report,
  CourseAnalytics,
  ReportType,
  ReportFormat,
} from '../types';
import {
  ProgressChart,
  PieChart,
  AnalyticsDashboardStats,
  FilterSection,
  ReportGeneratorForm,
  CourseAnalyticsCard,
  AttendanceCard,
  ProgressCard,
  PerformanceCard,
  DropoutPredictionCard,
  ReportCard,
} from '../components';

type AnalyticsTab = 'dashboard' | 'attendance' | 'progress' | 'performance' | 'dropout' | 'reports';

interface ReportFormData {
  report_type: ReportType;
  format: ReportFormat;
  date_from: string;
  date_to: string;
  include_charts: boolean;
  include_raw_data: boolean;
}

// Mock Data - Dashboard
const mockDashboard: AnalyticsDashboard = {
  total_students: 1250,
  active_students: 1180,
  at_risk_students: 45,
  average_attendance: 87.5,
  average_performance: 78.3,
  average_progress: 65.2,
  total_courses: 24,
  completion_rate: 72.8,
};

// Mock Data - Análisis por Curso
const mockCourseAnalytics: CourseAnalytics[] = [
  {
    course_id: 1,
    course_name: 'Python Avanzado',
    total_students: 85,
    active_students: 82,
    average_attendance: 92.5,
    average_performance: 85.2,
    average_progress: 78.5,
    completion_rate: 81.2,
    dropout_rate: 3.5,
    at_risk_count: 3,
  },
  {
    course_id: 2,
    course_name: 'JavaScript Moderno',
    total_students: 120,
    active_students: 110,
    average_attendance: 85.3,
    average_performance: 76.8,
    average_progress: 68.2,
    completion_rate: 70.5,
    dropout_rate: 8.3,
    at_risk_count: 8,
  },
  {
    course_id: 3,
    course_name: 'Ciberseguridad',
    total_students: 65,
    active_students: 58,
    average_attendance: 88.7,
    average_performance: 81.5,
    average_progress: 72.3,
    completion_rate: 75.4,
    dropout_rate: 10.8,
    at_risk_count: 7,
  },
  {
    course_id: 4,
    course_name: 'Data Science',
    total_students: 95,
    active_students: 90,
    average_attendance: 90.2,
    average_performance: 79.3,
    average_progress: 65.8,
    completion_rate: 68.9,
    dropout_rate: 5.3,
    at_risk_count: 5,
  },
];

// Mock Data - Asistencia
const mockAttendance: StudentAttendance[] = [
  {
    student_id: 1,
    student_name: 'Ana García',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_sessions: 40,
    attended_sessions: 38,
    absences: 2,
    tardiness: 1,
    justified_absences: 1,
    attendance_percentage: 95.0,
    last_attendance_date: '2024-03-15',
  },
  {
    student_id: 2,
    student_name: 'Carlos Mendoza',
    course_id: 2,
    course_name: 'JavaScript Moderno',
    total_sessions: 35,
    attended_sessions: 28,
    absences: 7,
    tardiness: 3,
    justified_absences: 2,
    attendance_percentage: 80.0,
    last_attendance_date: '2024-03-14',
  },
  {
    student_id: 3,
    student_name: 'María López',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_sessions: 40,
    attended_sessions: 35,
    absences: 5,
    tardiness: 2,
    justified_absences: 3,
    attendance_percentage: 87.5,
    last_attendance_date: '2024-03-15',
  },
  {
    student_id: 4,
    student_name: 'Juan Pérez',
    course_id: 3,
    course_name: 'Ciberseguridad',
    total_sessions: 30,
    attended_sessions: 18,
    absences: 12,
    tardiness: 5,
    justified_absences: 4,
    attendance_percentage: 60.0,
    last_attendance_date: '2024-03-10',
  },
];

// Mock Data - Progreso
const mockProgress: StudentProgress[] = [
  {
    student_id: 1,
    student_name: 'Ana García',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_modules: 12,
    completed_modules: 10,
    current_module: 11,
    progress_percentage: 83.3,
    average_time_per_module: 8.5,
    estimated_completion_date: '2024-04-10',
    enrollment_date: '2024-01-15',
  },
  {
    student_id: 2,
    student_name: 'Carlos Mendoza',
    course_id: 2,
    course_name: 'JavaScript Moderno',
    total_modules: 15,
    completed_modules: 9,
    current_module: 10,
    progress_percentage: 60.0,
    average_time_per_module: 12.3,
    estimated_completion_date: '2024-05-20',
    enrollment_date: '2024-01-10',
  },
  {
    student_id: 3,
    student_name: 'María López',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_modules: 12,
    completed_modules: 8,
    current_module: 9,
    progress_percentage: 66.7,
    average_time_per_module: 10.2,
    estimated_completion_date: '2024-04-25',
    enrollment_date: '2024-01-20',
  },
  {
    student_id: 4,
    student_name: 'Juan Pérez',
    course_id: 3,
    course_name: 'Ciberseguridad',
    total_modules: 10,
    completed_modules: 3,
    current_module: 4,
    progress_percentage: 30.0,
    average_time_per_module: 18.5,
    estimated_completion_date: '2024-07-15',
    enrollment_date: '2024-02-01',
  },
];

// Mock Data - Rendimiento
const mockPerformance: StudentPerformance[] = [
  {
    student_id: 1,
    student_name: 'Ana García',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_assessments: 10,
    completed_assessments: 10,
    average_score: 92.5,
    highest_score: 98,
    lowest_score: 85,
    passing_rate: 100,
    last_assessment_date: '2024-03-14',
    grade: 'A',
  },
  {
    student_id: 2,
    student_name: 'Carlos Mendoza',
    course_id: 2,
    course_name: 'JavaScript Moderno',
    total_assessments: 9,
    completed_assessments: 8,
    average_score: 75.3,
    highest_score: 88,
    lowest_score: 62,
    passing_rate: 87.5,
    last_assessment_date: '2024-03-12',
    grade: 'B',
  },
  {
    student_id: 3,
    student_name: 'María López',
    course_id: 1,
    course_name: 'Python Avanzado',
    total_assessments: 10,
    completed_assessments: 9,
    average_score: 81.7,
    highest_score: 95,
    lowest_score: 70,
    passing_rate: 88.9,
    last_assessment_date: '2024-03-13',
    grade: 'B',
  },
  {
    student_id: 4,
    student_name: 'Juan Pérez',
    course_id: 3,
    course_name: 'Ciberseguridad',
    total_assessments: 5,
    completed_assessments: 3,
    average_score: 58.3,
    highest_score: 72,
    lowest_score: 45,
    passing_rate: 33.3,
    last_assessment_date: '2024-03-05',
    grade: 'D',
  },
];

// Mock Data - Predicción de Deserción
const mockDropout: DropoutPrediction[] = [
  {
    student_id: 4,
    student_name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    course_id: 3,
    course_name: 'Ciberseguridad',
    risk_level: 'crítico',
    risk_score: 85,
    factors: [
      { factor_name: 'Asistencia Baja', impact: 'alto', value: '60%', description: 'Asistencia por debajo del 70%' },
      { factor_name: 'Rendimiento Bajo', impact: 'alto', value: '58.3', description: 'Promedio por debajo de 60' },
      { factor_name: 'Inactividad', impact: 'medio', value: '5 días', description: 'Sin acceder al sistema' },
      { factor_name: 'Progreso Lento', impact: 'medio', value: '30%', description: 'Muy por debajo del promedio' },
    ],
    last_login: '2024-03-10',
    days_inactive: 5,
    recommended_actions: [
      'Contacto inmediato vía email y teléfono',
      'Agendar reunión 1 a 1 con tutor',
      'Evaluar necesidad de plan de recuperación',
      'Ofrecer sesiones de refuerzo',
    ],
    prediction_date: '2024-03-15',
  },
  {
    student_id: 5,
    student_name: 'Laura Ramírez',
    email: 'laura.ramirez@email.com',
    course_id: 2,
    course_name: 'JavaScript Moderno',
    risk_level: 'alto',
    risk_score: 72,
    factors: [
      { factor_name: 'Asistencia Irregular', impact: 'medio', value: '75%', description: 'Ausencias frecuentes' },
      { factor_name: 'Evaluaciones Pendientes', impact: 'alto', value: '3', description: 'Evaluaciones sin completar' },
      { factor_name: 'Inactividad', impact: 'medio', value: '3 días', description: 'Sin acceder recientemente' },
    ],
    last_login: '2024-03-12',
    days_inactive: 3,
    recommended_actions: [
      'Enviar recordatorio sobre evaluaciones pendientes',
      'Contactar para verificar situación',
      'Ofrecer tutoría adicional',
    ],
    prediction_date: '2024-03-15',
  },
  {
    student_id: 6,
    student_name: 'Pedro Sánchez',
    email: 'pedro.sanchez@email.com',
    course_id: 4,
    course_name: 'Data Science',
    risk_level: 'medio',
    risk_score: 55,
    factors: [
      { factor_name: 'Progreso Lento', impact: 'medio', value: '45%', description: 'Por debajo del promedio' },
      { factor_name: 'Tiempo por Módulo', impact: 'medio', value: '15h', description: 'Más tiempo que el promedio' },
    ],
    last_login: '2024-03-14',
    days_inactive: 1,
    recommended_actions: [
      'Monitorear progreso semanalmente',
      'Ofrecer recursos adicionales',
      'Verificar comprensión de contenidos',
    ],
    prediction_date: '2024-03-15',
  },
];

// Mock Data - Reportes
const mockReports: Report[] = [
  {
    id_report: 1,
    report_name: 'Reporte Mensual de Asistencia - Marzo 2024',
    report_type: 'asistencia',
    description: 'Análisis completo de asistencia de todos los cursos durante marzo',
    format: 'pdf',
    generated_by: 1,
    generated_by_name: 'Admin Sistema',
    generation_date: '2024-03-15 10:30:00',
    file_path: '/reports/asistencia_marzo_2024.pdf',
    file_size_kb: 2450,
    parameters: {
      date_from: '2024-03-01',
      date_to: '2024-03-31',
      include_charts: true,
      include_raw_data: false,
    },
  },
  {
    id_report: 2,
    report_name: 'Análisis de Rendimiento - Q1 2024',
    report_type: 'rendimiento',
    description: 'Reporte trimestral de rendimiento académico con gráficos y estadísticas',
    format: 'excel',
    generated_by: 1,
    generated_by_name: 'Admin Sistema',
    generation_date: '2024-03-14 15:45:00',
    file_path: '/reports/rendimiento_q1_2024.xlsx',
    file_size_kb: 3870,
    parameters: {
      date_from: '2024-01-01',
      date_to: '2024-03-31',
      course_ids: [1, 2, 3, 4],
      include_charts: true,
      include_raw_data: true,
    },
  },
  {
    id_report: 3,
    report_name: 'Estudiantes en Riesgo - Marzo 2024',
    report_type: 'desercion',
    description: 'Lista de estudiantes con alto riesgo de deserción y acciones recomendadas',
    format: 'pdf',
    generated_by: 1,
    generated_by_name: 'Admin Sistema',
    generation_date: '2024-03-13 09:20:00',
    file_path: '/reports/riesgo_desercion_marzo_2024.pdf',
    file_size_kb: 1580,
    parameters: {
      date_from: '2024-03-01',
      date_to: '2024-03-31',
      include_charts: false,
      include_raw_data: true,
    },
  },
];

export const AnalyticsPage = () => {
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportForm, setReportForm] = useState<ReportFormData>({
    report_type: 'asistencia',
    format: 'pdf',
    date_from: '',
    date_to: '',
    include_charts: true,
    include_raw_data: false,
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Determinar la sección actual basándose en la ruta
  const getCurrentTab = (): AnalyticsTab => {
    const path = location.pathname;
    if (path.includes('attendance')) return 'attendance';
    if (path.includes('progress')) return 'progress';
    if (path.includes('performance')) return 'performance';
    if (path.includes('dropout')) return 'dropout';
    if (path.includes('reports')) return 'reports';
    return 'dashboard';
  };

  const activeTab = getCurrentTab();

  // Función para exportar datos a CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Función para descargar reportes
  const handleDownloadReport = (report: Report) => {
    // Simulación de descarga
    alert(`Descargando: ${report.report_name}\nFormato: ${report.format.toUpperCase()}\nTamaño: ${(report.file_size_kb / 1024).toFixed(2)} MB`);
    console.log('Descargando reporte:', report);
  };

  // Función para generar nuevo reporte
  const handleGenerateReport = () => {
    if (!reportForm.date_from || !reportForm.date_to) {
      alert('Por favor, selecciona las fechas de inicio y fin');
      return;
    }

    setIsGeneratingReport(true);
    setReportSuccess(false);

    // Simulación de generación de reporte
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportSuccess(true);

      console.log('Reporte generado:', reportForm);
      alert(`Reporte generado exitosamente!\nTipo: ${reportForm.report_type}\nFormato: ${reportForm.format}\nFechas: ${reportForm.date_from} a ${reportForm.date_to}`);

      // Resetear el mensaje de éxito después de 3 segundos
      setTimeout(() => setReportSuccess(false), 3000);
    }, 2000);
  };


  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas Generales */}
      <AnalyticsDashboardStats
        activeStudents={mockDashboard.active_students}
        totalStudents={mockDashboard.total_students}
        averageAttendance={mockDashboard.average_attendance}
        averagePerformance={mockDashboard.average_performance}
        atRiskStudents={mockDashboard.at_risk_students}
      />

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-2xl text-blue-400" />
            <h3 className="text-lg font-heading font-bold text-white">Cursos Activos</h3>
          </div>
          <p className="text-4xl font-bold text-white">{mockDashboard.total_courses}</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faTasks} className="text-2xl text-green-400" />
            <h3 className="text-lg font-heading font-bold text-white">Progreso Promedio</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {mockDashboard.average_progress.toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-purple-400" />
            <h3 className="text-lg font-heading font-bold text-white">Tasa de Completación</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {mockDashboard.completion_rate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Gráficos de Visualización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Progreso por Curso */}
        <div className="card p-6">
          <ProgressChart
            title="Progreso Promedio por Curso"
            data={mockCourseAnalytics.map(course => ({
              label: course.course_name,
              value: course.average_progress,
              color: course.average_progress >= 70 ? 'bg-green-600' : course.average_progress >= 50 ? 'bg-primary-500' : 'bg-warning/20',
            }))}
          />
        </div>

        {/* Gráfico de Distribución de Estudiantes */}
        <div className="card p-6">
          <PieChart
            title="Distribución de Estudiantes por Curso"
            data={mockCourseAnalytics.map((course, index) => {
              const colors = ['bg-primary-500', 'bg-primary-500', 'bg-green-600', 'bg-warning/20'];
              return {
                label: course.course_name,
                value: course.total_students,
                color: colors[index % colors.length],
              };
            })}
          />
        </div>
      </div>

      {/* Análisis por Curso */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartBar} className="text-blue-400" />
          Análisis por Curso
        </h2>
        <div className="space-y-4">
          {mockCourseAnalytics.map((course, index) => (
            <CourseAnalyticsCard
              key={course.course_id}
              course={course}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => {
    // Filtrar datos de asistencia por curso y término de búsqueda
    const filteredAttendance = mockAttendance.filter(attendance => {
      const matchesCourse = selectedCourse === 'all' || attendance.course_id === selectedCourse;
      const matchesSearch = searchTerm === '' ||
        attendance.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.course_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCourse && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Análisis de Asistencia
          </h2>
          <button
            onClick={() => exportToCSV(filteredAttendance, 'asistencia')}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <FilterSection
          searchTerm={searchTerm}
          selectedCourse={selectedCourse}
          courses={mockCourseAnalytics}
          onSearchChange={setSearchTerm}
          onCourseChange={setSelectedCourse}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedCourse('all');
          }}
        />

        {/* Resultados */}
        <div className="text-sm text-gray-400 mb-2">
          Mostrando {filteredAttendance.length} de {mockAttendance.length} estudiantes
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((attendance, index) => (
              <AttendanceCard
                key={attendance.student_id}
                attendance={attendance}
                index={index}
              />
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-gray-300 text-lg">
                No se encontraron resultados para los filtros aplicados
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    // Filtrar datos de progreso por curso y término de búsqueda
    const filteredProgress = mockProgress.filter(progress => {
      const matchesCourse = selectedCourse === 'all' || progress.course_id === selectedCourse;
      const matchesSearch = searchTerm === '' ||
        progress.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        progress.course_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCourse && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Seguimiento de Progreso Académico
          </h2>
          <button
            onClick={() => exportToCSV(filteredProgress, 'progreso_academico')}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <FilterSection
          searchTerm={searchTerm}
          selectedCourse={selectedCourse}
          courses={mockCourseAnalytics}
          onSearchChange={setSearchTerm}
          onCourseChange={setSelectedCourse}
          onClearFilters={() => {
            setSearchTerm('');
            setSelectedCourse('all');
          }}
        />

        {/* Resultados */}
        <div className="text-sm text-gray-400 mb-2">
          Mostrando {filteredProgress.length} de {mockProgress.length} estudiantes
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredProgress.length > 0 ? (
            filteredProgress.map((progress, index) => (
              <ProgressCard
                key={progress.student_id}
                progress={progress}
                index={index}
              />
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-gray-300 text-lg">
                No se encontraron resultados para los filtros aplicados
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Análisis de Rendimiento Académico
        </h2>
        <button
          onClick={() => exportToCSV(mockPerformance, 'rendimiento_academico')}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockPerformance.map((perf, index) => (
          <PerformanceCard
            key={perf.student_id}
            performance={perf}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  const renderDropout = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Predicción de Riesgo de Deserción
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(mockDropout, 'riesgo_desercion')}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-danger/20 text-danger font-bold shadow-sm">
              {mockDropout.filter(d => d.risk_level === 'crítico').length} Críticos
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 font-bold shadow-sm">
              {mockDropout.filter(d => d.risk_level === 'alto').length} Altos
            </span>
            <span className="px-3 py-1 rounded-full bg-warning/20 text-warning font-bold shadow-sm">
              {mockDropout.filter(d => d.risk_level === 'medio').length} Medios
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockDropout.map((student, index) => (
          <DropoutPredictionCard
            key={student.student_id}
            student={student}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">
          Generación de Reportes
        </h2>
      </div>

      {/* Formulario de Nuevo Reporte */}
      <ReportGeneratorForm
        reportForm={reportForm}
        isGenerating={isGeneratingReport}
        success={reportSuccess}
        onFormChange={setReportForm}
        onGenerate={handleGenerateReport}
      />

      {/* Reportes Generados */}
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Reportes Generados Recientemente</h3>
        <div className="grid grid-cols-1 gap-4">
          {mockReports.map((report, index) => (
            <ReportCard
              key={report.id_report}
              report={report}
              index={index}
              onDownload={handleDownloadReport}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'performance' && renderPerformance()}
      {activeTab === 'dropout' && renderDropout()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};
