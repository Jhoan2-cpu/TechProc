import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCalendar, faUser, faDownload } from '@fortawesome/free-solid-svg-icons';
import type { Report } from '../types';

interface ReportCardProps {
  report: Report;
  index: number;
  onDownload: (report: Report) => void;
}

export const ReportCard = ({ report, index, onDownload }: ReportCardProps) => {
  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-primary-600" />
            <div>
              <h4 className="font-heading font-bold text-white">
                {report.report_name}
              </h4>
              <p className="text-sm text-gray-400">{report.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
            <span className="px-2 py-1 bg-primary-900/20 text-primary-400 rounded text-xs font-bold uppercase">
              {report.report_type}
            </span>
            <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-bold uppercase">
              {report.format}
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendar} className="mr-1" />
              {report.generation_date}
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {report.generated_by_name}
            </span>
            <span className="text-gray-300">
              {(report.file_size_kb / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => onDownload(report)}
        >
          <FontAwesomeIcon icon={faDownload} />
          Descargar
        </button>
      </div>
    </div>
  );
};
