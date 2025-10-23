import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import type { CourseAnalytics } from '../types';

interface FilterSectionProps {
  searchTerm: string;
  selectedCourse: number | 'all';
  courses: CourseAnalytics[];
  onSearchChange: (value: string) => void;
  onCourseChange: (value: number | 'all') => void;
  onClearFilters: () => void;
}

export const FilterSection = ({
  searchTerm,
  selectedCourse,
  courses,
  onSearchChange,
  onCourseChange,
  onClearFilters,
}: FilterSectionProps) => {
  const hasFilters = searchTerm !== '' || selectedCourse !== 'all';

  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 shadow-xl">
      <div className="flex items-center gap-3 flex-wrap">
        <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            className="input w-full"
            placeholder="Buscar por estudiante o curso..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
