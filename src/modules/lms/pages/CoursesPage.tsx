import { useState, useEffect } from 'react';
import type { Course } from '../types';
import {
  CreateCourseModal,
  CourseCard,
  ViewCourseModal,
  CourseFilters
} from '../components';
import { coursesService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const CoursesPage = () => {
  // Estados de cursos
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await coursesService.getAll();
      setCourses(data.courses);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los cursos');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      const newCourse = await coursesService.create(courseData);
      setCourses([...courses, newCourse]);
      setShowCreateModal(false);

      // Recargar la lista de cursos para obtener los datos actualizados
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error; // Re-lanzar el error para que el modal lo maneje
    }
  };

  const handleEditCourse = async (updatedData: any) => {
    if (courseToEdit) {
      try {
        // Actualizar el curso usando la API
        const updated = await coursesService.update(courseToEdit.course_id || courseToEdit.id, updatedData);
        setCourses(courses.map(c => c.id === courseToEdit.id ? updated : c));
        setCourseToEdit(null);

        // Recargar la lista de cursos para obtener los datos actualizados
        fetchCourses();
      } catch (error) {
        console.error('Error updating course:', error);
        throw error; // Re-lanzar el error para que el modal lo maneje
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        // Usar course_id para eliminar el curso
        await coursesService.delete(String(courseToDelete.course_id || courseToDelete.id));
        setCourses(courses.filter(c => c.id !== courseToDelete.id));
        setCourseToDelete(null);

        // Recargar la lista de cursos para asegurar que esté actualizada
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Gestión de Cursos</h1>
          <p className="text-gray-400">Administra los cursos del sistema</p>
        </div>
      </div>

      <div>
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchCourses}
                className="btn bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Header con filtros */}
        <CourseFilters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setFilterStatus}
          onCreateClick={() => setShowCreateModal(true)}
        />

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onView={(course: Course) => setSelectedCourse(course)}
              onDelete={(course: Course) => setCourseToDelete(course)}
            />
          ))}
        </div>

        {/* Mensaje si no hay cursos */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron cursos</p>
          </div>
        )}
      </div>

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCourse}
        />
      )}

      {/* Modal de visualización */}
      {selectedCourse && (
        <ViewCourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {/* Modal de edición */}
      {courseToEdit && (
        <CreateCourseModal
          course={courseToEdit}
          onClose={() => setCourseToEdit(null)}
          onSave={handleEditCourse}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={!!courseToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar el curso?"
        itemName={courseToDelete ? courseToDelete.title : ''}
        onConfirm={handleDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
};
