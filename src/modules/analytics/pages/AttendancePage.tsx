import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import type { AttendanceFilters } from '../types';
import { FilterSection, AttendanceCard } from '../components';
import { useAttendance } from '../hooks/useAttendance';

export const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
  const [filters, setFilters] = useState<AttendanceFilters>({});

  const {
    attendance,
    courses,
    loading,
    error,
    refreshData,
    exportToCSV
  } = useAttendance(filters);

  // Aplicar filtros locales (búsqueda y curso)
  const filteredAttendance = attendance.filter(att => {
    const matchesCourse = selectedCourse === 'all' || att.course_id === selectedCourse;
    const matchesSearch = searchTerm === '' ||
      att.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Manejar cambios en los filtros avanzados
  const handleFilterChange = (newFilters: AttendanceFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de asistencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => refreshData(filters)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Análisis de Asistencia
        </h2>
        <button
          onClick={() => exportToCSV(filters)}
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
          setFilters({});
          refreshData({});
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