import { useLocation } from 'react-router-dom';
import type {
  Report,
} from '../types';
import { AttendancePage } from './AttendancePage';
import { ReportsPage } from './ReportsPage';
import { StudentsPage } from './StudentsPage';
import { GradesPage } from './GradesPage';
import { FinancialPage } from './FinancialPage';
import { SecurityReportsPage } from './SecurityReportsPage';
import { TicketsPage } from './TicketsPage';
import { CoursesPage } from './CoursesPage';
import { DashboardPage } from './DashboardPage';

type AnalyticsTab = 'dashboard' | 'students' | 'courses' | 'attendance' | 'grades' | 'financial' | 'tickets' | 'security' | 'reports';

export const AnalyticsMainPage = () => {
  const location = useLocation();

  // Determinar la sección actual basándose en la ruta
  const getCurrentTab = (): AnalyticsTab => {
    const path = location.pathname;
    if (path.includes('students')) return 'students';
    if (path.includes('courses')) return 'courses';
    if (path.includes('attendance')) return 'attendance';
    if (path.includes('grades')) return 'grades';
    if (path.includes('financial')) return 'financial';
    if (path.includes('tickets')) return 'tickets';
    if (path.includes('security')) return 'security';
    if (path.includes('reports')) return 'reports';
    return 'dashboard';
  };

  const activeTab = getCurrentTab();

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && (
        <DashboardPage />
      )}
      {activeTab === 'students' && (
        <StudentsPage />
      )}
      {activeTab === 'courses' && (
        <CoursesPage />
      )}
      {activeTab === 'attendance' && (
        <AttendancePage />
      )}
      {activeTab === 'grades' && (
        <GradesPage />
      )}
      {activeTab === 'financial' && (
        <FinancialPage />
      )}
      {activeTab === 'tickets' && (
        <TicketsPage />
      )}
      {activeTab === 'security' && (
        <SecurityReportsPage />
      )}
      {activeTab === 'reports' && (
        <ReportsPage/>
      )}
    </div>
  );
};
