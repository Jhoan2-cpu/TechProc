import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faFileExport, 
  faExclamationTriangle,
  faEye,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import type { ReportFormData, ReportType, ReportFormat } from '../types';
import { reportService, type ReportType as ApiReportType } from '../services/reportService';

interface ReportFormModalProps {
  isOpen: boolean;
  reportTypes: ApiReportType[];
  onSave: (reportData: ReportFormData) => Promise<void>;
  onCancel: () => void;
}

export const ReportFormModal = ({ 
  isOpen, 
  reportTypes, 
  onSave, 
  onCancel 
}: ReportFormModalProps) => {
  const [formData, setFormData] = useState<ReportFormData>({
    report_type: 'students',
    format: 'pdf',
    start_date: '',
    end_date: '',
    include_charts: true,
    include_raw_data: false,
    report_title: '',
    filters: {}
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        report_type: 'students',
        format: 'pdf',
        start_date: '',
        end_date: '',
        include_charts: true,
        include_raw_data: false,
        report_title: '',
        filters: {}
      });
      setErrors({});
      setPreviewData(null);
      setShowPreview(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error: any) {
      if (error.details && typeof error.details === 'object') {
        setErrors(error.details);
      } else if (error.message) {
        setErrors({ general: [error.message] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!formData.start_date || !formData.end_date) {
      alert('Por favor, selecciona las fechas de inicio y fin');
      return;
    }

    try {
      const preview = await reportService.previewReport({
        ...formData,
        filters: {
          start_date: formData.start_date,
          end_date: formData.end_date,
        }
      });
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error: any) {
      console.error('Error generating preview:', error);
      alert('Error al generar la vista previa: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleReportTypeChange = (reportType: ReportType) => {
    const selectedType = reportTypes.find(t => t.key === reportType);
    setFormData({ 
      ...formData, 
      report_type: reportType,
      report_title: selectedType ? `${selectedType.name} - ${new Date().toLocaleDateString()}` : ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
        <div className="flex-shrink-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faFileExport} className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              Generar Nuevo Reporte
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Errores Generales */}
          {errors.general && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                <div>
                  {errors.general.map((error, idx) => (
                    <p key={idx} className="text-sm text-red-300">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Configuración del Reporte */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración del Reporte
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Reporte *
                </label>
                <select
                  required
                  value={formData.report_type}
                  onChange={(e) => handleReportTypeChange(e.target.value as ReportType)}
                  className={`input w-full ${errors.report_type ? 'border-red-500' : ''}`}
                >
                  {reportTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.report_type && (
                  <p className="text-xs text-red-400 mt-1">{errors.report_type[0]}</p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {reportTypes.find(t => t.key === formData.report_type)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Formato *
                </label>
                <select
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as ReportFormat })}
                  className={`input w-full ${errors.format ? 'border-red-500' : ''}`}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
                {errors.format && (
                  <p className="text-xs text-red-400 mt-1">{errors.format[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`input w-full ${errors.start_date ? 'border-red-500' : ''}`}
                />
                {errors.start_date && (
                  <p className="text-xs text-red-400 mt-1">{errors.start_date[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha Fin *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`input w-full ${errors.end_date ? 'border-red-500' : ''}`}
                />
                {errors.end_date && (
                  <p className="text-xs text-red-400 mt-1">{errors.end_date[0]}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Reporte
                </label>
                <input
                  type="text"
                  value={formData.report_title}
                  onChange={(e) => setFormData({ ...formData, report_title: e.target.value })}
                  className="input w-full"
                  placeholder="Título automático generado..."
                />
              </div>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Opciones Adicionales
            </h4>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.include_charts}
                  onChange={(e) => setFormData({ ...formData, include_charts: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Incluir gráficos (PDF)</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.include_raw_data}
                  onChange={(e) => setFormData({ ...formData, include_raw_data: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Incluir datos crudos</span>
              </label>
            </div>
          </div>

          {/* Vista Previa */}
          {showPreview && previewData && (
            <div className="card p-6 bg-primary-900/20 border-blue-200">
              <h4 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faEye} />
                Vista Previa del Reporte
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400">
                    <FontAwesomeIcon icon={faTable} className="mr-1" />
                    {previewData.total_records} registros encontrados
                  </span>
                  <span className="text-gray-400">
                    {previewData.columns.length} columnas
                  </span>
                </div>

                {previewData.preview_data.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-secondary-700 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-secondary-600">
                          {previewData.columns.map((column: string, index: number) => (
                            <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.preview_data.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="border-t border-secondary-600">
                            {previewData.columns.map((column: string, colIndex: number) => (
                              <td key={colIndex} className="px-4 py-2 text-sm text-gray-300">
                                {row[column]?.toString() || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <p className="text-xs text-gray-400 text-center">
                  Mostrando {previewData.preview_data.length} de {previewData.total_records} registros
                </p>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-between pt-4 border-t border-secondary-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={!formData.start_date || !formData.end_date || isSubmitting}
                className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faEye} />
                Vista Previa
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="btn bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.start_date || !formData.end_date}
                className="btn bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFileExport} />
                {isSubmitting ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};