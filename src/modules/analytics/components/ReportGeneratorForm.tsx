import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExport,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { ReportType, ReportFormat } from '../types';

interface ReportFormData {
  report_type: ReportType;
  format: ReportFormat;
  date_from: string;
  date_to: string;
  include_charts: boolean;
  include_raw_data: boolean;
}

interface ReportGeneratorFormProps {
  reportForm: ReportFormData;
  isGenerating: boolean;
  success: boolean;
  onFormChange: (data: ReportFormData) => void;
  onGenerate: () => void;
}

export const ReportGeneratorForm = ({
  reportForm,
  isGenerating,
  success,
  onFormChange,
  onGenerate,
}: ReportGeneratorFormProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileExport} className="text-blue-400" />
        Crear Reporte Personalizado
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Tipo de Reporte *
          </label>
          <select
            className="select w-full"
            value={reportForm.report_type}
            onChange={(e) => onFormChange({ ...reportForm, report_type: e.target.value as ReportType })}
          >
            <option value="asistencia">Asistencia</option>
            <option value="rendimiento">Rendimiento</option>
            <option value="progreso">Progreso</option>
            <option value="desercion">Riesgo de Deserción</option>
            <option value="general">General</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Formato *
          </label>
          <select
            className="select w-full"
            value={reportForm.format}
            onChange={(e) => onFormChange({ ...reportForm, format: e.target.value as ReportFormat })}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Fecha Inicio *
          </label>
          <input
            type="date"
            className="input w-full"
            value={reportForm.date_from}
            onChange={(e) => onFormChange({ ...reportForm, date_from: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Fecha Fin *
          </label>
          <input
            type="date"
            className="input w-full"
            value={reportForm.date_to}
            onChange={(e) => onFormChange({ ...reportForm, date_to: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded"
            checked={reportForm.include_charts}
            onChange={(e) => onFormChange({ ...reportForm, include_charts: e.target.checked })}
          />
          <span className="text-sm text-gray-300">Incluir gráficos</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded"
            checked={reportForm.include_raw_data}
            onChange={(e) => onFormChange({ ...reportForm, include_raw_data: e.target.checked })}
          />
          <span className="text-sm text-gray-300">Incluir datos crudos</span>
        </label>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          <FontAwesomeIcon icon={faFileExport} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Generando...' : 'Generar Reporte'}
        </button>
        {success && (
          <span className="text-green-400 font-semibold flex items-center gap-2 animate-fade-in">
            <FontAwesomeIcon icon={faCheckCircle} />
            ¡Reporte generado exitosamente!
          </span>
        )}
      </div>
    </div>
  );
};
