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

export const NewsCard = ({ 
  news, 
  index, 
  formatDate, 
  getStatusColor, 
  onEdit, 
  onDelete, 
  onPublish, 
  onArchive 
}: NewsCardProps) => {
  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        {news.featured_image ? (
          <div 
            className="w-32 h-32 bg-secondary-200 rounded-lg flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${news.featured_image})` }}
          />
        ) : (
          <div className="w-32 h-32 bg-secondary-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faImage} className="text-gray-400 text-3xl" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-400">ID: {news.id_news}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(news.status)}`}>
                  {news.status === 'published' ? 'Publicado' : 
                   news.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
                <span className="px-2 py-1 bg-primary-900/20 text-blue-700 rounded text-xs">
                  {news.category}
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white truncate">
                {news.title}
              </h3>
              <p className="text-sm text-gray-400">
                Por {news.author_name || 'Autor'} • {formatDate(news.created_date)}
              </p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-3 line-clamp-2">{news.summary}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {news.tags.slice(0, 5).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-secondary-100/90 text-primary-800 rounded text-xs">
                #{tag}
              </span>
            ))}
            {news.tags.length > 5 && (
              <span className="px-2 py-1 bg-secondary-100/90 text-primary-800 rounded text-xs">
                +{news.tags.length - 5} más
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} />
              {news.views} vistas
            </span>
            {news.published_date && (
              <span>Publicado: {formatDate(news.published_date)}</span>
            )}
            {news.slug && (
              <span className="font-mono text-xs truncate">/{news.slug}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(news)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white"
            title="Editar noticia"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          
          {news.status === 'draft' && (
            <button
              onClick={() => onPublish(news)}
              className="btn bg-green-600 hover:bg-green-700 text-white"
              title="Publicar noticia"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
          
          {news.status === 'published' && (
            <button
              onClick={() => onArchive(news)}
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white"
              title="Archivar noticia"
            >
              <FontAwesomeIcon icon={faEyeSlash} />
            </button>
          )}
          
          <button
            onClick={() => onDelete(news)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
            title="Eliminar noticia"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};