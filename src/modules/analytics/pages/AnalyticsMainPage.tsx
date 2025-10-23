import { useLocation } from 'react-router-dom';
import type {
  AnalyticsDashboard,
  StudentPerformance,
  DropoutPrediction,
  Report,
  CourseAnalytics,
} from '../types';
import { AnalyticsDashboardPage } from './AnalyticsDashboardPage';
import { AttendanceAnalyticsPage } from './AttendanceAnalyticsPage';
import { ProgressAnalyticsPage } from './ProgressAnalyticsPage';
import { PerformancePage } from './PerformancePage';
import { DropoutPage } from './DropoutPage';
import { ReportsPage } from './ReportsPage';

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

type AnalyticsTab = 'dashboard' | 'attendance' | 'progress' | 'performance' | 'dropout' | 'reports';

export const AnalyticsMainPage = () => {
  const location = useLocation();

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

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && (
        <AnalyticsDashboardPage
          dashboard={mockDashboard}
          courseAnalytics={mockCourseAnalytics}
        />
      )}
      {activeTab === 'attendance' && (
        <AttendanceAnalyticsPage />
      )}
      {activeTab === 'progress' && (
        <ProgressAnalyticsPage />
      )}
      {activeTab === 'performance' && (
        <PerformancePage
          performance={mockPerformance}
          onExportCSV={exportToCSV}
        />
      )}
      {activeTab === 'dropout' && (
        <DropoutPage
          dropoutPredictions={mockDropout}
          onExportCSV={exportToCSV}
        />
      )}
      {activeTab === 'reports' && (
        <ReportsPage
          reports={mockReports}
          onDownloadReport={handleDownloadReport}
        />
      )}
    </div>
  );
};
