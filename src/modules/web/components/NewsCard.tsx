import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faEdit,
  faTrash,
  faCheck,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import type { News } from '../types';

interface NewsCardProps {
  news: News;
  index: number;
  formatDate: (dateString: string | null) => string;
  getStatusColor: (status: string) => string;
  onEdit: (news: News) => void;
  onDelete: (news: News) => void;
  onPublish: (news: News) => void;
  onArchive: (news: News) => void;
}

export const NewsCard = ({ news, index, formatDate, getStatusColor, onEdit, onDelete, onPublish, onArchive }: NewsCardProps) => {
  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        {news.featured_image && (
          <div className="w-32 h-32 bg-secondary-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faImage} className="text-gray-400 text-3xl" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">{news.title}</h3>
              <p className="text-sm text-gray-400">Por {news.author_name} • {formatDate(news.created_date)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(news.status)}`}>
              {news.status}
            </span>
          </div>
          <p className="text-gray-300 mb-3">{news.summary}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">{news.category}</span>
            {news.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-secondary-100 text-gray-300 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} />
              {news.views} vistas
            </span>
            {news.published_date && <span>Publicado: {formatDate(news.published_date)}</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(news)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Editar
          </button>
          {news.status === 'draft' && (
            <button
              onClick={() => onPublish(news)}
              className="btn bg-green-600 hover:bg-green-700 text-white"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Publicar
            </button>
          )}
          {news.status === 'published' && (
            <button
              onClick={() => onArchive(news)}
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
              Ocultar
            </button>
          )}
          <button
            onClick={() => onDelete(news)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};
