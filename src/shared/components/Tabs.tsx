import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Tab {
  id: string;
  label: string;
  icon?: any; // FontAwesome icon
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex gap-2 border-b border-secondary-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
            activeTab === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          {tab.icon && <FontAwesomeIcon icon={tab.icon} className="mr-2" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface TabPanelProps {
  children: ReactNode;
  isActive: boolean;
}

export const TabPanel = ({ children, isActive }: TabPanelProps) => {
  if (!isActive) return null;
  return <div className="mt-6">{children}</div>;
};
