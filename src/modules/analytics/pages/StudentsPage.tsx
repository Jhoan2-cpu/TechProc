import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faUsers, faChartBar, faBuilding} from '@fortawesome/free-solid-svg-icons';
import type { StudentFilters } from '../types/student';
import { StudentFilterSection, StudentCard } from '../components';
import { useStudents } from '../hooks/useStudents';

export const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentFilters>({});

  const {
    students,
    statistics,
    loading,
    error,
    pagination,
    refreshData,
    exportToCSV
  } = useStudents(filters);

  // Aplicar filtro de búsqueda local
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.first_name.toLowerCase().includes(searchLower) ||
      student.last_name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.document_number.includes(searchTerm)
    );
  });

  const handleFilterChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
    refreshData({});
  };

  /*const handleViewDetails = (studentId: number) => {
    setSelectedStudent(studentId);
    // Aquí podrías navegar a una página de detalle o mostrar un modal
    console.log('Ver detalles del estudiante:', studentId);
  };*/

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos de estudiantes...</div>
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faUsers} className="text-primary-400" />
            Análisis de Estudiantes
          </h2>
          <p className="text-gray-400 mt-1">
            Gestión y análisis de información estudiantil
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filters)}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas rápidas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="text-primary-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.total_students}</p>
                <p className="text-sm text-gray-300">Total Estudiantes</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.active_students}</p>
                <p className="text-sm text-gray-300">Estudiantes Activos</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FontAwesomeIcon icon={faBuilding} className="text-blue-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{statistics.by_company.length}</p>
                <p className="text-sm text-gray-300">Empresas</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-purple-400 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {((statistics.active_students / statistics.total_students) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-300">Tasa de Activos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <StudentFilterSection
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>
          Mostrando {filteredStudents.length} de {pagination.total_records} estudiantes
        </span>
        <span>
          Página {pagination.current_page} de {pagination.total_pages}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              index={index}
              //onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">
              No se encontraron estudiantes para los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page - 1 })}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Anterior
          </button>
          
          <span className="px-4 py-2 text-gray-300">
            Página {pagination.current_page} de {pagination.total_pages}
          </span>
          
          <button
            onClick={() => handleFilterChange({ ...filters, page: pagination.current_page + 1 })}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};