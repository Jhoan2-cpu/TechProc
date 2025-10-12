
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Submodule {
  id: string;
  name: string;
  icon: IconDefinition;
}

interface Module {
  id: string;
  name: string;
  icon: IconDefinition;
  submodules?: Submodule[];
}

interface SidebarNavigationProps {
  modules: Module[];
  currentUser: IconDefinition;
  currentPath: string;
  hasAccess: (user: any, moduleId: string) => boolean;
  onModuleChange: (moduleId: string) => void;
}

export const SidebarNavigation = ({
  modules,
  currentUser,
  currentPath,
  hasAccess,
  onModuleChange,
}: SidebarNavigationProps) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  return (
    <nav className="flex-1 p-4 overflow-y-auto min-h-0">
      <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3 px-3">
        Módulos
      </p>

      <div className="space-y-1">
        {modules.map((module) => {
          if (!hasAccess(currentUser, module.id)) return null;

          const isActive = currentPath === module.id;
          const isExpanded = expandedModules.includes(module.id);
          const hasSubmodules = module.submodules && module.submodules.length > 0;

          return (
            <div key={module.id}>
              {/* Botón principal del módulo */}
              <button
                onClick={() => {
                  if (hasSubmodules) {
                    // Expandir o contraer submódulos
                    setExpandedModules((prev) =>
                      prev.includes(module.id)
                        ? prev.filter((id) => id !== module.id)
                        : [...prev, module.id]
                    );
                  } else {
                    onModuleChange(module.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
                  isActive && !hasSubmodules
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/15 hover:scale-105'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-secondary-600 hover:to-secondary-700 hover:text-white hover:shadow-lg hover:scale-105 border-gray-700/30 hover:border-primary-500/50'
                }`}
              >
                <FontAwesomeIcon icon={module.icon} className="text-lg" />
                <span className="font-medium flex-1 text-left">{module.name}</span>
                {hasSubmodules && (
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronDown : faChevronRight}
                    className="text-sm"
                  />
                )}
              </button>

              {/* Submódulos */}
              {hasSubmodules && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {module.submodules.map((submodule) => {
                    const isSubActive = currentPath === submodule.id;
                    return (
                      <button
                        key={submodule.id}
                        onClick={() => onModuleChange(submodule.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 text-sm border ${
                          isSubActive
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/15'
                            : 'text-gray-400 hover:bg-gradient-to-r hover:from-secondary-600 hover:to-secondary-700 hover:text-white hover:shadow-md border-gray-700/20 hover:border-primary-500/40'
                        }`}
                      >
                        <FontAwesomeIcon icon={submodule.icon} />
                        <span className="font-medium">{submodule.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
export default SidebarNavigation;