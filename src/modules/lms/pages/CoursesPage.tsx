import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import type { Course } from '../types';
import { CreateCourseModal, CourseCard, ViewCourseModal } from '../components';
import { coursesService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await coursesService.getAll();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourse = (updatedCourse: Partial<Course>) => {
    if (courseToEdit && updatedCourse) {
      const fullCourse: Course = { ...courseToEdit, ...updatedCourse };
      setCourses(courses.map(c => c.id === courseToEdit.id ? fullCourse : c));
    }
    setCourseToEdit(null);
  };

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== courseToDelete.id));
      setCourseToDelete(null);
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
          <p className="mt-4 text-secondary-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">lms/courses</h1>
      {/* Header con buscador y botón crear */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Filtros */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="all">Todos los estados</option>
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador</option>
            <option value="archivado">Archivado</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} />
            Crear Curso
          </button>
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            onView={(course) => setSelectedCourse(course)}
            onEdit={(course) => setCourseToEdit(course)}
            onDelete={(course) => setCourseToDelete(course)}
          />
        ))}
      </div>

      {/* Mensaje si no hay cursos */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">No se encontraron cursos</p>
        </div>
      )}

      {/* Modal de creación */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSave={(course) => {
            console.log('Curso creado:', course);
            setShowCreateModal(false);
          }}
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
