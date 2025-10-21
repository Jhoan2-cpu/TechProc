import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { CreateCourseOfferingData, Course, AcademicPeriod, Instructor } from '../types';
import { coursesService, academicPeriodsService, instructorsService } from '../services';

interface CreateCourseOfferingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCourseOfferingData) => Promise<void>;
}

export const CreateCourseOfferingModal = ({ isOpen, onClose, onSave }: CreateCourseOfferingModalProps) => {
  const [formData, setFormData] = useState<CreateCourseOfferingData>({
    course_id: 0,
    academic_period_id: 0,
    instructor_id: null,
    schedule: '',
    delivery_method: 'regular',
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Datos para los selectores
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      setError('');

      const [coursesData, periodsData, instructorsData] = await Promise.all([
        coursesService.getAll(),
        academicPeriodsService.getAll(),
        instructorsService.getAll(),
      ]);

      setCourses(coursesData.courses || []);
      setAcademicPeriods(periodsData || []);
      setInstructors(instructorsData.instructors || []);
    } catch (err: any) {
      setError('Error al cargar los datos del formulario');
      console.error('Error loading form data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la oferta de curso');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: 0,
      academic_period_id: 0,
      instructor_id: null,
      schedule: '',
      delivery_method: 'regular',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-500 to-primary-600 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-white">
              Crear Oferta de Curso
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary-500" />
              <span className="ml-3 text-gray-400">Cargando datos...</span>
            </div>
          ) : (
            <>
              {/* Curso */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Curso *
                </label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                  className="select w-full"
                  disabled={loading}
                >
                  <option value={0}>Selecciona un curso</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.course_id || course.id}>
                      {course.title} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Periodo Académico */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Periodo Académico *
                </label>
                <select
                  required
                  value={formData.academic_period_id}
                  onChange={(e) => setFormData({ ...formData, academic_period_id: parseInt(e.target.value) })}
                  className="select w-full"
                  disabled={loading}
                >
                  <option value={0}>Selecciona un periodo</option>
                  {academicPeriods.map((period) => (
                    <option key={period.id} value={period.academic_period_id || period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instructor (Opcional)
                </label>
                <select
                  value={formData.instructor_id || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    instructor_id: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="select w-full"
                  disabled={loading}
                >
                  <option value="">Sin instructor asignado</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.instructor_id || instructor.id}>
                      {instructor.first_name} {instructor.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horario (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: Lunes y Miércoles 10:00-12:00"
                  disabled={loading}
                />
              </div>

              {/* Método de entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modalidad
                </label>
                <select
                  value={formData.delivery_method}
                  onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
                  className="select w-full"
                  disabled={loading}
                >
                  <option value="regular">Presencial</option>
                  <option value="online">En línea</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingData}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                'Crear Oferta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
