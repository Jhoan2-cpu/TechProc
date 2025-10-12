import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
import { instructorsService } from '../services';
import { EditInstructorModal, CreateInstructorModal, InstructorFilters, InstructorStatsCards } from '../components';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [instructorToEdit, setInstructorToEdit] = useState<Instructor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const data = await instructorsService.getAll();
        setInstructors(data.instructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando instructores...</p>
        </div>
      </div>
    );
  }

  const handleDeleteInstructor = async () => {
    if (instructorToDelete) {
      try {
        await instructorsService.delete(instructorToDelete.id);
        setInstructors(instructors.filter(i => i.id !== instructorToDelete.id));
        setInstructorToDelete(null);
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('No se puede eliminar el instructor. La API no soporta esta operación.');
      }
    }
  };

  const handleEditInstructor = async (updatedInstructor: Instructor) => {
    try {
      // TODO: Adaptar los datos al formato de la API
      // const updated = await instructorsService.update(updatedInstructor.id, updatedInstructor);
      // setInstructors(instructors.map(i => i.id === updatedInstructor.id ? updated : i));
      setInstructors(instructors.map(i => i.id === updatedInstructor.id ? updatedInstructor : i));
      setInstructorToEdit(null);
    } catch (error) {
      console.error('Error updating instructor:', error);
    }
  };

  const handleCreateInstructor = async (newInstructorData: Omit<Instructor, 'id'>) => {
    try {
      // TODO: Adaptar los datos al formato de la API
      // const newInstructor = await instructorsService.create(newInstructorData);
      // setInstructors([newInstructor, ...instructors]);
      const newInstructor: Instructor = {
        ...newInstructorData,
        id: String(Math.max(...instructors.map(i => Number(i.id)), 0) + 1),
      };
      setInstructors([newInstructor, ...instructors]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating instructor:', error);
    }
  };

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
      <h1 className="text-3xl font-heading font-bold text-white mb-6">Instructores</h1>

      {/* Resumen */}
      <InstructorStatsCards instructors={instructors} />

      {/* Header con filtros */}
      <InstructorFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onCreateClick={() => setShowCreateModal(true)}
      />

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
                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  {instructor.first_name} {instructor.last_name}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  <span className="text-gray-400">{instructor.email}</span>
                  {instructor.email_verified_at && (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xs" />
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {instructor.bio}
            </p>

            {/* Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
              <div className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faBriefcase} className="text-blue-600 mt-1" />
                <span className="text-gray-300 flex-1">{instructor.expertise_area}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600" />
                <span className="text-gray-300">{instructor.country_location}</span>
              </div>
            </div>

            {/* Estado y acciones */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  instructor.status === 'activo'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : instructor.status === 'inactivo'
                    ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInstructor(instructor)}
                  className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  onClick={() => setInstructorToEdit(instructor)}
                  className="text-orange-400 hover:bg-orange-500/20 p-2 rounded-lg transition-colors"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => setInstructorToDelete(instructor)}
                  className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron instructores</p>
        </div>
      )}


      {/* Modal de detalles */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">
                  Detalles del Instructor
                </h2>
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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
                  <h3 className="text-xl font-bold text-white">
                    {selectedInstructor.first_name} {selectedInstructor.last_name}
                  </h3>
                  <p className="text-gray-300">{selectedInstructor.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Estado</label>
                  <p className="font-semibold text-white capitalize">{selectedInstructor.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">País</label>
                  <p className="font-semibold text-white">{selectedInstructor.country_location}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-400">Biografía</label>
                  <p className="text-gray-300 mt-1">{selectedInstructor.bio}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-400">Áreas de Expertise</label>
                  <p className="text-gray-300 mt-1">{selectedInstructor.expertise_area}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <CreateInstructorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateInstructor}
      />

      <EditInstructorModal
        instructor={instructorToEdit}
        isOpen={!!instructorToEdit}
        onClose={() => setInstructorToEdit(null)}
        onSave={handleEditInstructor}
      />

      <ConfirmDeleteModal
        isOpen={!!instructorToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar al instructor?"
        itemName={instructorToDelete ? `${instructorToDelete.first_name} ${instructorToDelete.last_name}` : ''}
        onConfirm={handleDeleteInstructor}
        onCancel={() => setInstructorToDelete(null)}
      />
    </div>
  );
};
