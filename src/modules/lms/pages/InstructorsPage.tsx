import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUserPlus,
  faEye,
  faEdit,
  faTrash,
  faEnvelope,
  faMapMarkerAlt,
  faBriefcase,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Instructor } from '../types';

// Datos mock
const mockInstructors: Instructor[] = [
  {
    id: '1',
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@email.com',
    email_verified_at: '2024-01-10',
    address: 'Av. Universitaria 456, Lima',
    birth_date: '1985-03-15',
    gender: 'M',
    country_location: 'PE',
    profile_photo: null,
    role: 'instructor',
    state: 'activo',
    last_access_ip: '192.168.1.10',
    last_access: '2024-03-15 14:20:00',
    created_at: '2023-12-01',
    updated_at: '2024-03-15',
    bio: 'Desarrollador Full Stack con más de 10 años de experiencia en tecnologías web.',
    expertise_area: 'Desarrollo Web, JavaScript, React, Node.js',
    status: 'activo',
  },
  {
    id: '2',
    first_name: 'María',
    last_name: 'González',
    email: 'maria.gonzalez@email.com',
    email_verified_at: '2024-01-12',
    address: 'Jr. Cusco 789, Lima',
    birth_date: '1990-07-20',
    gender: 'F',
    country_location: 'PE',
    profile_photo: null,
    role: 'instructor',
    state: 'activo',
    last_access_ip: '192.168.1.11',
    last_access: '2024-03-15 09:45:00',
    created_at: '2023-12-05',
    updated_at: '2024-03-15',
    bio: 'Especialista en Inteligencia Artificial y Machine Learning con doctorado en Ciencias de la Computación.',
    expertise_area: 'Inteligencia Artificial, Machine Learning, Python',
    status: 'activo',
  },
  {
    id: '3',
    first_name: 'Carlos',
    last_name: 'Ruiz',
    email: 'carlos.ruiz@email.com',
    email_verified_at: '2024-01-15',
    address: 'Av. Brasil 234, Lima',
    birth_date: '1988-11-05',
    gender: 'M',
    country_location: 'PE',
    profile_photo: null,
    role: 'instructor',
    state: 'inactivo',
    last_access_ip: '192.168.1.12',
    last_access: '2024-02-20 11:30:00',
    created_at: '2023-12-10',
    updated_at: '2024-02-20',
    bio: 'Diseñador UX/UI con experiencia en crear experiencias digitales excepcionales.',
    expertise_area: 'Diseño UX/UI, Figma, Adobe XD',
    status: 'inactivo',
  },
];

export const InstructorsPage = () => {
  const [instructors] = useState<Instructor[]>(mockInstructors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.expertise_area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || instructor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Buscar instructores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="all">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>

          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <FontAwesomeIcon icon={faUserPlus} />
            Agregar Instructor
          </button>
        </div>
      </div>

      {/* Grid de instructores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor, index) => (
          <div
            key={instructor.id}
            className="card p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header del card */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {instructor.first_name.charAt(0)}{instructor.last_name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg text-secondary-900 mb-1">
                  {instructor.first_name} {instructor.last_name}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faEnvelope} className="text-secondary-400" />
                  <span className="text-secondary-600">{instructor.email}</span>
                  {instructor.email_verified_at && (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xs" />
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-secondary-700 mb-4 line-clamp-2">
              {instructor.bio}
            </p>

            {/* Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
              <div className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faBriefcase} className="text-blue-600 mt-1" />
                <span className="text-secondary-700 flex-1">{instructor.expertise_area}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600" />
                <span className="text-secondary-700">{instructor.country_location}</span>
              </div>
            </div>

            {/* Estado y acciones */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  instructor.status === 'activo'
                    ? 'bg-green-100 text-green-700'
                    : instructor.status === 'inactivo'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInstructor(instructor)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">No se encontraron instructores</p>
        </div>
      )}

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-blue-700 mb-1">Total de Instructores</p>
          <p className="text-3xl font-heading font-bold text-blue-900">{instructors.length}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-green-700 mb-1">Instructores Activos</p>
          <p className="text-3xl font-heading font-bold text-green-900">
            {instructors.filter(i => i.status === 'activo').length}
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-orange-50 to-orange-100">
          <p className="text-sm text-orange-700 mb-1">Áreas de Expertise</p>
          <p className="text-3xl font-heading font-bold text-orange-900">
            {new Set(instructors.map(i => i.expertise_area.split(',')[0])).size}
          </p>
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-secondary-900">
                  Detalles del Instructor
                </h2>
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {selectedInstructor.first_name.charAt(0)}{selectedInstructor.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">
                    {selectedInstructor.first_name} {selectedInstructor.last_name}
                  </h3>
                  <p className="text-secondary-600">{selectedInstructor.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Estado</label>
                  <p className="font-semibold text-secondary-900">{selectedInstructor.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">País</label>
                  <p className="font-semibold text-secondary-900">{selectedInstructor.country_location}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-secondary-600">Biografía</label>
                  <p className="text-secondary-900">{selectedInstructor.bio}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-secondary-600">Áreas de Expertise</label>
                  <p className="text-secondary-900">{selectedInstructor.expertise_area}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
