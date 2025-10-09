import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTrash,
  faFilePdf,
  faVideo,
  faLink,
  faBullhorn,
} from '@fortawesome/free-solid-svg-icons';
import type { Course, ContentType, CourseStatus } from '../types';

interface CreateCourseModalProps {
  course?: Course;
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
}

interface ContentItem {
  id: string;
  week: number;
  session: number;
  type: ContentType;
  title: string;
  content: string;
}

export const CreateCourseModal = ({ course, onClose, onSave }: CreateCourseModalProps) => {
  const isEditing = !!course;

  const [formData, setFormData] = useState({
    title: course?.title || '',
    code: course?.code || '',
    description: course?.description || '',
    instructor_id: course?.instructor_id?.toString() || '',
    duration_weeks: course?.duration_weeks || 4,
    price: course?.price || 0,
    status: course?.status || 'borrador' as CourseStatus,
  });

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  const contentTypes = [
    { value: 'pdf', label: 'PDF', icon: faFilePdf, color: 'text-red-600' },
    { value: 'video', label: 'Video', icon: faVideo, color: 'text-blue-600' },
    { value: 'link', label: 'Enlace', icon: faLink, color: 'text-purple-600' },
    { value: 'anuncio', label: 'Anuncio', icon: faBullhorn, color: 'text-orange-600' },
  ];

  const handleAddContent = (type: ContentType) => {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      week: currentWeek,
      session: contents.filter(c => c.week === currentWeek).length + 1,
      type,
      title: '',
      content: '',
    };
    setContents([...contents, newContent]);
  };

  const handleRemoveContent = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
  };

  const handleContentChange = (id: string, field: 'title' | 'content', value: string) => {
    setContents(contents.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSave({ ...course, ...formData, updated_at: new Date().toISOString() });
    } else {
      onSave({ ...formData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
  };

  const contentsByWeek = contents.filter(c => c.week === currentWeek);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-secondary-200 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-2xl font-heading font-bold text-white">
            {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título del Curso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Ej: Desarrollo Web Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código del Curso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="input"
                    placeholder="Ej: WEB-101"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Describe el curso..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructor *
                  </label>
                  <select
                    required
                    value={formData.instructor_id}
                    onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                    className="select"
                  >
                    <option value="">Seleccionar instructor...</option>
                    <option value="1">Juan Pérez - Desarrollo Web</option>
                    <option value="2">María González - IA</option>
                    <option value="3">Carlos Ruiz - Diseño</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración (semanas) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio (S/.) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="select"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contenido del Curso */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Contenido del Curso
              </h3>

              {/* Selector de semana */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {Array.from({ length: formData.duration_weeks }, (_, i) => i + 1).map((week) => (
                  <button
                    key={week}
                    type="button"
                    onClick={() => setCurrentWeek(week)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      currentWeek === week
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-gray-300 hover:bg-secondary-200'
                    }`}
                  >
                    Semana {week}
                  </button>
                ))}
              </div>

              {/* Botones para agregar contenido */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleAddContent(type.value as ContentType)}
                    className="btn btn-outline py-3 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={type.icon} className={type.color} />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Lista de contenidos de la semana actual */}
              <div className="space-y-3">
                {contentsByWeek.map((item) => {
                  const typeInfo = contentTypes.find(t => t.value === item.type);
                  return (
                    <div key={item.id} className="card p-4 bg-secondary-600/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 ${typeInfo?.color}`}>
                          <FontAwesomeIcon icon={typeInfo?.icon!} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Título del contenido"
                            value={item.title}
                            onChange={(e) => handleContentChange(item.id, 'title', e.target.value)}
                            className="input text-sm"
                          />
                          <input
                            type="text"
                            placeholder={item.type === 'anuncio' ? 'Contenido del anuncio' : 'URL del recurso'}
                            value={item.content}
                            onChange={(e) => handleContentChange(item.id, 'content', e.target.value)}
                            className="input text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveContent(item.id)}
                          className="text-red-600 hover:bg-danger/20 p-2 rounded-lg transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {contentsByWeek.length === 0 && (
                  <p className="text-center text-gray-300 py-4">
                    No hay contenido para esta semana. Agrega recursos usando los botones de arriba.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-secondary-200 bg-secondary-600/50 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
