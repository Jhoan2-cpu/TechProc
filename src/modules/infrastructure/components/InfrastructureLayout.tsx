import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faServer,
  faKey,
  faHdd,
  faCog,
  faLaptop,
} from '@fortawesome/free-solid-svg-icons';

interface InfrastructureLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const InfrastructureLayout = ({ children, currentSection, onSectionChange }: InfrastructureLayoutProps) => {
  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: faTachometerAlt },
    { id: 'servers', name: 'Servidores', icon: faServer },
    { id: 'licenses', name: 'Licencias', icon: faKey },
    { id: 'storage', name: 'Almacenamiento', icon: faHdd },
    { id: 'software', name: 'Software', icon: faCog },
    { id: 'resources', name: 'Recursos', icon: faLaptop },
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
