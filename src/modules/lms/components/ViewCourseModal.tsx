import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faClock,
  faMoneyBill,
  faCalendar,
  faCode,
  faFileAlt,
  faStar,
  faListAlt,
  faPlus,
  faVideo,
  faFile,
  faLink,
  faBullhorn,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Course, CourseContentItem } from '../types';
import { courseContentsService } from '../services';
import { AddContentModal } from './AddContentModal';

interface ViewCourseModalProps {
  course: Course;
  onClose: () => void;
}

export const ViewCourseModal = ({ course, onClose }: ViewCourseModalProps) => {
  const [contents, setContents] = useState<CourseContentItem[]>([]);
  const [loadingContents, setLoadingContents] = useState(true);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [deletingContentId, setDeletingContentId] = useState<number | null>(null);

  useEffect(() => {
    fetchContents();
  }, [course.course_id]);

  const fetchContents = async () => {
    try {
      setLoadingContents(true);
      const data = await courseContentsService.getByCourseId(course.course_id || 0);
      setContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoadingContents(false);
    }
  };

  const handleAddContent = (sessionNumber: number) => {
    setSelectedSession(sessionNumber);
    setShowAddContentModal(true);
  };

  const handleContentAdded = async () => {
    setShowAddContentModal(false);
    setSelectedSession(null);
    await fetchContents();
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      return;
    }

    try {
      setDeletingContentId(contentId);
      await courseContentsService.delete(contentId);
      await fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error al eliminar el contenido. Por favor, intenta de nuevo.');
    } finally {
      setDeletingContentId(null);
    }
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

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return faVideo;
      case 'pdf':
        return faFile;
      case 'link':
        return faLink;
      case 'anuncio':
        return faBullhorn;
      default:
        return faFileAlt;
    }
  };

  const getContentsBySession = (sessionNumber: number) => {
    return contents
      .filter(c => c.session === sessionNumber)
      .sort((a, b) => a.order_number - b.order_number);
  };

  // Generar array de sesiones basado en el número de sesiones del curso
  const sessions = Array.from({ length: course.sessions || 0 }, (_, i) => i + 1);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-white">
                {course.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Detalles del curso
              </p>
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
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>

          {/* Body - Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Imagen del curso */}
              {course.course_image && (
                <div className="w-full max-w-3xl mx-auto">
                  <img
                    src={course.course_image}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Descripción */}
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-white mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileAlt} className="text-orange-500" />
                  Descripción
                </h3>
                <p className="text-white whitespace-pre-wrap leading-relaxed">{course.description}</p>
              </div>

              {/* Grid de información principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faCode} className="text-primary-600" />
                    Código
                  </label>
                  <p className="text-white font-semibold text-lg">{course.code}</p>
                </div>

                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                    Duración
                  </label>
                  <p className="text-white font-semibold text-lg">{course.duration} horas</p>
                </div>

                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faListAlt} className="text-blue-600" />
                    Sesiones
                  </label>
                  <p className="text-white font-semibold text-lg">{course.sessions}</p>
                </div>

                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-green-600" />
                    Precio de Venta
                  </label>
                  <p className="text-white font-semibold text-lg">S/. {course.selling_price?.toFixed(2)}</p>
                </div>

                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-yellow-600" />
                    Precio con Descuento
                  </label>
                  <p className="text-white font-semibold text-lg">
                    {course.discount_price ? `S/. ${course.discount_price.toFixed(2)}` : 'Sin descuento'}
                  </p>
                </div>

                <div className="bg-secondary-600/50 rounded-lg p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary-600" />
                    Fecha de Creación
                  </label>
                  <p className="text-white font-semibold">{formatDate(course.created_at)}</p>
                </div>
              </div>

              {/* Sección de Contenido */}
              <div className="bg-secondary-600/50 rounded-lg p-6">
                <h3 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faListAlt} className="text-green-600" />
                  Contenido del Curso
                </h3>

                {loadingContents ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-3 text-sm text-gray-400">Cargando contenidos...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((sessionNumber) => {
                      const sessionContents = getContentsBySession(sessionNumber);
                      return (
                        <div key={sessionNumber} className="bg-secondary-700/50 rounded-lg p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 font-bold text-sm">
                                {sessionNumber}
                              </span>
                              Sesión {sessionNumber}
                            </h4>
                            <button
                              onClick={() => handleAddContent(sessionNumber)}
                              className="btn bg-primary-600 text-white hover:bg-primary-700 text-sm py-2 px-4"
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-2" />
                              Agregar Contenido
                            </button>
                          </div>

                          {sessionContents.length > 0 ? (
                            <div className="space-y-2 mt-3">
                              {sessionContents.map((content) => (
                                <div
                                  key={content.id}
                                  className="flex items-center gap-3 p-3 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-colors"
                                >
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-600/20 text-primary-400 font-semibold text-xs">
                                    {content.order_number}
                                  </span>
                                  <FontAwesomeIcon
                                    icon={getContentIcon(content.type)}
                                    className="text-primary-400"
                                  />
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{content.title}</p>
                                    <p className="text-xs text-gray-400 line-clamp-1">{content.content}</p>
                                  </div>
                                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                                    {content.type}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteContent(content.id)}
                                    disabled={deletingContentId === content.id}
                                    className="btn bg-danger/20 text-danger hover:bg-danger/30 border border-danger/30 hover:border-danger py-1 px-2 text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Eliminar contenido"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className={deletingContentId === content.id ? 'animate-pulse' : ''}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm italic">No hay contenidos en esta sesión</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-600/50">
            <button
              onClick={onClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar contenido */}
      {showAddContentModal && selectedSession !== null && (
        <AddContentModal
          courseId={course.course_id || 0}
          sessionNumber={selectedSession}
          existingContentsCount={getContentsBySession(selectedSession).length}
          onClose={() => {
            setShowAddContentModal(false);
            setSelectedSession(null);
          }}
          onSave={handleContentAdded}
        />
      )}
    </>
  );
};
