import { useLocation } from 'react-router-dom';
import { LMSPage } from './LMSPage';
import { CoursesPage } from './CoursesPage';
import { StudentsPage } from './StudentsPage';
import { InstructorsPage } from './InstructorsPage';
import { CompaniesPage } from './CompaniesPage';
import { AcademicPeriodsPage } from './AcademicPeriodsPage';

export const LMSMainPage = () => {
  const location = useLocation();

  // Determinar la sección actual basándose en la ruta
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('courses')) return 'courses';
    if (path.includes('students')) return 'students';
    if (path.includes('instructors')) return 'instructors';
    if (path.includes('companies')) return 'companies';
    if (path.includes('academic-periods')) return 'academic-periods';
    return 'dashboard';
  };

  const renderSection = () => {
    const section = getCurrentSection();

    switch (section) {
      case 'courses':
        return <CoursesPage />;
      case 'students':
        return <StudentsPage />;
      case 'instructors':
        return <InstructorsPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'academic-periods':
        return <AcademicPeriodsPage />;
      case 'dashboard':
      default:
        return <LMSPage />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSection()}
    </div>
  );
};
