import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt,
  faDownload,
  faTrash,
  faClock,
  faFilePdf,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import type { Report } from '../types';

interface ReportCardProps {
  report: Report;
  index: number;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  onDownload: (report: Report) => void;
  onDelete: (report: Report) => void;
}

export const ReportCard = ({ 
  report, 
  index, 
  formatDate, 
  getStatusColor, 
  onDownload, 
  onDelete 
}: ReportCardProps) => {
  const getFormatIcon = (format: string) => {
    return format === 'pdf' ? faFilePdf : faFileExcel;
  };

  const getFormatColor = (format: string) => {
    return format === 'pdf' ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getFormatColor(report.format)} bg-secondary-200`}>
            <FontAwesomeIcon icon={getFormatIcon(report.format)} className="text-2xl" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-400">ID: {report.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.report_type)}`}>
                  {report.report_type_name}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getFormatColor(report.format)}`}>
                  {report.format.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white truncate">
                {report.report_title}
              </h3>
              <p className="text-sm text-gray-400">
                {formatDate(report.created_at)}
              </p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-3 line-clamp-2">{report.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faFileAlt} />
              {report.record_count} registros
            </span>
            <span className="text-gray-300">
              {report.file_size}
            </span>
            {report.is_expired && (
              <span className="px-2 py-1 bg-error/20 text-error rounded text-xs font-bold uppercase flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} />
                Expirado
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onDownload(report)}
            disabled={report.is_expired}
            className={`btn flex items-center gap-2 ${
              report.is_expired 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white`}
            title={report.is_expired ? 'Reporte expirado' : 'Descargar reporte'}
          >
            <FontAwesomeIcon icon={faDownload} />
            Descargar
          </button>
          
          <button
            onClick={() => onDelete(report)}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            title="Eliminar reporte"
          >
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};