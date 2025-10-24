import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faMoneyBill,
  faCalendar,
  faCode,
  faFileAlt,
  faStar,
  faListAlt,
  faPlus,
  faVideo,
  faTrash,
  faArrowLeft,
  faUsers,
  faCheckCircle,
  faExclamationCircle,
  faLink,
  faFile,
  faFilePdf,
  faFileWord,
  faFilePowerpoint,
} from '@fortawesome/free-solid-svg-icons';
import type { Course, Group, Class, ClassMaterial } from '../types';
import { coursesService, groupService, classService, classMaterialService } from '../services';
import { AddClassModal } from '../components/AddClassModal';
import { AddClassMaterialModal } from '../components/AddClassMaterialModal';

export const CourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [materials, setMaterials] = useState<ClassMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState<number | null>(null);
  const [expandedClassIds, setExpandedClassIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (course?.course_id) {
      fetchGroupsAndClasses();
    }
  }, [course?.course_id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await coursesService.getAll();
      const foundCourse = data.courses.find((c: Course) =>
        String(c.course_id || c.id) === courseId
      );
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        navigate('/lms-courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/lms-courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupsAndClasses = async () => {
    try {
      setLoadingClasses(true);
      const groupsData = await groupService.getByCourseId(course!.course_id || 0);
      setGroups(groupsData);

      // Si hay grupos, obtener todas las clases y materiales
      if (groupsData.length > 0) {
        const allClasses: Class[] = [];
        const allMaterials: ClassMaterial[] = [];

        for (const group of groupsData) {
          const groupClasses = await classService.getByGroupId(group.id);
          allClasses.push(...groupClasses);

          // Para cada clase, obtener sus materiales
          for (const classItem of groupClasses) {
            const classMaterials = await classMaterialService.getByClassId(classItem.id);
            allMaterials.push(...classMaterials);
          }
        }

        setClasses(allClasses);
        setMaterials(allMaterials);
      }
    } catch (error) {
      console.error('Error fetching groups and classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleAddClass = (groupId?: number) => {
    // Si se pasa un groupId específico, lo usa, sino usa el primer grupo disponible
    if (groupId) {
      setSelectedGroupId(groupId);
    } else if (groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
    setShowAddClassModal(true);
  };

  const handleClassAdded = async () => {
    setShowAddClassModal(false);
    setSelectedGroupId(null);
    await fetchGroupsAndClasses();
  };

  const handleDeleteClass = async (classId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      return;
    }

    try {
      setDeletingClassId(classId);
      await classService.delete(classId);
      await fetchGroupsAndClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error al eliminar la clase. Por favor, intenta de nuevo.');
    } finally {
      setDeletingClassId(null);
    }
  };

  const handleAddMaterial = (classId: number) => {
    setSelectedClassId(classId);
    setShowAddMaterialModal(true);
  };

  const handleMaterialAdded = async () => {
    setShowAddMaterialModal(false);
    setSelectedClassId(null);
    await fetchGroupsAndClasses();
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
      return;
    }

    try {
      setDeletingMaterialId(materialId);
      await classMaterialService.delete(materialId);
      await fetchGroupsAndClasses();
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error al eliminar el material. Por favor, intenta de nuevo.');
    } finally {
      setDeletingMaterialId(null);
    }
  };

  const toggleClassExpanded = (classId: number) => {
    setExpandedClassIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string | boolean) => {
    const isActive = typeof status === 'boolean' ? status : status === 'publicado';
    return isActive
      ? 'bg-success/20 text-green-700'
      : 'bg-warning/20 text-yellow-700';
  };

  const getStatusLabel = (status: string | boolean) => {
    const isActive = typeof status === 'boolean' ? status : status === 'publicado';
    return isActive ? 'Publicado' : 'Borrador';
  };

  const getLevelBadge = (level?: string) => {
    const styles = {
      basic: 'bg-blue-500/20 text-blue-700',
      intermediate: 'bg-orange-500/20 text-orange-700',
      advanced: 'bg-red-500/20 text-red-700',
    };
    return styles[level as keyof typeof styles] || styles.basic;
  };

  const getLevelLabel = (level?: string) => {
    const labels = {
      basic: 'Básico',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[level as keyof typeof labels] || 'Básico';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getClassStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: 'bg-blue-500/20 text-blue-400',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
      COMPLETED: 'bg-green-500/20 text-green-400',
      CANCELLED: 'bg-red-500/20 text-red-400',
    };
    return styles[status as keyof typeof styles] || styles.SCHEDULED;
  };

  const getClassStatusLabel = (status: string) => {
    const labels = {
      SCHEDULED: 'Programada',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getClassesByGroup = (groupId: number) => {
    return classes
      .filter(c => c.group_id === groupId)
      .sort((a, b) => new Date(a.class_date).getTime() - new Date(b.class_date).getTime());
  };

  const formatTime = (time: string) => {
    // Formato: "09:00:00" -> "09:00"
    return time.substring(0, 5);
  };

  const getMaterialsByClass = (classId: number) => {
    return materials.filter(m => m.class_id === classId);
  };

  const getMaterialIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return faFilePdf;
      case 'VIDEO':
        return faVideo;
      case 'DOCUMENT':
        return faFileWord;
      case 'PRESENTATION':
        return faFilePowerpoint;
      case 'LINK':
        return faLink;
      default:
        return faFile;
    }
  };

  const getMaterialTypeBadge = (type: string) => {
    const styles = {
      PDF: 'bg-red-500/20 text-red-400',
      VIDEO: 'bg-purple-500/20 text-purple-400',
      DOCUMENT: 'bg-blue-500/20 text-blue-400',
      PRESENTATION: 'bg-orange-500/20 text-orange-400',
      LINK: 'bg-green-500/20 text-green-400',
      OTHER: 'bg-gray-500/20 text-gray-400',
    };
    return styles[type.toUpperCase() as keyof typeof styles] || styles.OTHER;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con botón de volver */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/lms-courses')}
            className="btn bg-secondary-600 text-white hover:bg-secondary-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              {course.title}
            </h1>
            <p className="text-gray-400">Detalles del curso</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {course.bestseller && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              Bestseller
            </span>
          )}
          {course.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              Destacado
            </span>
          )}
          {course.highest_rated && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              Mejor Valorado
            </span>
          )}
          {course.level && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadge(course.level)}`}>
              {getLevelLabel(course.level)}
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status)}`}>
            {getStatusLabel(course.status)}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-6">
        {/* Imagen del curso */}
        {course.course_image && (
          <div className="w-full bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg overflow-hidden shadow-xl">
            <img
              src={course.course_image}
              alt={course.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Descripción */}
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-heading font-semibold text-white mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileAlt} className="text-orange-500" />
            Descripción
          </h3>
          <p className="text-white whitespace-pre-wrap leading-relaxed">{course.description}</p>
        </div>

        {/* Grid de información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faCode} className="text-primary-600" />
              Código
            </label>
            <p className="text-white font-semibold text-lg">{course.code}</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faClock} className="text-purple-600" />
              Duración
            </label>
            <p className="text-white font-semibold text-lg">{course.duration} horas</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faListAlt} className="text-blue-600" />
              Sesiones
            </label>
            <p className="text-white font-semibold text-lg">{course.sessions}</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
              Precio de Venta
            </label>
            <p className="text-white font-semibold text-lg">S/. {course.selling_price?.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faMoneyBill} className="text-yellow-600" />
              Precio con Descuento
            </label>
            <p className="text-white font-semibold text-lg">
              {course.discount_price ? `S/. ${course.discount_price.toFixed(2)}` : 'Sin descuento'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-4 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
              Fecha de Creación
            </label>
            <p className="text-white font-semibold">{formatDate(course.created_at)}</p>
          </div>
        </div>

        {/* Sección de Clases */}
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faListAlt} className="text-green-600" />
              Clases del Curso
            </h3>
            {groups.length > 0 && (
              <button
                onClick={() => setShowAddClassModal(true)}
                className="btn bg-primary-600 text-white hover:bg-primary-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Clase
              </button>
            )}
          </div>

          {loadingClasses ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-3 text-sm text-gray-400">Cargando clases...</p>
              </div>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No hay grupos disponibles para este curso</p>
              <p className="text-gray-500 text-sm mt-2">Se necesita al menos un grupo para poder agregar clases</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No hay clases programadas</p>
              <p className="text-gray-500 text-sm mt-2">Haz clic en "Agregar Clase" para crear la primera clase</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Lista de clases agrupadas por grupo */}
              {groups.map((group) => {
                const groupClasses = getClassesByGroup(group.id);
                if (groupClasses.length === 0) return null;

                return (
                  <div key={group.id} className="space-y-3">
                    {/* Encabezado del grupo */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 font-bold text-sm">
                        <FontAwesomeIcon icon={faUsers} />
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-white">{group.name}</h4>
                        <p className="text-xs text-gray-400">
                          {group.code} • {formatDate(group.start_date)} - {formatDate(group.end_date)}
                        </p>
                      </div>
                    </div>

                    {/* Clases del grupo */}
                    {groupClasses.map((classItem) => {
                      const classMaterials = getMaterialsByClass(classItem.id);
                      const isExpanded = expandedClassIds.has(classItem.id);

                      return (
                        <div key={classItem.id} className="ml-11">
                          <div className="flex items-center gap-3 p-4 bg-secondary-700/50 rounded-lg hover:bg-secondary-600/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faVideo} className="text-primary-400" />
                                <p className="text-white font-medium">{classItem.class_name}</p>
                                <span className={`px-2 py-1 rounded text-xs ${getClassStatusBadge(classItem.class_status)}`}>
                                  {getClassStatusLabel(classItem.class_status)}
                                </span>
                                {classMaterials.length > 0 && (
                                  <span className="px-2 py-1 rounded text-xs bg-primary-500/20 text-primary-400">
                                    {classMaterials.length} material{classMaterials.length > 1 ? 'es' : ''}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{classItem.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>
                                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                  {formatDate(classItem.class_date)}
                                </span>
                                <span>
                                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                                  {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                </span>
                                {classItem.meeting_url && (
                                  <a
                                    href={classItem.meeting_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-400 hover:text-primary-300"
                                  >
                                    <FontAwesomeIcon icon={faVideo} className="mr-1" />
                                    Unirse a la reunión
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddMaterial(classItem.id)}
                                className="btn bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 border border-primary-600/30 hover:border-primary-600 py-2 px-3 text-xs transition-all duration-300"
                                title="Agregar material"
                              >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                Material
                              </button>
                              {classMaterials.length > 0 && (
                                <button
                                  onClick={() => toggleClassExpanded(classItem.id)}
                                  className="btn bg-secondary-500 text-gray-300 hover:bg-secondary-400 py-2 px-3 text-xs transition-all duration-300"
                                  title={isExpanded ? 'Ocultar materiales' : 'Ver materiales'}
                                >
                                  {isExpanded ? '▼' : '▶'}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteClass(classItem.id)}
                                disabled={deletingClassId === classItem.id}
                                className="btn bg-danger/20 text-danger hover:bg-danger/30 border border-danger/30 hover:border-danger py-2 px-3 text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Eliminar clase"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className={deletingClassId === classItem.id ? 'animate-pulse' : ''}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Materiales de la clase */}
                          {isExpanded && classMaterials.length > 0 && (
                            <div className="mt-2 ml-4 space-y-2">
                              {classMaterials.map((material) => (
                                <div
                                  key={material.id}
                                  className="flex items-center gap-3 p-3 bg-secondary-600/30 rounded-lg hover:bg-secondary-600/50 transition-colors"
                                >
                                  <FontAwesomeIcon
                                    icon={getMaterialIcon(material.type)}
                                    className="text-primary-400 text-lg"
                                  />
                                  <div className="flex-1">
                                    <a
                                      href={material.material_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white hover:text-primary-400 transition-colors text-sm font-medium"
                                    >
                                      {material.material_url}
                                    </a>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs ${getMaterialTypeBadge(material.type)}`}>
                                    {material.type}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteMaterial(material.id)}
                                    disabled={deletingMaterialId === material.id}
                                    className="btn bg-danger/20 text-danger hover:bg-danger/30 border border-danger/30 hover:border-danger py-1 px-2 text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Eliminar material"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className={deletingMaterialId === material.id ? 'animate-pulse' : ''}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar clase */}
      {showAddClassModal && (
        <AddClassModal
          groupId={selectedGroupId || undefined}
          courseId={course?.course_id || undefined}
          onClose={() => {
            setShowAddClassModal(false);
            setSelectedGroupId(null);
          }}
          onSave={handleClassAdded}
        />
      )}

      {/* Modal para agregar material */}
      {showAddMaterialModal && selectedClassId !== null && (
        <AddClassMaterialModal
          classId={selectedClassId}
          onClose={() => {
            setShowAddMaterialModal(false);
            setSelectedClassId(null);
          }}
          onSave={handleMaterialAdded}
        />
      )}
    </div>
  );
};
