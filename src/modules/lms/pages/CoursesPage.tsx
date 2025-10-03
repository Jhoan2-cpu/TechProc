import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faClock,
  faMoneyBill,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';
import type { Course } from '../types';
import { CreateCourseModal } from '../components/CreateCourseModal';

// Datos mock
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Desarrollo Web Full Stack',
    code: 'WEB-101',
    description: 'Aprende a desarrollar aplicaciones web desde cero con las últimas tecnologías.',
    instructor_id: '1',
    instructor: {
      id: '1',
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@email.com',
      email_verified_at: null,
      address: 'Lima, Perú',
      birth_date: '1985-03-15',
      gender: 'M',
      country_location: 'PE',
      profile_photo: null,
      role: 'instructor',
      state: 'activo',
      last_access_ip: null,
      last_access: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      bio: 'Desarrollador Full Stack con 10 años de experiencia',
      expertise_area: 'Desarrollo Web',
      status: 'activo',
    },
    duration_weeks: 12,
    price: 299.90,
    status: 'publicado',
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
  },
  {
    id: '2',
    title: 'Inteligencia Artificial',
    code: 'IA-201',
    description: 'Domina los conceptos fundamentales de IA y Machine Learning.',
    instructor_id: '2',
    instructor: {
      id: '2',
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@email.com',
      email_verified_at: null,
      address: 'Lima, Perú',
      birth_date: '1990-07-20',
      gender: 'F',
      country_location: 'PE',
      profile_photo: null,
      role: 'instructor',
      state: 'activo',
      last_access_ip: null,
      last_access: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      bio: 'Especialista en IA y Data Science',
      expertise_area: 'Inteligencia Artificial',
      status: 'activo',
    },
    duration_weeks: 16,
    price: 499.90,
    status: 'publicado',
    created_at: '2024-03-14',
    updated_at: '2024-03-14',
  },
  {
    id: '3',
    title: 'Diseño UX/UI',
    code: 'DIS-150',
    description: 'Crea experiencias de usuario excepcionales y diseños atractivos.',
    instructor_id: '3',
    duration_weeks: 8,
    price: 199.90,
    status: 'borrador',
    created_at: '2024-03-13',
    updated_at: '2024-03-13',
  },
];

export const CoursesPage = () => {
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const styles = {
      publicado: 'bg-green-100 text-green-700',
      borrador: 'bg-yellow-100 text-yellow-700',
      archivado: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.borrador;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
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
          <div
            key={course.id}
            className="card p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header del card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg text-secondary-900 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-2">
                  Código: <span className="font-semibold">{course.code}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Info del curso */}
            <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
              {course.instructor && (
                <div className="flex items-center gap-2 text-sm text-secondary-700">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600" />
                  <span>{course.instructor.first_name} {course.instructor.last_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-secondary-700">
                <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                <span>{course.duration_weeks} semanas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-700">
                <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
                <span className="font-semibold">S/. {course.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button className="flex-1 btn bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 text-sm">
                <FontAwesomeIcon icon={faEye} className="mr-1" />
                Ver
              </button>
              <button className="flex-1 btn bg-orange-100 text-orange-700 hover:bg-orange-200 py-2 text-sm">
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                Editar
              </button>
              <button className="btn bg-red-100 text-red-700 hover:bg-red-200 py-2 px-3 text-sm">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
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
    </div>
  );
};
