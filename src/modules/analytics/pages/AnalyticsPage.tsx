import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUserCheck,
  faTasks,
  faTrophy,
  faExclamationTriangle,
  faFileAlt,
  faUsers,
  faGraduationCap,
  faCheckCircle,
  faChartBar,
  faFileExport,
  faFilter,
  faPlus,
  faFileCsv,
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
  AnalyticsStatsCard,
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
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
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

  const tabs = [
    { id: 'dashboard' as const, name: 'Dashboard', icon: faChartLine },
    { id: 'attendance' as const, name: 'Asistencia', icon: faUserCheck },
    { id: 'progress' as const, name: 'Progreso', icon: faTasks },
    { id: 'performance' as const, name: 'Rendimiento', icon: faTrophy },
    { id: 'dropout' as const, name: 'Riesgo Deserción', icon: faExclamationTriangle },
    { id: 'reports' as const, name: 'Reportes', icon: faFileAlt },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsStatsCard
          title="Estudiantes Activos"
          value={mockDashboard.active_students}
          subtitle={`de ${mockDashboard.total_students} totales`}
          icon={faUsers}
          colorClass="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900"
          borderColor="border-l-4 border-blue-600"
        />
        <AnalyticsStatsCard
          title="Asistencia Promedio"
          value={`${mockDashboard.average_attendance.toFixed(1)}%`}
          subtitle="en todos los cursos"
          icon={faUserCheck}
          colorClass="bg-gradient-to-br from-green-50 to-green-100 text-green-900"
          borderColor="border-l-4 border-green-600"
        />
        <AnalyticsStatsCard
          title="Rendimiento Promedio"
          value={`${mockDashboard.average_performance.toFixed(1)}%`}
          subtitle="calificaciones"
          icon={faTrophy}
          colorClass="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-900"
          borderColor="border-l-4 border-purple-600"
        />
        <AnalyticsStatsCard
          title="Estudiantes en Riesgo"
          value={mockDashboard.at_risk_students}
          subtitle="requieren atención"
          icon={faExclamationTriangle}
          colorClass="bg-gradient-to-br from-red-50 to-red-100 text-red-900"
          borderColor="border-l-4 border-red-600"
        />
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-2xl text-primary-600" />
            <h3 className="text-lg font-heading font-bold">Cursos Activos</h3>
          </div>
          <p className="text-4xl font-bold text-secondary-900">{mockDashboard.total_courses}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faTasks} className="text-2xl text-primary-600" />
            <h3 className="text-lg font-heading font-bold">Progreso Promedio</h3>
          </div>
          <p className="text-4xl font-bold text-secondary-900">
            {mockDashboard.average_progress.toFixed(1)}%
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-primary-600" />
            <h3 className="text-lg font-heading font-bold">Tasa de Completación</h3>
          </div>
          <p className="text-4xl font-bold text-secondary-900">
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
              color: course.average_progress >= 70 ? 'bg-green-600' : course.average_progress >= 50 ? 'bg-primary-500' : 'bg-yellow-500',
            }))}
          />
        </div>

        {/* Gráfico de Distribución de Estudiantes */}
        <div className="card p-6">
          <PieChart
            title="Distribución de Estudiantes por Curso"
            data={mockCourseAnalytics.map((course, index) => {
              const colors = ['bg-primary-500', 'bg-accent-500', 'bg-green-600', 'bg-yellow-500'];
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
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartBar} />
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

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Análisis de Asistencia
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(mockAttendance, 'asistencia')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
          <FontAwesomeIcon icon={faFilter} className="text-secondary-400" />
          <select
            className="select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Todos los cursos</option>
            {mockCourseAnalytics.map(course => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockAttendance.map((attendance, index) => (
          <AttendanceCard
            key={attendance.student_id}
            attendance={attendance}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Seguimiento de Progreso Académico
        </h2>
        <button
          onClick={() => exportToCSV(mockProgress, 'progreso_academico')}
          className="btn btn-secondary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockProgress.map((progress, index) => (
          <ProgressCard
            key={progress.student_id}
            progress={progress}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Análisis de Rendimiento Académico
        </h2>
        <button
          onClick={() => exportToCSV(mockPerformance, 'rendimiento_academico')}
          className="btn btn-secondary flex items-center gap-2"
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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Predicción de Riesgo de Deserción
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(mockDropout, 'riesgo_desercion')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 font-bold shadow-sm">
              {mockDropout.filter(d => d.risk_level === 'crítico').length} Críticos
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 font-bold shadow-sm">
              {mockDropout.filter(d => d.risk_level === 'alto').length} Altos
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 font-bold shadow-sm">
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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">
          Generación de Reportes
        </h2>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Generar Nuevo Reporte
        </button>
      </div>

      {/* Formulario de Nuevo Reporte */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileExport} />
          Crear Reporte Personalizado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Tipo de Reporte *
            </label>
            <select
              className="select"
              value={reportForm.report_type}
              onChange={(e) => setReportForm({ ...reportForm, report_type: e.target.value as ReportType })}
            >
              <option value="asistencia">Asistencia</option>
              <option value="rendimiento">Rendimiento</option>
              <option value="progreso">Progreso</option>
              <option value="desercion">Riesgo de Deserción</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Formato *
            </label>
            <select
              className="select"
              value={reportForm.format}
              onChange={(e) => setReportForm({ ...reportForm, format: e.target.value as ReportFormat })}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Fecha Inicio *
            </label>
            <input
              type="date"
              className="input"
              value={reportForm.date_from}
              onChange={(e) => setReportForm({ ...reportForm, date_from: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Fecha Fin *
            </label>
            <input
              type="date"
              className="input"
              value={reportForm.date_to}
              onChange={(e) => setReportForm({ ...reportForm, date_to: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={reportForm.include_charts}
              onChange={(e) => setReportForm({ ...reportForm, include_charts: e.target.checked })}
            />
            <span className="text-sm">Incluir gráficos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={reportForm.include_raw_data}
              onChange={(e) => setReportForm({ ...reportForm, include_raw_data: e.target.checked })}
            />
            <span className="text-sm">Incluir datos crudos</span>
          </label>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            <FontAwesomeIcon icon={faFileExport} className={isGeneratingReport ? 'animate-spin' : ''} />
            {isGeneratingReport ? 'Generando...' : 'Generar Reporte'}
          </button>
          {reportSuccess && (
            <span className="text-green-600 font-semibold flex items-center gap-2 animate-fade-in">
              <FontAwesomeIcon icon={faCheckCircle} />
              ¡Reporte generado exitosamente!
            </span>
          )}
        </div>
      </div>

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
    <div className="min-h-screen bg-secondary-50 p-6">
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary-200">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary-900 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="mr-3 text-primary-600" />
            Analítica y Monitoreo
          </h1>
          <p className="text-secondary-600 mt-2">
            Análisis de datos, asistencia, progreso, rendimiento y predicción de deserción
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'dropout' && renderDropout()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};
