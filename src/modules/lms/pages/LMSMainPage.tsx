import { useState } from 'react';
import { LMSLayout } from '../components/LMSLayout';
import { LMSPage } from './LMSPage';
import { CoursesPage } from './CoursesPage';
import { StudentsPage } from './StudentsPage';
import { InstructorsPage } from './InstructorsPage';

export const LMSMainPage = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <LMSPage />;
      case 'courses':
        return <CoursesPage />;
      case 'students':
        return <StudentsPage />;
      case 'instructors':
        return <InstructorsPage />;
      default:
        return <LMSPage />;
    }
  };

  return (
    <LMSLayout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </LMSLayout>
  );
};
