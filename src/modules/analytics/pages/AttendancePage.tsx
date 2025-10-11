import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import type { StudentAttendance, CourseAnalytics } from '../types';
import { FilterSection, AttendanceCard } from '../components';

interface AttendancePageProps {
  attendance: StudentAttendance[];
  courses: CourseAnalytics[];
  onExportCSV: (data: any[], filename: string) => void;
}

export const AttendancePage = ({
  attendance,
  courses,
  onExportCSV,
}: AttendancePageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');

  // Filtrar datos de asistencia por curso y término de búsqueda
  const filteredAttendance = attendance.filter(att => {
    const matchesCourse = selectedCourse === 'all' || att.course_id === selectedCourse;
    const matchesSearch = searchTerm === '' ||
      att.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Análisis de Asistencia
        </h2>
        <button
          onClick={() => onExportCSV(filteredAttendance, 'asistencia')}
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
        Mostrando {filteredAttendance.length} de {attendance.length} estudiantes
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((att, index) => (
            <AttendanceCard
              key={att.student_id}
              attendance={att}
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
