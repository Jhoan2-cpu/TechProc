import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faEnvelope,
  faMapMarkerAlt,
  faCalendar,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Student, Course, Enrollment } from '../types';
import { studentsService, coursesService, enrollmentsService } from '../services';
import { EditStudentModal, ViewStudentModal, CreateStudentModal, StudentFilters } from '../components';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToView, setStudentToView] = useState<Student | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, coursesData, enrollmentsData] = await Promise.all([
          studentsService.getAll(),
          coursesService.getAll(),
          enrollmentsService.getAll(),
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setStudentToDelete(null);
    }
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setStudentToEdit(null);
  };

  const handleCreateStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: String(Math.max(...students.map(s => Number(s.id)), 0) + 1),
    };
    setStudents([newStudent, ...students]);
    setShowCreateModal(false);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === 'all' || student.state === filterState;

    // Filtrar por curso: verificar si el estudiante está inscrito en el curso seleccionado
    const matchesCourse = filterCourse === 'all' ||
      enrollments.some(enrollment =>
        enrollment.student_id === student.id &&
        enrollment.course_id === filterCourse
      );

    return matchesSearch && matchesState && matchesCourse;
  });

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-6">lms/students</h1>

      {/* Header con filtros */}
      <StudentFilters
        searchTerm={searchTerm}
        filterState={filterState}
        filterCourse={filterCourse}
        courses={courses}
        onSearchChange={setSearchTerm}
        onStateChange={setFilterState}
        onCourseChange={setFilterCourse}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {/* Tabla de estudiantes */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-600/50 border-b border-secondary-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Estudiante</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Ubicación</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Último Acceso</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-600/50 transition-colors animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-300">{student.email}</span>
                      {student.email_verified_at ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xs" title="Email verificado" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 text-xs" title="Email no verificado" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-300">{student.country_location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-300">
                        {student.last_access
                          ? new Date(student.last_access).toLocaleDateString('es-ES')
                          : 'Nunca'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.state === 'activo'
                          ? 'bg-success/20 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {student.state.charAt(0).toUpperCase() + student.state.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setStudentToView(student)}
                        className="text-blue-600 hover:bg-primary-900/20 p-2 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => setStudentToEdit(student)}
                        className="text-orange-600 hover:bg-orange-900/20 p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(student)}
                        className="text-red-600 hover:bg-danger/20 p-2 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron estudiantes</p>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-sm text-purple-700 mb-1">Total de Estudiantes</p>
          <p className="text-3xl font-heading font-bold text-purple-400">{students.length}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-green-700 mb-1">Estudiantes Activos</p>
          <p className="text-3xl font-heading font-bold text-success">
            {students.filter(s => s.state === 'activo').length}
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-blue-700 mb-1">Emails Verificados</p>
          <p className="text-3xl font-heading font-bold text-primary-400">
            {students.filter(s => s.email_verified_at).length}
          </p>
        </div>
      </div>

      {/* Modales */}
      <CreateStudentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateStudent}
      />

      <ViewStudentModal
        student={studentToView}
        isOpen={!!studentToView}
        onClose={() => setStudentToView(null)}
      />

      <EditStudentModal
        student={studentToEdit}
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSave={handleEditStudent}
      />

      <ConfirmDeleteModal
        isOpen={!!studentToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar al estudiante?"
        itemName={studentToDelete ? `${studentToDelete.first_name} ${studentToDelete.last_name}` : ''}
        onConfirm={handleDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};
