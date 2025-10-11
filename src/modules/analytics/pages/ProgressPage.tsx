import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import type { StudentProgress, CourseAnalytics } from '../types';
import { FilterSection, ProgressCard } from '../components';

interface ProgressPageProps {
  progress: StudentProgress[];
  courses: CourseAnalytics[];
  onExportCSV: (data: any[], filename: string) => void;
}

export const ProgressPage = ({
  progress,
  courses,
  onExportCSV,
}: ProgressPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');

  // Filtrar datos de progreso por curso y término de búsqueda
  const filteredProgress = progress.filter(prog => {
    const matchesCourse = selectedCourse === 'all' || prog.course_id === selectedCourse;
    const matchesSearch = searchTerm === '' ||
      prog.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Seguimiento de Progreso Académico
        </h2>
        <button
          onClick={() => onExportCSV(filteredProgress, 'progreso_academico')}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <FilterSection
        searchTerm={searchTerm}
        selectedCourse={selectedCourse}
        courses={courses}
        onSearchChange={setSearchTerm}
        onCourseChange={setSelectedCourse}
        onClearFilters={() => {
          setSearchTerm('');
          setSelectedCourse('all');
        }}
      />

      {/* Resultados */}
      <div className="text-sm text-gray-400 mb-2">
        Mostrando {filteredProgress.length} de {progress.length} estudiantes
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProgress.length > 0 ? (
          filteredProgress.map((prog, index) => (
            <ProgressCard
              key={prog.student_id}
              progress={prog}
              index={index}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">
              No se encontraron resultados para los filtros aplicados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
