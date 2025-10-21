import { useState, useEffect } from 'react';
import { faBook, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import type { Course, CourseOffering, CreateCourseOfferingData } from '../types';
import {
  CreateCourseModal,
  CourseCard,
  ViewCourseModal,
  CourseFilters,
  CreateCourseOfferingModal,
  CourseOfferingsTable,
  Tabs,
  TabPanel
} from '../components';
import { coursesService, courseOfferingsService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const CoursesPage = () => {
  // Estado de tabs
  const [activeTab, setActiveTab] = useState('courses');

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

  // Estados de ofertas de cursos
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loadingOfferings, setLoadingOfferings] = useState(false);
  const [showCreateOfferingModal, setShowCreateOfferingModal] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<CourseOffering | null>(null);

  // Definición de tabs
  const tabs = [
    { id: 'courses', label: 'Cursos', icon: faBook },
    { id: 'offerings', label: 'Ofertas de Cursos', icon: faCalendarAlt },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === 'offerings') {
      fetchOfferings();
    }
  }, [activeTab]);

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

  const fetchOfferings = async () => {
    try {
      setLoadingOfferings(true);
      const data = await courseOfferingsService.getAll();
      setOfferings(data);
    } catch (err: any) {
      console.error('Error fetching offerings:', err);
    } finally {
      setLoadingOfferings(false);
    }
  };

  const handleCreateOffering = async (data: CreateCourseOfferingData) => {
    try {
      await courseOfferingsService.create(data);
      setShowCreateOfferingModal(false);
      fetchOfferings();
    } catch (error) {
      console.error('Error creating course offering:', error);
      throw error;
    }
  };

  const handleDeleteOffering = async () => {
    if (offeringToDelete) {
      try {
        await courseOfferingsService.delete(offeringToDelete.id);
        setOfferings(offerings.filter(o => o.id !== offeringToDelete.id));
        setOfferingToDelete(null);

        // Recargar la lista de ofertas para asegurar que esté actualizada
        fetchOfferings();
      } catch (error) {
        console.error('Error deleting course offering:', error);
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
          <p className="text-gray-400">Administra cursos y sus ofertas académicas</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panel: Cursos */}
      <TabPanel isActive={activeTab === 'courses'}>
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
              onView={(course) => setSelectedCourse(course)}
              onEdit={(course) => setCourseToEdit(course)}
              onDelete={(course) => setCourseToDelete(course)}
            />
          ))}
        </div>

        {/* Mensaje si no hay cursos */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron cursos</p>
          </div>
        )}
      </TabPanel>

      {/* Tab Panel: Ofertas de Cursos */}
      <TabPanel isActive={activeTab === 'offerings'}>
        <div className="space-y-6">
          {/* Header con botón */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowCreateOfferingModal(true)}
              className="btn btn-primary"
            >
              Crear Oferta
            </button>
          </div>

          {/* Tabla de ofertas */}
          <CourseOfferingsTable
            offerings={offerings}
            loading={loadingOfferings}
            onDelete={(offering) => setOfferingToDelete(offering)}
          />
        </div>
      </TabPanel>

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

      {/* Modal de crear oferta de curso */}
      <CreateCourseOfferingModal
        isOpen={showCreateOfferingModal}
        onClose={() => setShowCreateOfferingModal(false)}
        onSave={handleCreateOffering}
      />

      {/* Modal de confirmación de eliminación de oferta */}
      <ConfirmDeleteModal
        isOpen={!!offeringToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta oferta de curso?"
        itemName={offeringToDelete ? `${offeringToDelete.course?.title || 'Curso'} - ${offeringToDelete.academic_period?.name || 'Período'}` : ''}
        onConfirm={handleDeleteOffering}
        onCancel={() => setOfferingToDelete(null)}
      />
    </div>
  );
};
