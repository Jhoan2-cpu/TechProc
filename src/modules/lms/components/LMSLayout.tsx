import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBookOpen,
  faUserGraduate,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';

interface LMSLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const LMSLayout = ({ children, currentSection, onSectionChange }: LMSLayoutProps) => {
  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: faHome },
    { id: 'courses', name: 'Gestión de Cursos', icon: faBookOpen },
    { id: 'students', name: 'Gestión de Estudiantes', icon: faUserGraduate },
    { id: 'instructors', name: 'Gestión de Instructores', icon: faChalkboardTeacher },
  ];

  return (
    <div>
      {/* Tabs de navegación */}
      <div className="mb-6 border-b border-secondary-200">
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                currentSection === section.id
                  ? 'border-primary-600 text-primary-600 bg-primary-50'
                  : 'border-transparent text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
              }`}
            >
              <FontAwesomeIcon icon={section.icon} />
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
};
