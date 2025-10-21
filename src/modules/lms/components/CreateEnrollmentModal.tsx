import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { CourseOffering, Student } from '../types';
import { courseOfferingsService, studentsService } from '../services';

interface CreateEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEnrollmentModal = ({ isOpen, onClose }: CreateEnrollmentModalProps) => {
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(new Set());
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [offeringsFilter, setOfferingsFilter] = useState('');
  const [studentsFilter, setStudentsFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [offeringsData, studentsData] = await Promise.all([
        courseOfferingsService.getAll(),
        studentsService.getAll()
      ]);
      setCourseOfferings(offeringsData || []);
      setStudents(studentsData.students || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOffering = (id: string) => {
    const newSelected = new Set(selectedOfferings);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOfferings(newSelected);
  };

  const toggleStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleClose = () => {
    setSelectedOfferings(new Set());
    setSelectedStudents(new Set());
    setOfferingsFilter('');
    setStudentsFilter('');
    onClose();
  };

  // Filtrar ofertas
  const filteredOfferings = courseOfferings.filter((offering) => {
    const searchLower = offeringsFilter.toLowerCase();
    return (
      offering.course?.title?.toLowerCase().includes(searchLower) ||
      offering.academic_period?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Filtrar estudiantes
  const filteredStudents = students.filter((student) => {
    const searchLower = studentsFilter.toLowerCase();
    return (
      student.first_name?.toLowerCase().includes(searchLower) ||
      student.last_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-500 to-primary-600 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-white">
              Matricular Estudiante
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary-500" />
              <span className="ml-3 text-gray-400">Cargando datos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Tabla de Ofertas de Cursos */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Ofertas de Cursos
                  {selectedOfferings.size > 0 && (
                    <span className="ml-2 text-sm text-primary-400">
                      ({selectedOfferings.size} seleccionada{selectedOfferings.size !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                {/* Filtro de búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar por curso o período..."
                  value={offeringsFilter}
                  onChange={(e) => setOfferingsFilter(e.target.value)}
                  className="input w-full"
                />
                <div className="card overflow-hidden max-h-[450px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-600 to-primary-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-12">
                          <input
                            type="checkbox"
                            checked={filteredOfferings.length > 0 && filteredOfferings.every(o => selectedOfferings.has(o.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newSelected = new Set(selectedOfferings);
                                filteredOfferings.forEach(o => newSelected.add(o.id));
                                setSelectedOfferings(newSelected);
                              } else {
                                const newSelected = new Set(selectedOfferings);
                                filteredOfferings.forEach(o => newSelected.delete(o.id));
                                setSelectedOfferings(newSelected);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Período
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                      {filteredOfferings.map((offering) => (
                        <tr
                          key={offering.id}
                          onClick={() => toggleOffering(offering.id)}
                          className="hover:bg-primary-500/10 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedOfferings.has(offering.id)}
                              onChange={() => toggleOffering(offering.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-white">
                              {offering.course?.title || 'Sin título'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-300">
                              {offering.academic_period?.name || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOfferings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        {courseOfferings.length === 0 ? 'No hay ofertas disponibles' : 'No se encontraron resultados'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de Estudiantes */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Estudiantes
                  {selectedStudents.size > 0 && (
                    <span className="ml-2 text-sm text-primary-400">
                      ({selectedStudents.size} seleccionado{selectedStudents.size !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                {/* Filtro de búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={studentsFilter}
                  onChange={(e) => setStudentsFilter(e.target.value)}
                  className="input w-full"
                />
                <div className="card overflow-hidden max-h-[450px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-600 to-primary-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-12">
                          <input
                            type="checkbox"
                            checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newSelected = new Set(selectedStudents);
                                filteredStudents.forEach(s => newSelected.add(s.id));
                                setSelectedStudents(newSelected);
                              } else {
                                const newSelected = new Set(selectedStudents);
                                filteredStudents.forEach(s => newSelected.delete(s.id));
                                setSelectedStudents(newSelected);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          onClick={() => toggleStudent(student.id)}
                          className="hover:bg-primary-500/10 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(student.id)}
                              onChange={() => toggleStudent(student.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-white">
                              {student.first_name} {student.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-300">
                              {student.email}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        {students.length === 0 ? 'No hay estudiantes disponibles' : 'No se encontraron resultados'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end p-6 pt-4 border-t border-secondary-200">
          <button
            onClick={handleClose}
            className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
          >
            Cancelar
          </button>
          <button
            disabled
            className="btn btn-primary opacity-50 cursor-not-allowed"
            title="Funcionalidad próximamente"
          >
            Matricular
          </button>
        </div>
      </div>
    </div>
  );
};
